import { bot, search } from './index.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, EmbedBuilder, InteractionResponse, ThreadAutoArchiveDuration } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { Op } from 'sequelize';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import commands from './commands.js';
import embed from './embed.js';
import fn from './fn.js';
import db from './models/index.js';
import cfg from './cfg.js';

const timeBetweenDiscussions = 24 * 60 * 60 * 1000;
const itemsPerVote = 3;

const itemTitle = item => `${item.name} (${item.itemType == 'boss' || item.character[0] == 'All' ? '' : item.character[0].replace('The ', '')+' '}${item.itemType})`;

var off = {off: false};
var lastHour = new Date().getHours();

const packDiscussionsFilename = 'packdiscussions.json';
if (!fs.existsSync(packDiscussionsFilename))
    fs.writeFileSync(packDiscussionsFilename, '[]');
const timeBetweenPackDiscussions = 24 * 60 * 60 * 1000 * 7;
var packDiscussions = JSON.parse(fs.readFileSync(packDiscussionsFilename));

function checkForDiscussions() {
    startThread();
    setInterval(startThread, 60000);

    bot.on('interactionCreate', async interaction => {
        try {
            if (interaction.isButton()) {
                let num = Number(interaction.customId);
                if (Number.isInteger(num) && num >= 0 && num < interaction.message.components[0].components.length) {
                    let discussion = await db.DailyDiscussion.findOne({where: {channel: interaction.channelId}});
                    if (discussion == null) return;
                    await db.DiscussionVote.destroy({where: {user: interaction.user.id, discussion: discussion.id}});
                    await db.DiscussionVote.create({user: interaction.user.id, discussion: discussion.id, vote: num});
                    await interaction.update({embeds: await Promise.all(interaction.message.embeds.map(async (e, i) => {
                        let votes = await db.DiscussionVote.count({where: {discussion: discussion.id, vote: i}});
                        return {...e.data, footer: votes > 0 ? {text: `${votes} vote${votes == 1 ? '' : 's'}`} : {}};
                    }))});
                }
            }
        } catch(e) {
            console.error(e);
        }
    });
};

function getAllServerItems(serverSettings) {
    let possibleMods = JSON.parse(serverSettings.mod);
    return search._docslist.filter(i => possibleMods.includes(i.mod) && i.hasOwnProperty('hasId') && i.hasId);
}

async function getItems(serverSettings, exclude=[]) {
    let previousItems = (await db.DailyDiscussion.findAll({
        attributes: ['item'],
        where: {guild: serverSettings.guild, item: {[Op.not]: null}}
    })).map(i => i.item);

    let possibleMods = JSON.parse(serverSettings.mod);
    let possibleItems = search._docslist.filter(item =>
        possibleMods.includes(item.mod)
        && ['card', 'relic', 'potion', 'event', 'boss'].includes(item.itemType)
        && !['Event', 'Special'].includes(item.rarity)
        && item.tier != 'Special'
        && !['???', 'Strike', 'Defend'].includes(item.name)
    )
        .map(item => item.searchId)
        .filter(item => !previousItems.includes(item) && !exclude.includes(item));
    
    let items = Array(Math.min(possibleItems.length, itemsPerVote)).fill().map(_ => possibleItems.splice(Math.floor(Math.random() * possibleItems.length), 1)[0]);

    return {
        items,
        embeds: await Promise.all(items.map(i => embed({...search._docslist.find(e => e.searchId == i), score: 1, query: fn.unPunctuate(i)}))),
        components: items.length == 0 ? [] : [new ActionRowBuilder().addComponents(items.map((v, i) => new ButtonBuilder().setCustomId(i.toString()).setLabel(itemTitle(search._docslist.find(e => e.searchId == v))).setStyle(ButtonStyle.Secondary)))],
        discussionNum: previousItems.length+1,
        total: previousItems.length+possibleItems.length+items.length+exclude.length,
    };
}

async function firstDiscussion(serverSettings) {
    let next = Date.now() + timeBetweenDiscussions;
    let channel = await bot.channels.fetch(serverSettings.discussionChannel);
    let thread = await channel.threads.create({name: `Daily Discussion Meta Thread`}).catch(e => {});
    let { items, embeds, components, total } = await getItems(serverSettings);
    if (thread == null) return;
    let voteMessage = await thread.send({
        content: items.length > 0 ? `Vote for the first Daily Discussion here! (Starting <t:${~~(next/1000)}:R> - ${total} items to discuss in total)` : 'Error: couldn\'t find any valid items to discuss!',
        embeds,
        components,
    });
    voteMessage.pin().catch(e => {});
            
    db.DailyDiscussion.create({
        guild: serverSettings.guild,
        channel: thread.id,
        item: null,
        next,
        voteMessage: voteMessage.id,
        voteOptions: JSON.stringify(items)
    });
};

async function startThread() {
    await Promise.all((await db.ServerSettings.findAll()).map(async serverSettings => {
        if (serverSettings.discussionChannel == null) return;
        let lastDiscussion = await db.DailyDiscussion.findOne({where: {guild: serverSettings.guild}, order: [['createdAt', 'DESC']]});
        if (lastDiscussion != null) {
            let forceItem = null;
            if (serverSettings.forceDiscussion != null) {
                let allItems = getAllServerItems(serverSettings);
                if (serverSettings.forceDiscussion >= 0 && serverSettings.forceDiscussion < allItems.length)
                    forceItem = allItems[serverSettings.forceDiscussion];
            }
            if (forceItem != null || lastDiscussion.next < Date.now()) {
                let oldThread = await bot.channels.fetch(lastDiscussion.channel);
                let options = JSON.parse(lastDiscussion.voteOptions);
    
                let votes = {};
                let itemId;
                let item;
                if (forceItem != null)
                    itemId = forceItem.searchId;
                else {
                    if (options.length > 0) {
                        let winner = 0;
                        for (let i of (await db.DiscussionVote.findAll({attributes: ['vote'], where: {discussion: lastDiscussion.id}})).map(v => v.vote))
                            votes[i] = votes.hasOwnProperty(i) ? votes[i] + 1 : 1;
                        if (Object.keys(votes).length > 0) {
                            let highest = Object.keys(votes).filter(v => votes[v] == Math.max(...Object.values(votes)));
                            winner = Number(highest[Math.floor(Math.random() * highest.length)]);
                        }
                
                        itemId = options[winner];
                    } else {
                        let availableItems = (await getItems(serverSettings)).items;
                        if (availableItems.length == 0) {
                            lastDiscussion.update({next: lastDiscussion.next + timeBetweenDiscussions});
                            return;
                        };
                        itemId = availableItems[0];
                    }
                }
    
                item = fn.find(itemId);
                let channel = await bot.channels.fetch(serverSettings.discussionChannel);
                if (channel == null) return;
        
                let { items, embeds, components, discussionNum, total } = await getItems(serverSettings, [itemId]);
        
                let thread = await oldThread.parent.threads.create({name: `${itemTitle(item.item)} - Daily Discussion ${(new Date()).getDate()} ${(new Date()).toLocaleString('default', {month: 'long'}).slice(0, 3)}`}).catch(e => {});
                if (thread == null) return;
                await thread.send(`Previous Daily Discussion: <#${oldThread.id}>`);
                let voteMessage = await thread.send({
                    content: items.length > 0 ? `Vote for tomorrow's Daily Discussion (<t:${~~((lastDiscussion.next + timeBetweenDiscussions)/1000)}:R>) here!` : 'No items left to vote on!',
                    embeds,
                    components,
                });
                voteMessage.pin().catch(e => {});
                
                let daEmbed = await embed({...item.item, score: item.score, query: itemId});
                let itemMessage = await thread.send({
                    content: `Daily Discussion ${discussionNum}/${total}`,
                    embeds: [
                        EmbedBuilder.from({...daEmbed.data, thumbnail: {}, image: daEmbed.data.thumbnail}),
                    ]
                }).catch(e => {});
                itemMessage.pin().catch(e => {});
                
                let time = lastDiscussion.next;
                while (time <= Date.now())
                    time += timeBetweenDiscussions;
    
                await serverSettings.update({forceDiscussion: null});

                await db.DailyDiscussion.create({
                    guild: serverSettings.guild,
                    channel: thread.id,
                    item: itemId,
                    next: time,
                    voteMessage: voteMessage.id,
                    voteOptions: JSON.stringify(items),
                });
        
                if (lastDiscussion.voteMessage != null)
                    await (await oldThread.messages.fetch(lastDiscussion.voteMessage).catch(e => {}))?.edit({
                        content: `Next Daily Discussion: <#${thread.id}>\n\n__Votes__:\n${options.map((e,i) => `${itemTitle(fn.find(e).item)}: ${votes.hasOwnProperty(i) ? votes[i] : 0}`).join('\n')}`,
                        embeds: [],
                        components: []
                    }).catch(e => {});
                await oldThread.setArchived(true).catch(e => {});
                let silentAddMessage = await thread.send('Adding subscribed users...');
                for (let subscriber of await db.Subscription.findAll({where: {guild: serverSettings.guild}}))
                    await silentAddMessage.edit(`Adding subscribed users...\n<@${subscriber.user}>`);
                await silentAddMessage.delete();
                return;
            }
        }
    }));

    await Promise.all((await db.Reminder.findAll({where: {at: {[Op.lt]: Date.now()}}})).map(async reminder => {
        let user = await bot.users.fetch(reminder.user);
        if (user)
            user.send({embeds: [EmbedBuilder.from({title: reminder.contents, description: reminder.message})]}).catch(e => console.error);
        reminder.destroy();
    }));

    if (new Date().getHours() != lastHour) {
        lastHour = new Date().getHours();
        if (cfg.workshopReleasesChannel != null) {
            let response = await fetch('https://steamcommunity.com/workshop/browse/?appid=646570&browsesort=mostrecent&section=readytouseitems&actualsort=mostrecent&p=1&numperpage=9');
            let body = await response.text();
            
            if (body.includes('workshopItem')) {
                let dom = new JSDOM(body);
                let items = Array.from(dom.window.document.getElementsByClassName('workshopItem')).map(e => ({
                    id: e.children[0].getAttribute('data-publishedfileid'),
                    name: e.children[4].children[0].innerHTML,
                    url: e.children[0].href,
                    img: e.children[0].children[0].children[0].src,
                    author: e.children[5].children[0].innerHTML,
                    authorURL: e.children[5].children[0].href,
                    weirdScriptThingy: e.parentElement.children[Array.from(e.parentElement.children).indexOf(e)+1].innerHTML.trim()
                }));
                let existsAlready = await Promise.all(items.map(async i => i.hasOwnProperty('id') && (await db.WorkshopItem.count({where: {id: i.id}}) > 0)));
                items = items.filter((e, i) => !existsAlready[i]);
                items.forEach(i => {
                    db.WorkshopItem.create({id: i.id});
                    i.description = JSON.parse(i.weirdScriptThingy.slice(i.weirdScriptThingy.indexOf('{'), -3)).description.replaceAll('<br />', '');
                });

                if (items.length > 0) {
                    let embeds = items.map(i => ({
                        title: i.name,
                        url: i.url,
                        description: i.description,
                        thumbnail: {url: i.img},
                        author: {name: `${i.author}'s Workshop`, url: i.authorURL, iconURL: `https://static.wikia.nocookie.net/logopedia/images/5/56/Steam_Icon_2014.svg/revision/latest/scale-to-width-down/50?cb=20190826175003`},
                        color: 1779768,
                    }));
                    let channel = await bot.channels.fetch(cfg.workshopReleasesChannel);
                    if (channel != null)
                        channel.send({content: `${embeds.length > 1 ? `${embeds.length} n` : 'N'}ew Steam Workshop release${embeds.length > 1 ? 's' : ''}!`, embeds});
                }
            }
        }
    }

    if (cfg.hasOwnProperty('packDiscussions') && cfg.packDiscussions != null && Date.now() > cfg.packDiscussions.startTime + timeBetweenPackDiscussions * packDiscussions.length) {
        let packs = fn.findAll('type=pack mod=packmaster mod=pmexpansion')
            .filter(p => !packDiscussions.includes(p.item.id));
        if (packs.length > 0) {
            let pack = fn.shuffle(packs)[0];
            let channel = await bot.channels.fetch(cfg.packDiscussions.channel);
            if (channel) {
                let daEmbed = await embed({...pack.item, score: pack.score, query: fn.unPunctuate(pack.item.id)});
                let mods = [pack.item.mod, "Slay the Spire"];
                let cards = pack.item.cards.map(n => search._docslist.find(c => c.name == n && c.itemType == 'card' && mods.includes(c.mod))); //search._docslist.filter(c => c.itemType == 'card' && mods.includes(c.mod) && item.item.cards.includes(c.name));
                let canvas = createCanvas(339 * 5, 437 * Math.ceil(cards.length / 5));
                let ctx = canvas.getContext('2d');
                for (let i = 0; i < cards.length; i++) {
                    let img = await loadImage('docs/'+cards[i].img);
                    ctx.drawImage(img, 0, 0, 678, 874, (i % 5) * 339, Math.floor(i / 5) * 437, 339, 437);
                }
                let filename = `export${String(Math.random()).slice(2)}.png`;
                fs.writeFileSync(filename, canvas.toBuffer('image/png'));
                let thread = await channel.threads.create({
                    name: `${pack.item.name} - PM Pack Discussion #${packDiscussions.length + 1}`,
                    appliedTags: cfg.packDiscussions.tags,
                    message: {
                        content: pack.item.description,
                        embeds: [
                            EmbedBuilder.from({...daEmbed.data, thumbnail: {}, image: daEmbed.data.thumbnail}),
                            EmbedBuilder.from({
                                title: 'Cards',
                                description: cards.map(c => `[${c.name}](${c.url}) ${c.cost.length > 0 ? `(${c.cost} ${c.character[2]})` : ''}: ${c.description.replaceAll('\n', ' ')}`).join('\n').slice(0, 4096),
                                image: {url: 'attachment://'+filename},
                                color: 11375735,
                            })
                        ],
                        files: [filename]
                    },
                    autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays
                }).catch(e => console.error(e));
                fs.rmSync(filename);
                if (thread) {
                    packDiscussions.push(pack.item.id);
                    fs.writeFileSync(packDiscussionsFilename, JSON.stringify(packDiscussions));
                }
            }
        }
    }

    if (off.off) {
        bot.user.setStatus('dnd');
        bot.user.setActivity('restarting...');
        setTimeout(process.exit, 2000);
    }
}

export {checkForDiscussions, firstDiscussion, off, getAllServerItems};