import fetch from 'node-fetch';
import { Client, GatewayIntentBits, ContextMenuCommandBuilder, ApplicationCommandType, Partials, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Collection, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';
import MiniSearch from 'minisearch';
import fs from 'fs';
import commands from './commands.js';
import embed from './embed.js';
import characters from './characters.js';
import keywordify from './keywords.js';
import emojify from './emojis.js';
import cfg from './cfg.js';
import fn from './fn.js';
import { checkForDiscussions, firstDiscussion, getAllServerItems } from './dailyDiscussion.js';
import db from './models/index.js';
import { match } from 'assert';
import express from 'express';

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] });

const search = new MiniSearch({
    fields: ['name', 'searchText'],
    searchOptions: {
        fuzzy: true,
        boost: {
            name: 0.1
        }
    }
});
search._docs = {};
search.searchFn = search.search;
search.search = str => {
    let results = search.searchFn(fn.unPunctuate(str));
    if (str.filter) results = results.filter(str.filter);
    results.forEach(r => r.item = search._docs[r.id]);
    return results;
}
const queryLimit = 10; //max number of embeds on a discord message
var data;
String.prototype.exactMatch = function compare(str) {
    return this == str;
}

const oldRedirects = JSON.parse(fs.readFileSync('./oldredirects.json'));
var website = express();
website.set('views', './views')
website.set('view engine', 'pug');
var router = express.Router({caseSensitive: true});
router.get('/redirect/*', (req, res) => res.redirect(decodeURIComponent(req.originalUrl.slice('/redirect/'.length))));
router.use('/', (req, res, next) => {
    if (req.originalUrl.includes('cards/') || req.originalUrl.includes('potions/')) {
        let imageUrl;
        if (req.originalUrl.includes('cards/'))
            imageUrl = req.originalUrl.slice(req.originalUrl.indexOf('cards/'))
        if (req.originalUrl.includes('potions/'))
            imageUrl = req.originalUrl.slice(req.originalUrl.indexOf('potions/'))
        if (oldRedirects[0].includes(imageUrl)) {
            let index = oldRedirects[0].indexOf(imageUrl);
            if (oldRedirects[0][index] == oldRedirects[1][index])
                return next();
            return res.redirect(req.originalUrl.replace(imageUrl, oldRedirects[1][index]));
        }
    }
    if (req.originalUrl != req.originalUrl.toLowerCase())
        return res.redirect(req.originalUrl.toLowerCase());
    next();
});
router.get('/', (req, res) => res.render('home'));
router.get('/exports', (req, res) => res.sendFile('./docs/index.html', {root: '.'}));
router.get('/search', async (req, res) => res.render('search', {
    results: req.originalUrl.length > 8 ? fn.findAll(decodeURIComponent(req.originalUrl.slice(8))).slice(0, 10) : [],
    firstEmbed: req.originalUrl.length > 8 ? await embed({...(fn.find(decodeURIComponent(req.originalUrl.slice(8))).item), score: 0, query: ''}) : {},
    query: req.originalUrl.length > 8 ? fn.unPunctuate(decodeURIComponent(req.originalUrl.slice(8))) : ''
}));
router.get('/collection', async (req, res) => res.render('collection', {characters, query: req.originalUrl.length > 12 ? fn.unPunctuate(decodeURIComponent(req.originalUrl.slice(12))) : ''}));
router.get('/s', (req, res) => {
    if (req.originalUrl.length > 3)
        return res.json(fn.findAll(decodeURIComponent(req.originalUrl.slice(3))).slice(0, 50));
    else return res.json([]);
});
router.get('/sf', (req, res) => {
    if (req.originalUrl.length > 4)
        return res.json(fn.findAll(decodeURIComponent(req.originalUrl.slice(4))));
    else return res.json([]);
});
router.get('/e', async (req, res) => {
    if (req.originalUrl.length > 3) {
        let e = (await embed({...(fn.find(decodeURIComponent(req.originalUrl.slice(3)))).item, score: 0, query: ''})).data;
        return res.send(`<html><head>
        </head></html>`);
    }
    else return res.send('');
});
router.get('/w/*/*', async (req, res) => {
    if (req.originalUrl.endsWith('/')) return res.redirect(req.originalUrl.slice(0, -1));
    let modName = decodeURIComponent(req.originalUrl).slice(3);
    let itemId = modName.slice(modName.indexOf('/')+1);
    modName = modName.slice(0, modName.indexOf('/'));
    let item = search._docslist.find(i => i.mod.toLowerCase() == modName && i.id.toLowerCase() == itemId);
    if (item != undefined) {
        if (item.hasId) {
            let cards;
            if (item.itemType == 'pack')
                cards = item.cards.map(c => search._docslist.find(i => i.itemType == 'card' && (i.mod == item.mod || i.mod == "Slay the Spire") && i.name == c)).filter(c => c != undefined);
            let pack;
            if (item.hasOwnProperty('pack'))
                pack = search._docslist.find(i => i.mod == item.mod && i.itemType == 'pack' && i.name == item.pack);
            return res.render('wiki/item', {
                item,
                embed: (await embed({...item, score: 0, query: ''})).data,
                cards,
                pack
            });
        }
        else return res.send("This item type is not yet supported, sorry!");
    }
        else return res.send("Could not find that item, sorry!");
});
router.use('/', express.static('./static'));
router.use('/', express.static('./docs'));
website.use(router);

export {bot, search, website, setActivity};

const setActivity = () => {
    if (fs.existsSync('presence.txt'))
        bot.user.setActivity(fs.readFileSync('presence.txt', 'utf-8'));
    else bot.user.setActivity('Slay the Spire | <help>');
};

bot.once('ready', async () => {
    setActivity();
    setInterval(setActivity, 1000 * 60 * 60);
	console.log('connected to discord. ready!');
    await bot.users.fetch().catch(e => {});
    await bot.channels.fetch().catch(e => {});
    bot.channels.cache.each(channel => {
        if (channel.hasOwnProperty('messages'))
            channel.messages.fetch().catch(e => {});
    });
    checkForDiscussions();

    await bot.application?.commands.set([
        new SlashCommandBuilder()
            .setName('i')
            .setDescription('Finds an item from Slay the Spire and displays info about it.')
            .addStringOption(option =>
                option.setName('query')
                .setDescription('Item name')
                .setRequired(true)
                .setAutocomplete(true)),
        new SlashCommandBuilder()
            .setName('addservermod')
            .setDescription('Adds a main mod to this server or DM channel.')
            .addStringOption(option =>
                option.setName('mod')
                .setDescription('Mod name')
                .setRequired(true)
                .setAutocomplete(true)),
        new SlashCommandBuilder()
            .setName('removeservermod')
            .setDescription('Removes a main mod from this server or DM channel.')
            .addStringOption(option =>
                option.setName('mod')
                .setDescription('Mod name')
                .setRequired(true)
                .setAutocomplete(true)),
        new SlashCommandBuilder()
            .setName('addusermod')
            .setDescription('Adds a mod to your personal <> calls.')
            .addStringOption(option =>
                option.setName('mod')
                .setDescription('Mod name')
                .setRequired(true)
                .setAutocomplete(true)),
        new SlashCommandBuilder()
            .setName('removeusermod')
            .setDescription('Removes a mod from your personal <> calls.')
            .addStringOption(option =>
                option.setName('mod')
                .setDescription('Mod name')
                .setRequired(true)
                .setAutocomplete(true)),
        new SlashCommandBuilder()
            .setName('setdiscussionchannel')
            .setDescription('Bot will create a thread to discuss a random item from the server\'s main mod every day.')
            .setDMPermission(false)
            .addBooleanOption(option =>
                option.setName('on')
                .setDescription('Enable or disable Daily Discussions in this server?')
                .setRequired(true)),
        new SlashCommandBuilder()
            .setName('subscribe')
            .setDescription('When subscribed, I will automatically add you to future daily discussions in this server.')
            .setDMPermission(false)
            .addBooleanOption(option =>
                option.setName('on')
                .setDescription('Should I automatically add you to daily discussions?')
                .setRequired(true)),
        new SlashCommandBuilder()
            .setName('run')
            .setDescription('Simulates you sending a message and sends the result in a message only you can see.')
            .addStringOption(option =>
                option.setName('contents')
                .setDescription('Write a message using bot commands as you would in a normal message here.')
                .setRequired(true))
            .addAttachmentOption(option => 
                option.setName('attachment')
                .setDescription('Simulated attachment, if needed for stuff like artpreview.')),
        new SlashCommandBuilder()
            .setName('customcommands')
            .setDMPermission(false)
            .setDescription('Manage this server\'s custom commands.'),
        new SlashCommandBuilder()
            .setName('forcenextdailydiscussion')
            .setDescription('Immediately starts the next daily discussion with a certain item')
            .setDMPermission(false)
            .addStringOption(option =>
                option.setName('item')
                .setDescription('Item (must use autofill)')
                .setRequired(true)
                .setAutocomplete(true)),
        new ContextMenuCommandBuilder()
            .setName('find items')
            .setType(ApplicationCommandType.Message),
        new ContextMenuCommandBuilder()
            .setName('delete')
            .setType(ApplicationCommandType.Message)
    ]);
});

let validQuery = q => !(q.startsWith('@') || q.startsWith('#') || q.startsWith(':') || q.startsWith('/') || q.startsWith('a:') || q.startsWith('t:') || q.startsWith('id:') || q.startsWith('http') || q.startsWith("sound:") || q == 'init' || q.length <= 0);
async function getEmbeds(msg, edit=true) {
    if (msg.content.includes('`')) return 0;
    let queries = [...msg.content.matchAll(/(?<=(^|[^\\]))((\<(.*?)\>)|(\[\[(.*?)\]\]))/g)];
    let filters = queries.filter(e => e[2].trim().startsWith('<') ? validQuery(e[4]) : validQuery(e[6])).map(e => e[2].trim().startsWith('<'));
    queries = queries.map(e => e[2].trim().startsWith('<') ? e[4] : e[6]).filter(validQuery);
    if (queries.length <= queryLimit) {
        if (queries.length > 0) {
            let typing;
            if (!edit) typing = msg.channel.sendTyping();
            let embeds = [];
            let server = await db.ServerSettings.findOne({where: {guild: msg.inGuild() ? msg.guildId : msg.channelId}});
            let user = await db.User.findOne({where: {id: msg.author.id}});
            let filter = item => ['Slay the Spire', ...(server == null ? [] : JSON.parse(server.mod)), ...(user == null ? [] : JSON.parse(user.mods))].includes(item.item.mod);
            for (let i = 0; i < queries.length; i++) {
                if (!edit)
                    typing = msg.channel.sendTyping();
                let originalQuery = queries[i];
                let query = new String(fn.unPunctuate(originalQuery));
                query.filter = filters[i] ? filter : false;
                let item;
                if (msg.inGuild()) {
                    let customCommand = await db.CustomCommand.findOne({where: {guild: msg.guildId, call: query}});
                    if (customCommand != null)
                        item = {item: {
                            name: customCommand.title,
                            command: customCommand,
                            itemType: 'custom',
                            originalQuery,
                        }};
                }
                for (let type of [['prefix', 'startsWith'], ['suffix', 'endsWith'], ['exact', 'exactMatch']])
                    for (let i in commands[type[0]])
                        if (query[type[1]](i))
                            item = {item: {
                                name: i,
                                type: type[0],
                                do: commands[type[0]][i],
                                itemType: 'command',
                                originalQuery,
                            }};
                    for (let i of commands.prefixAndSuffix)
                        if (query.startsWith(i[0]) && query.endsWith(i[1]))
                            item = {item: {
                                name: i[0],
                                suffix: i[1],
                                type: 'prefixAndSuffix',
                                do: i[2],
                                itemType: 'command',
                                originalQuery,
                            }};
                if (!item)
                    item = fn.find(query)
                console.log(`${msg.author.username} searched for "${query}", found ${typeof item == 'object' ? `${item.item.itemType} "${item.item.name}"` : 'nothing'}`);
                let genEmbed = await embed({...item.item, score: item.score, query}, msg, embeds);
                if (genEmbed != null) {
                    embeds.push(genEmbed);
                    if (genEmbed.data.hasOwnProperty('extra_embeds'))
                        embeds = [...embeds, ...genEmbed.data.extra_embeds.map(e => EmbedBuilder.from(e))];
                }
            }
            let components = [];
            for (let i of embeds) {
                while (embeds.find(e => e != i && e.data.title == i.data.title) != undefined)
                    i.data.title += ' ';
                while (i.data.hasOwnProperty('url') && embeds.find(e => e != i && e.data.hasOwnProperty('url') && e.data.url == i.data.url) != undefined)
                    i.data.url += '?';
                if (i.data.hasOwnProperty('components'))
                    components = [...components, ...i.data.components];
            }
            components = components.slice(0, 25);
            embeds.components = [];
            for (let i = 0; i < embeds.components; i += 5)
                embeds.components.push(new ActionRowBuilder.addComponents(embeds.components.slice(i, i + 5)));
            await typing;
            return embeds; //
        } else return 0;
    } else return null; //msg.reply("I can only take up to 10 queries at a time!").catch(e => {});
}

function getFilesFromEmbeds(embeds, spoiler=false) {
    let files = [];
    for (let embed of embeds) {
        files = [...files, ...(Array.isArray(embed.data.files) ? embed.data.files : [])];
        if (spoiler)
            files = files.map(file => {
                let newName = `SPOILER_${file}`;
                for (let i of ['author', 'thumbnail', 'image', 'footer'])
                    if (embed.data.hasOwnProperty(i))
                        for (let j of ['iconURL', 'url'])
                            if (embed.data[i].hasOwnProperty(j))
                                embed.data[i][j] = embed.data[i][j].replace(file, newName);
                if (fs.existsSync(file))
                    fs.renameSync(file, newName);
                return newName;
            });
        delete embed.files;
    }
    return files;
}

const delfiles = files => files.forEach(file => fs.unlinkSync(file));

const emojiReactions = {
    '🦊': ['fox', 'silent', 'girl'],
    '🐈': ['cat', 'kitty', 'kitten', 'meow', 'purrr'],
    '🐀': ['rat'],
    '🐃': ['buffalo'],
    '🐑': ['sheep', 'bah', 'baah', 'baaah'],
    '🐶': ['dog', 'woof', 'bark', 'puppy'],
    '🐼': ['panda'],
    '🐻': ['bear'],
    '🐵': ['monkey', 'see_no_evil', 'hear_no_evil', 'speak_no_evil'], // monkey-containing emoji that don't contain the word "monkey"
    '🦁': ['lion'],
    '🐯': ['tiger'],
    '🐢': ['turtle'],
    '🐸': ['frog'],
    '🦦': ['otter'],
};

bot.on('messageCreate', async msg => {
    if (msg.inGuild() && msg.member)
        for (let i in emojiReactions) {
            if (msg.member.displayName.includes(i)) {
                if (msg.content.includes(i))
                    msg.react(i);
                for (let j of emojiReactions[i])
                    if (msg.content.toLowerCase().includes(j))
                        msg.react(i);
            }
        }
    let embeds = await getEmbeds(msg, false);
    if (embeds === null)
        msg.reply('I can only take up to 10 queries at a time! Edit your message to use 10 or fewer queries, and I\'ll update mine.').catch(e => {});
    else if (embeds === 0) return;
    else {
        let files = getFilesFromEmbeds(embeds, msg.content.includes('(s)'));
        if (files.length > 10) await msg.reply('I can only attach 10 images per message! Edit your message so that I would use fewer than 10 images in my reply, and I\'ll update mine.');
        else {
            let reply;
            if (msg.content.includes('(s)')) {
                reply = await msg.reply({content: `||https://bit.ly/3aSgJDF||`, allowedMentions: {repliedUser: false}});
                await (new Promise(res => setTimeout(res, 1000)));
                await reply.edit({embeds,components: embeds.components, files, allowedMentions: {repliedUser: false}}).catch(e => {});
            } else
                reply = await msg.reply({embeds, components: embeds.components, files, allowedMentions: {repliedUser: false}}).catch(e => {});
            if (msg.author.id == 115569858724233216 && msg.inGuild() && Math.random() < 0.1) //10% chance if vex is the caller
                for (let i of ["👀", "😤", "👍", "👆"])
                    reply.react(i);
        };
        delfiles(files);
    }
});

let edit = async (editing, from, managed=false) => {
    let embeds = await getEmbeds(from);
    if (embeds === null)
        editing.edit({content: 'I can only take up to 10 queries at a time! Edit your message to use 10 or fewer queries, and I\'ll update mine.', embeds: []}).catch(e => {});
    else if (embeds === 0)
        editing.delete().catch(e => {});
    else {
        let files = getFilesFromEmbeds(embeds, from.content.includes('(s)'));
        if (files.length > 10) await editing.edit({content: 'I can only attach 10 images per message! Edit your message so that I would use fewer than 10 images in my reply, and I\'ll update mine.', embeds: [], files: []});
        else {
            let pre = managed ? '(edited by a bot manager) ' : '';
            if (from.content.includes('(s)')) {
                await editing.edit({content: pre+'||https://bit.ly/3aSgJDF||', embeds: [], files: [], allowedMentions: {repliedUser: false}});
                await (new Promise(res => setTimeout(res, 1000)));
                await editing.edit({content: editing.content, embeds, components: embeds.components, files, allowedMentions: {repliedUser: false}}).catch(e => {});
            } else
                await editing.edit({content: pre, embeds, components: embeds.components, files, allowedMentions: {repliedUser: false}}).catch(e => {});
        }
        delfiles(files);
    }
}
let onEdit = async (oldMsg, newMsg, managed=false) => {
    let contentBefore = newMsg.content;
    let messages;
    try {
        messages = await newMsg.channel.messages.fetch();
    } catch(e) {
        return;
    }
    let reply = messages.find(i => i.author.id == bot.user.id && i.reference != null && i.reference.messageId == oldMsg.id);
    if (reply != undefined) {
        if (oldMsg.attachments.size > newMsg.attachments.size) return;
        newMsg.content = contentBefore;
        await edit(reply, newMsg, managed);
    } else
        bot.emit('messageCreate', newMsg);
}
bot.on('messageUpdate', onEdit);
bot.on('messageDelete', async msg => (await msg.channel.messages.fetch()).filter(i => i.author.id == bot.user.id && i.reference != null && i.reference.messageId == msg.id).forEach(m => m.delete().catch(e => {})));

bot.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'i':
                    await interaction.deferReply();
                    interaction.content = `[[${interaction.options.getString('query')}]]`;
                    if (fn.unPunctuate(interaction.content) == 'del' || fn.unPunctuate(interaction.content) == 'spoiler')
                        return await interaction.deleteReply();
                    interaction.author = interaction.user;
                    let embeds = await getEmbeds(interaction);
                    if (embeds.length == 0)
                        return await interaction.deleteReply();
                    await interaction.editReply({embeds, components: embeds.components});
                    break;

                case 'run':
                    await interaction.deferReply({ephemeral: true});
                    interaction.content = interaction.options.getString('contents');
                    if (interaction.content.startsWith('devedit') && cfg.overriders.includes(interaction.user.id)) {
                        let args = interaction.content.split(' ');
                        let msg;
                        if (args.length > 1)
                            msg = await interaction.channel.messages.fetch(args[1]);
                        if (msg) {
                            msg.content = interaction.content;
                            if (msg.author.id == bot.user.id)
                                await edit(msg, msg, true);
                            else
                                await onEdit(msg, msg, true);
                        }
                        return await interaction.deleteReply();
                    }
                    if (interaction.content.startsWith('devsay ') && cfg.overriders.includes(interaction.user.id)) {
                        await interaction.channel.sendTyping();
                        setTimeout(() => interaction.channel.send(interaction.content.slice('devsay '.length).replaceAll('\\n', '\n')), 1000);
                        return await interaction.deleteReply();
                    }
                    let attachment = interaction.options.getAttachment('attachment');
                    if (attachment != null)
                        interaction.attachments = new Collection([[attachment.id, attachment]]);
                    if (fn.unPunctuate(interaction.content) == 'del' || fn.unPunctuate(interaction.content) == 'spoiler')
                        return await interaction.deleteReply();
                    interaction.author = interaction.user;
                    let embedsR = await getEmbeds(interaction);
                    if (embedsR.length == 0)
                        return await interaction.deleteReply();
                    if (embedsR === 0)
                        return await interaction.editReply({content: interaction.content});
                    let files = getFilesFromEmbeds(embedsR)
                    if (files.length > 10) await interaction.editReply({content: 'I can only attach 10 images per message! Edit your command so that I would use fewer than 10 images in my reply.'});
                    else await interaction.editReply({content: `\`${interaction.content}\``, embeds: embedsR, files, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('sendToAll').setLabel('Send to channel').setStyle(ButtonStyle.Secondary))]});
                    delfiles(files);
                    break;

                case 'addservermod':
                    await interaction.deferReply();
                    let mod = interaction.options.getString('mod');
                    if (interaction.inGuild()) {
                        if (!(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return interaction.editReply('You must have the Manage Server permission to use this command.');
                        let settings = await db.ServerSettings.findOne({where: {guild: interaction.guildId}});
                        if (settings == null)
                            await db.ServerSettings.create({guild: interaction.guildId, mod: JSON.stringify([mod])});
                        else
                            await db.ServerSettings.update({mod: JSON.stringify([...JSON.parse(settings.mod), mod])}, {where: {guild: interaction.guildId}});
                        await interaction.editReply(`Added \`${mod}\` to this server's main mods.`);
                    } else {
                        let settings = await db.ServerSettings.findOne({where: {guild: interaction.channelId}});
                        if (settings == null)
                            await db.ServerSettings.create({guild: interaction.channelId, mod: JSON.stringify([mod])});
                        else
                            await db.ServerSettings.update({mod: JSON.stringify([...JSON.parse(settings.mod), mod])}, {where: {guild: interaction.channelId}});
                        await interaction.editReply(`Added \`${mod}\` to this DM channel's main mods.`);
                    }
                    break;
                
                case 'removeservermod':
                    await interaction.deferReply();
                    let removeMod = interaction.options.getString('mod');
                    let settings;
                    if (interaction.inGuild()) {
                        if (!(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id)))
                            return interaction.editReply('You must have the Manage Server permission to use this command.');
                        settings = await db.ServerSettings.findOne({where: {guild: interaction.guildId}});
                    } else
                        settings = await db.ServerSettings.findOne({where: {guild: interaction.channelId}});
                    if (settings == null)
                        return interaction.editReply('Can\'t remove a server mod if you haven\'t set any yet!');
                    await settings.update({mod: JSON.stringify(JSON.parse(settings.mod).filter(m => m != removeMod))});
                    if (interaction.inGuild())
                        await interaction.editReply(`Removed \`${removeMod}\` from this server\'s main mods.`);
                    else
                        await interaction.editReply(`Removed \`${removeMod}\` from this DM channel's main mods.`);
                    break;

                case 'addusermod':
                    await interaction.deferReply({ephemeral: true});
                    let userMod = interaction.options.getString('mod');
                    if (interaction.inGuild()) {
                        let settings = await db.User.findOne({where: {id: interaction.user.id}});
                        if (settings == null)
                            await db.User.create({id: interaction.user.id, mods: JSON.stringify([userMod])});
                        else
                            await db.User.update({mods: JSON.stringify([...JSON.parse(settings.mods), userMod])}, {where: {id: interaction.user.id}});
                        await interaction.editReply(`Added \`${userMod}\` to your main mods.`);
                    } else {
                        let settings = await db.User.findOne({where: {id: interaction.user.id}});
                        if (settings == null)
                            await db.User.create({id: interaction.user.id, mods: JSON.stringify([userMod])});
                        else
                            await db.User.update({mods: JSON.stringify([...JSON.parse(settings.mods), userMod])}, {where: {id: interaction.user.id}});
                        await interaction.editReply(`Added \`${userMod}\` to your main mods.`);
                    }
                    break;
                
                case 'removeusermod':
                    await interaction.deferReply({ephemeral: true});
                    let removeUserMod = interaction.options.getString('mod');
                    let userSettings;
                    if (interaction.inGuild()) {
                        userSettings = await db.User.findOne({where: {id: interaction.user.id}});
                    } else
                    userSettings = await db.User.findOne({where: {id: interaction.user.id}});
                    if (userSettings == null)
                        return interaction.editReply('Can\'t remove a server mod if you haven\'t set any yet!');
                    await userSettings.update({mods: JSON.stringify(JSON.parse(userSettings.mods).filter(m => m != removeUserMod))});
                    if (interaction.inGuild())
                        await interaction.editReply(`Removed \`${removeUserMod}\` from your main mods.`);
                    else
                        await interaction.editReply(`Removed \`${removeUserMod}\` from your main mods.`);
                    break;

                case 'setdiscussionchannel':
                    await interaction.deferReply();
                    let on = interaction.options.getBoolean('on');
                    if (!(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return interaction.editReply('You must have the Manage Server permission to use this command.');
                    let serverSettings = await db.ServerSettings.findOne({where: {guild: interaction.guildId}});
                    if (!interaction.inGuild()) return interaction.editReply('This is a server-only command.');
                    if (serverSettings == null) return interaction.editReply('You must set the mods to be discussed first! (use /addservermod)');
                    if (on) {
                        await serverSettings.update({discussionChannel: interaction.channelId});
                        await firstDiscussion(serverSettings);
                        await interaction.editReply(`Daily discussions for the mods \`${serverSettings.mod}\` have been set up in this channel.\nI\'ve created a meta thread for discussing these daily discussions and for voting on what the first item discussed should be.\nThe first discussion will start later today.`);
                    } else {
                        await serverSettings.update({discussionChannel: null});
                        await interaction.editReply('Disabled daily discussions for this server.');
                    }
                    break;

                case 'subscribe':
                    await interaction.deferReply({ephemeral: true});
                    if (!interaction.inGuild())
                        return interaction.editReply('This command must be used in a server.');
                    let subscribed = interaction.options.getBoolean('on');
                    let queryInfo = {where: {user: interaction.user.id, guild: interaction.guildId}};
                    if (subscribed) {
                        if (await db.Subscription.count(queryInfo) <= 0)
                            await db.Subscription.create(queryInfo.where);
                        await interaction.editReply('You\'re now subscribed to daily discussions in this server.');
                    } else {
                        db.Subscription.destroy(queryInfo);
                        await interaction.editReply('You\'re no longer subscribed to daily discussions in this server.');
                    }
                    break;
                
                case 'customcommands':
                    await interaction.deferReply({ephemeral: true});
                    if (!interaction.inGuild()) return interaction.editReply('This is a server-only command.');
                    if (!(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return interaction.editReply('You must have the Manage Server permission to use this command.');
                    await interaction.editReply({
                        content: `\`This server's custom commands: \n\n<${(await db.CustomCommand.findAll({where: {guild: interaction.guildId}})).map(c => c.call).join('>, <')}>`,
                        components: [new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('addcustom').setLabel('New').setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('delcustom').setLabel('Delete').setStyle(ButtonStyle.Danger)
                        )]
                    });
                    break;
                
                case 'forcenextdailydiscussion':
                    await interaction.deferReply({ephemeral: true});
                    if (!interaction.inGuild()) return interaction.editReply('This is a server-only command.');
                    if (!(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return interaction.editReply('You must have the Manage Server permission to use this command.');
                    let discussSettings = await db.ServerSettings.findOne({where: {guild: interaction.guildId}});
                    if (discussSettings == null || discussSettings.discussionChannel == null) return interaction.editReply('This server doesn\'t have daily discussions set up yet.');
                    let allItems = getAllServerItems(discussSettings);
                    let num = parseInt(interaction.options.getString('item'));
                    if (isNaN(num) || num < 0 || num >= allItems.length) return interaction.editReply('Could not get that item.');
                    await discussSettings.update({forceDiscussion: num});
                    await interaction.editReply({content: `Got it. Next discussion will start very soon for the following item:`, embeds: [await embed({...allItems[num], score: 0, query: num.toString()})]});
                    break;
            }
        } else if (interaction.isAutocomplete()) {
            switch (interaction.commandName) {
                case 'i':
                    await interaction.respond(search.search(fn.unPunctuate(interaction.options.getFocused() == '' ? 'basic card' : interaction.options.getFocused())).slice(0,25).map(i => ({
                        name: `${i.item.name} (${i.item.itemType == 'card' ? i.item.character[0].replace('The ', '')+' ' : ''}${i.item.itemType})${i.item.originalDescription ? ` - ${i.item.originalDescription.replaceAll('\n', ' ')}` : ''}`.slice(0,93) + ` (${String(i.score).slice(0,4)})`,
                        value: i.item.searchText.slice(0,100)//i.item.hasOwnProperty('id') ? i.item.id : i.item.name,
                    })));
                    break;

                case 'addservermod':
                    await interaction.respond(data.mods.filter(mod => mod.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase())).slice(0,25).map(i => ({name: i.name,value: i.name})));
                    break;

                case 'removeservermod':
                    let settings  = await db.ServerSettings.findOne({where: {guild: interaction.inGuild() ? interaction.guildId : interaction.channelId}});
                    if (settings == null)
                        return interaction.respond([]);
                    await interaction.respond(JSON.parse(settings.mod).filter(m => m.toLowerCase().includes(interaction.options.getFocused().toLowerCase())).slice(0,25).map(i => ({name: i, value: i})));
                    break;

                case 'addusermod':
                    await interaction.respond(data.mods.filter(mod => mod.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase())).slice(0,25).map(i => ({name: i.name,value: i.name})));
                    break;

                case 'removeusermod':
                    let userSettings  = await db.User.findOne({where: {id: interaction.user.id}});
                    if (userSettings == null)
                        return interaction.respond([]);
                    await interaction.respond(JSON.parse(userSettings.mods).filter(m => m.toLowerCase().includes(interaction.options.getFocused().toLowerCase())).slice(0,25).map(i => ({name: i, value: i})));
                    break;
                
                case 'forcenextdailydiscussion':
                    if (!interaction.inGuild()) return interaction.respond([]);
                    let discussSettings = await db.ServerSettings.findOne({where: {guild: interaction.guildId}});
                    if (discussSettings == null || discussSettings.discussionChannel == null) return interaction.respond([]);
                    let allItems = getAllServerItems(discussSettings);
                    await interaction.respond(allItems.filter(i => i.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase())).slice(0,25).map(i => ({name: `${i.name} (${i.itemType == 'card' ? i.character[0].replace('The ', '')+' ' : ''}${i.itemType})${i.originalDescription ? ` - ${i.originalDescription.replaceAll('\n', ' ')}` : ''}`.slice(0,100), value: allItems.indexOf(i).toString()})));
                    break;
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            switch (interaction.commandName) {
                case 'find items':
                    let words = fn.unPunctuate(interaction.targetMessage.content).split(' ');
                    let matches = [];
                    for (let i = 0; i < words.length; i++) {
                        for (let j = i; j < words.length && j < i + 3; j++) {
                            let query = words.slice(i, j+1).join(' ');
                            let exactMatch = search._docslist.find(e => e.searchName == query);
                            if (exactMatch != undefined) matches.push(exactMatch.name);
                        }
                    }
                    if (matches.length > 0) {
                        await interaction.deferReply({ephemeral: true});
                        matches = [...new Set(matches)];
                        if (matches.length > 20) matches = matches.slice(0,20);
                        interaction.content = matches.slice(0,10).map(m => `[[d~${m}]]`).join('');
                        interaction.author = interaction.user;
                        let embeds = await getEmbeds(interaction);
                        matches = matches.reduce((acc, curr, i) => {
                            if (!(i % 5)) acc.push(matches.slice(i, i + 5));
                            return acc;
                        },[]);
                        await interaction.editReply({
                            content: `${interaction.targetMessage.url}\nFound the following item names on this message, click them to select which to send info about, then click send to send:`, ephemeral: true,
                            ephemeral: true,
                            embeds,
                            components: [
                                ...matches.map(row => new ActionRowBuilder().setComponents(
                                    row.map(match => new ButtonBuilder().setCustomId(`item${match.replace(/[^a-zA-Z' ']+/g, '').replaceAll(' ', '-')}`).setLabel(match).setStyle(ButtonStyle.Secondary))
                                )),
                                new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('send').setLabel('Send').setStyle(ButtonStyle.Success))
                            ]
                        });
                    } else {
                        interaction.reply({content: 'Couldn\'t find any item names on this message, sorry!', ephemeral: true});
                    }
                    break;
                
                case 'delete':
                    await interaction.deferReply({ephemeral: true});
                    if (interaction.targetMessage.author.id != bot.user.id) return interaction.editReply('I can only delete messages sent by myself!');
                    if (!(cfg.overriders.includes(interaction.user.id)) && interaction.targetMessage.reference != null) {
                        let channel = await bot.channels.fetch(interaction.targetMessage.reference.channelId);
                        let repliedMessage = await channel.messages.fetch(interaction.targetMessage.reference.messageId);
                        console.log(repliedMessage.author.id);
                        if (repliedMessage.author.id == interaction.user.id) {
                            interaction.targetMessage.delete().catch(()=>{});
                            interaction.deleteReply();
                        } else
                            return interaction.editReply('You can only delete messages that I\'ve sent in reply to yours.');
                    } else {
                        if (!(cfg.overriders.includes(interaction.user.id) || interaction.targetMessage.content.includes(interaction.user.id))) return interaction.editReply('You can only delete messages that I\'ve sent in reply to yours.');
                        interaction.targetMessage.delete().catch(()=>{});
                        interaction.deleteReply();
                    }
                    break;
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('item')) {
                if (interaction.message) {
                    await interaction.update({components: interaction.message.components.map(row => ({...row, components: row.components.map(button => {
                        if (button.customId == interaction.customId)
                            button.data.style = button.style == ButtonStyle.Secondary ? ButtonStyle.Primary : ButtonStyle.Secondary;
                        return ButtonBuilder.from(button.data);
                    })}))});
                }
            } else {
                switch (interaction.customId) {
                    case 'send':
                        let items = interaction.message.components.map(i => i.components).flat(1).filter(i=>i.data.style == ButtonStyle.Primary).map(i => `[[${i.data.custom_id.slice(4)}]]`);
                        if (items.length > 10) return await interaction.reply({content: 'Please select at most 10 items!', ephemeral: true});
                        await interaction.deferReply();
                        interaction.content = items.join('');
                        interaction.author = interaction.user;
                        let embeds = await getEmbeds(interaction);
                        await interaction.deleteReply();
                        if (embeds === 0 || embeds.length == 0) return;
                        await interaction.channel.send({
                            content: `${interaction.user} searched from ${interaction.message ? interaction.message.content.split('\n')[0] : '?'}`,
                            embeds,
                            allowedMentions: {users: []}
                        }).catch(e => {});
                        break;

                    case 'sendToAll':
                        if (interaction.message && interaction.message.content) {
                            await interaction.channel.send({content: `<@${interaction.user.id}> ran ${interaction.message.content}`, embeds: interaction.message.embeds, allowedMentions: {users: []}}).catch(e => {});
                            await interaction.update({content: "Sent result to channel!", embeds: [], components: []}).catch(e => {});
                        }
                        break;
                    
                    case 'addcustom':
                        if (!interaction.inGuild() || !(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return;
                        await interaction.showModal(new ModalBuilder()
                            .setCustomId('customcommand')
                            .setTitle('Add Custom Command')
                            .addComponents(
                                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('call').setLabel('Command name - call it with <name>').setStyle(TextInputStyle.Short).setMaxLength(20)),
                                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Title of the returned embed').setStyle(TextInputStyle.Short).setMaxLength(100)),
                                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('desc').setLabel('Description of the returned embed').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setRequired(false)),
                                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('image').setLabel('Image URL for a thumbnail').setStyle(TextInputStyle.Short).setMaxLength(200).setRequired(false)),
                            ));
                        interaction.message.delete().catch(e => {});
                        break;

                    case 'delcustom':
                        if (!interaction.inGuild() || !(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return;
                        await interaction.showModal(new ModalBuilder()
                            .setCustomId('delcustom')
                            .setTitle('Delete Custom Command')
                            .addComponents(
                                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('call').setLabel('Command name').setStyle(TextInputStyle.Short)),
                            ));
                        interaction.message.delete().catch(e => {});
                        break;
                }
            }
        } else if (interaction.isModalSubmit()) {
            switch (interaction.customId) {
                case 'customcommand':
                    if (!interaction.inGuild() || !(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return;
                    let call = fn.unPunctuate(interaction.fields.getField('call').value);
                    let title = interaction.fields.getField('title').value;
                    let description = interaction.fields.getField('desc').value;
                    let image = interaction.fields.getField('image').value;
                    if (call.length > 0) {
                        if (await db.CustomCommand.count({where: {guild: interaction.guildId, call}}) > 0)
                            return await interaction.reply({ephemeral: true, content: 'There already exists a custom command in this server with that name! Delete that one first.'});
                        else {
                            await db.CustomCommand.create({guild: interaction.guildId, call, title, description, image});
                            return await interaction.update({ephemeral: true, content: `Successfully created the \`<${call}>\` command`, components: []}).catch(e => {});
                        }
                    }
                    break;

                case 'delcustom':
                    if (!interaction.inGuild() || !(interaction.memberPermissions.has('ManageGuild') || cfg.overriders.includes(interaction.user.id))) return;
                    let delcall = fn.unPunctuate(interaction.fields.getField('call').value);
                    if (delcall.length > 0) {
                        if (await db.CustomCommand.count({where: {guild: interaction.guildId, call: delcall}}) <= 0)
                            return await interaction.reply({ephemeral: true, content: 'Delete failed. There are no custom commands in this server with that name.'});
                        else {
                            await db.CustomCommand.destroy({where: {guild: interaction.guildId, call: delcall}});
                            return await interaction.update({ephemeral: true, content: `Successfully deleted the \`<${delcall}>\` command`, components: []}).catch(e => {});
                        }
                    }
                    break;
            }
        }
    } catch (e) {
        console.error(e)
    }
});

const searchize = item => {
    if (!item.hasOwnProperty('name'))
        return '';
    let name = item.name;
    return name.replaceAll(' ', '_').replaceAll('+', '').replaceAll('???', 'Unidentified');
};

async function main() {
    console.log('loading and parsing data...');
    data = JSON.parse(fs.readFileSync('./docs/dataformatted.json'));
    let wikis = {'Slay the Spire': 'slay-the-spire'};
    for (let itemType in data)
        for (let item of data[itemType]) {
            let character = characters[''];
            //if (item.type == 'Player' && item.name != 'The Snecko') continue;
            let img = null;
            let wiki = wikis.hasOwnProperty(item.mod) ? wikis[item.mod] : false;
            let url = null;
            if (wiki)
                url = `https://${wikis[item.mod]}.fandom.com/wiki/${searchize(item)}`;
            switch(itemType) {
                case 'cards':
                    img = `${item.mod}/cards/${item.id.replace('+', '').replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('\"', '').replaceAll('?', '').replaceAll('/', '')}.png`;
                    character = characters[item.color];
                    break;

                case 'relics':
                    img = `${item.mod}/relics/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '').replaceAll('?', '')}.png`;
                    character = characters[item.pool];
                    break;

                case 'potions':
                    img = `${item.mod}/potions/${item.id.replaceAll(' ', '').replaceAll(':','-')}.png`;
                    if (wiki) url = `https://${wikis[item.mod]}.fandom.com/wiki/Potions`;
                    character = characters[item.hasOwnProperty('color') ? item.color : ''];
                    break;

                case 'bosss':
                    img = `extraImages/bosses/${item.name.replaceAll(' ', '')}.png`;
                    character = Object.values(characters).find(ch => ch[0].replace('The ', '') == item.name.slice(0, item.name.indexOf(' ')));
                    break;

                case 'events':
                    img = `extraImages/events/${item.name.toLowerCase().replaceAll(' ', '').replaceAll('?', '').replaceAll('!', '')}.jpg`;
                    character = characters[item.character];
                    break;
                
                case 'creatures':
                    img = `${item.mod}/creatures/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '')}.png`;
                    break;
                
                case 'blights':
                    img = `${item.mod}/blights/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '')}.png`;
                    if (wiki) url = `https://${wikis[item.mod]}.fandom.com/wiki/Blights`;
                    break;
                
                case 'mods':
                    item.mod = item.name;
                    break;
                
                case 'packs':
                    img = `${item.mod}/packs/${item.id.replaceAll(':', '-')}.png`;
                    break;
                
                case 'nodemodifiers':
                    img = `${item.mod}/nodemodifiers/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '')}.png`;
                    break;
            }
            if (item.hasOwnProperty('altDescription')) {
                item.description += `\n\nBranching upgrade: ${item.altDescription}`;
                delete item.altDescription;
            }
            let newItem = {
                ...item,
                searchName: fn.unPunctuate(item.name),
                searchId: item.hasOwnProperty('id') ? fn.unPunctuate(item.id) : undefined,
                itemType: itemType.slice(0,-1),
                originalDescription: item.hasOwnProperty('description') ? item.description : undefined,
                description: item.hasOwnProperty('description') ? keywordify(item.description, character) : undefined,
                character,
            };
            if (url != null)
                newItem.url = url;
            if (item.hasOwnProperty('img'))
                newItem.img = item.img.slice(1);
            else if (img != null)
                newItem.img = img.toLowerCase();
            if (newItem.name == '') newItem.name = ' ';
            newItem.searchText = fn.unPunctuate([
                    'name',
                    ['character', 0],
                    'campaign',
                    'itemType',
                    'type',
                    'color',
                    'description',
                    'tier',
                    'rarity',
                    'mod',
                    'id',
                    'pack',
                    'author',
                    'authors',
                    'cards',
                    'tags',
                    'rooms',
                    'specialRule',
                    'effects',
                ].map(key => {
                    if (Array.isArray(key)) {
                        let look = newItem;
                        for (let j of key) {
                            if (!look.hasOwnProperty(j)) return '';
                            look = look[j];
                        }
                        if (Array.isArray(look)) return look.join(' ');
                        return String(look);
                    } else if (newItem.hasOwnProperty(key)) {
                        if (newItem.itemType == 'boss' && key == 'cards') return '';
                        if (Array.isArray(newItem[key])) return newItem[key].join(' ');
                        return String(newItem[key]);
                    }
                    else return '';
                }).join(' '));
            if (newItem.hasOwnProperty('moves'))
                newItem.searchText += ' ' + fn.unPunctuate(newItem.moves.map(m => `${m.name} ${m.description}`).join(' '));
            if (newItem.description != null)
                newItem.description = keywordify(emojify(newItem.originalDescription, character));
            if (newItem.hasOwnProperty('id'))
                newItem.hasId = true;
            else
                newItem.id = String(Math.random()).slice(2);
            let origId = newItem.id;
            while (search._idToShortId.has(newItem.id))
                newItem.id += '_';
            search.add(newItem);
            search._docs[newItem.id] = newItem;
            newItem.id = origId;
            if (newItem.hasId && !newItem.hasOwnProperty('url'))
                newItem.url = `${cfg.exportURL}/w/${encodeURIComponent(item.mod)}/${encodeURIComponent(item.id)}`.toLowerCase();
        }
    search._docslist = Object.values(search._docs);
    console.log('parsed data, connecting to discord...');
    bot.login(cfg.token);
    website.listen(cfg.websitePort, () => console.log(`Site running! Test at http://localhost:${cfg.websitePort}`));
}

main();
