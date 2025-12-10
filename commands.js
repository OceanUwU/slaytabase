import { bot, search, setActivity } from './index.js';
import db from './models/index.js';
import { User, EmbedBuilder } from 'discord.js';
import { createCanvas, createImageData, loadImage, registerFont } from 'canvas';
import drawMultilineText from './canvas-multiline-text.js';
import GIFEncoder from 'gif-encoder-2';
import { fmFunc } from 'calculator-by-str';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { plot } from 'plot';
import '@plotex/render-image';
import fs from 'fs';
import fn from './fn.js';
import embed from './embed.js';
import cfg from './cfg.js';
import fetch from 'node-fetch';
import FormData from 'form-data';
import gm from 'gm';
import { execFile } from 'child_process';
import optipng from 'optipng-bin';
import owofify from 'owoifyx';
const owoify = owofify.default;
import petPetGif from 'pet-pet-gif';
//import canvasGif from 'canvas-gif';
import googleIt from 'google-it';
import Perspective from './perspectivejs.js';
import { JSDOM } from 'jsdom';
import { off } from './dailyDiscussion.js';

registerFont('./memetemplates/Kreon-Regular.ttf', {family: "Kreon"});
const mtsbotdata = JSON.parse(fs.readFileSync('./docs/mtsbotdata.json'));
const vexboxdata = JSON.parse(fs.readFileSync('./static/vexbox/data.json'));
const charter = new ChartJSNodeCanvas({width: 800, height: 600, backgroundColour: 'white'});
const delSearchLimit = 25;
const masks = {};
['a', 's', 'p'].forEach(i => masks[i] = loadImage(`./artpreview/${i}.png`));
const shadows = {};
['a', 's', 'p'].forEach(i => shadows[i] = loadImage(`./artpreview/${i}s.png`));
const cuts = {};
['a', 's', 'p'].forEach(i => cuts[i] = loadImage(`./artpreview/${i}c.png`));
const cardTypes = {
    Attack: 'a',
    Power: 'p',
    Skill: 's',
    Status: 's',
    Curse: 's'
};
const optimise = async filename => new Promise(res => execFile(optipng, ['-out', filename, filename], res));

async function getMemeItems(arg, options, msg) {
    try {
        let args = arg.split('=');
        if (args.length != options.items.length)
            return {title: `This meme requires exactly ${options.items.length} item${options.items.length == 1 ? '' : 's'}. Separate items with the "=" symbol.`};
        let items = await Promise.all(args.map(async (a, i) => {
            a = new String(a.trim());
            a.filter = arg.filter;
            if (a.startsWith('user?')) {
                let id = a.slice(5)
                let user;
                if (id == 'me')
                    user = msg.author;
                else
                    user = await bot.users.fetch(id).catch(e => {});
                if (user) {
                    user.url = user.avatarURL().replace('webp', 'png');
                    user.image = await loadImage(user.url);
                    return user;
                }
            } else if (a.startsWith('att?')) {
                let n = parseInt(a.slice(4));
                let attachment = msg.attachments.at(n-1);
                if (attachment == undefined)
                    return {title: 'format for attachments is att?n?name where n is the number of the attachment e.g. att?1?awsom'};
                attachment.image = await loadImage(attachment.url);
                attachment.item = {name: a.slice(6)};
                return attachment;
            }
            return options.items[i] == 1 ? a+"" : fn.find(a);
        }));

        for (let i in items) {
            if (options.items[i] == 0) {
                let item = items[i];
                if (items[i] instanceof User || items[i].hasOwnProperty('ephemeral')) continue;
                item.embed = await embed({...item.item, score: item.score, query: arg});
                if (item.embed.data.thumbnail == null)
                    return {title: `No image for ${item.item.itemType} "${item.item.name}"`};
                item.url = item.embed.data.thumbnail.url
                item.image = await loadImage(item.url);
                if (args[i].endsWith("?left") || args[i].endsWith("?right")) {
                    let canvas = createCanvas(item.image.width/2,item.image.height);
                    canvas.getContext('2d').drawImage(item.image, args[i].endsWith("?left") ? 0 : -item.image.width/2, 0);
                    item.image = canvas;
                }
            }
        }

        return items;
    } catch(e) {
        console.error(e);
        return {title: 'failed to generate image'};
    }
}

async function meme(msg, arg, options) {
    try {
        let items = await getMemeItems(arg, options, msg);
        if (!Array.isArray(items))
            return items;

        if (options.hasOwnProperty('bg')) {
            let canvas = createCanvas(options.w, options.h);
            let ctx = canvas.getContext('2d');
    
            ctx.drawImage(await loadImage('./memetemplates/'+options.bg), 0, 0);
            if (options.hasOwnProperty('put'))
                for (let p of options.put) {
                    if (Array.isArray(p[1])) (new Perspective(ctx, items[p[0]].image)).draw(p[1]);
                    else ctx.drawImage(typeof p[0] == 'number' ? items[p[0]].image : await loadImage('./memetemplates/'+p[0]), p[1], p[2], p[3], p[4]);
                }
            if (options.hasOwnProperty('texts'))
                for (let t of options.texts) {
                    ctx.fillStyle = t[5];
                    let text = typeof items[t[0]] == 'string' ? items[t[0]] : (items[t[0]] instanceof User ? items[t[0]].username : items[t[0]].item.name.toUpperCase());
                    drawMultilineText(ctx, options.upper ? text.toUpperCase() : text, {
                        rect: {x: t[1], y: t[2], width: t[3], height: t[4]},
                        lineHeight: 1.0,
                        minFontSize: 1,
                        maxFontSize: 500,
                    });
                    /*drawText.default(ctx, typeof items[t[0]] == 'string' ? items[t[0]] : (items[t[0]] instanceof User ? items[t[0]].username : items[t[0]].item.name.toUpperCase()), font,
                        {x: t[1], y: t[2], width: t[3], height: t[4]}, 
                        {minSize: 5, maxSize: 200, vAlign: 'center', hAlign: 'center', textFillStyle: t[5], fitMethod: 'box', drawRect: false}
                    );*/
                }
            
            let encoder = new GIFEncoder(options.w, options.h);
            encoder.setDelay(500);
            encoder.start();
            encoder.addFrame(ctx);
            encoder.finish();
            let filename = `export${String(Math.random()).slice(2)}.gif`;
            fs.writeFileSync(filename, encoder.out.getData());
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename],
                color: typeof items[0] == 'string' || items[0] instanceof User || items[0].hasOwnProperty('ephemeral') ? null : items[0].embed.data.color,
            };
        }
    } catch(e) {
        console.error(e);
        return {title: 'failed to generate image'};
    }
}

async function gifMeme(msg, arg, bg, fn, options={}) {
    return { title: 'disabled for now - sorry!' };
    try {
        let items = await getMemeItems(arg, {items: [0]}, msg);
        if (!Array.isArray(items))
            return items;
        let buffer = await canvasGif(bg, (ctx, w, h, totalFrames, currentFrame) => fn(ctx, w, h, totalFrames, currentFrame, items), options);
        let filename = `export${String(Math.random()).slice(2)}.gif`;
        fs.writeFileSync(filename, buffer);
        return {
            title: ' ',
            image: {url: 'attachment://'+filename},
            files: [filename],
            color: typeof items[0] == 'string' || items[0] instanceof User || items[0].hasOwnProperty('ephemeral') ? null : items[0].embed.data.color,
        };
    } catch (e) {
        console.error(e);
        return {title: 'failed to generate gif'};
    }
}

async function makesweetMeme(template, arg, msg) {
    try {
        if (cfg.mkswtKey == null)
            return {title: "This kind of gif is not currently enabled to generate."};

        let items = await getMemeItems(arg, {items: [0]}, msg);
        if (!Array.isArray(items))
            return items;
        
        let filename = `export${String(Math.random()).slice(2)}.png`;
        await new Promise(async (resolve, reject) => {
            let stream = fs.createWriteStream(filename);
            let res = await fetch(items[0].url);
            res.body.pipe(stream);
            res.body.on("error", reject);
            stream.on("finish", resolve);
        });
        let img = await loadImage(filename);
        let canvas = createCanvas(img.width/(arg.endsWith("?left") || arg.endsWith("?right") ? 2 : 1),img.height);
        canvas.getContext('2d').drawImage(img, arg.endsWith("?right") ? -img.width/2 : 0, 0);
        fs.rmSync(filename);
        filename = filename.replace('png', 'jpg');
        fs.writeFileSync(filename, canvas.toBuffer('image/jpeg'));

        let body = new FormData();
        body.append('images', fs.readFileSync(filename), 'file.jpg');
        let req = await fetch(`https://api.makesweet.com/make/${template}?text=${typeof items[0] == 'string' ? items[0] : (items[0] instanceof User ? items[0].username : items[0].item.name)} my beloved`, {
            method: 'POST',
            headers: {'Authorization': cfg.mkswtKey},
            body
        });
        if (req.status === 200) {
            fs.rmSync(filename);
            filename = filename.replace('jpg', 'gif');
            await new Promise(async res => {
                let stream = fs.createWriteStream(filename);
                req.body.pipe(stream);
                stream.on("finish", res);
            });
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename],
                color: typeof items[0] == 'string' || items[0] instanceof User || items[0].hasOwnProperty('ephemeral') ? null : items[0].embed.color,
            };
        } else {
            fs.rmSync(filename);
            return {title: `Error: ${(await req.json()).error}`};
        }
    } catch(e) {
        console.error(e);
        return {title: 'failed to generate gif'};
    }
}

const commands =  {
    exact: {
        'help': () => ({
            title: bot.user.username,
            description: `Search for items from Slay the Spire with <item>.
Search for items from mods with [[item]].
You can use up to 10 commands in a message.
If you edit or delete your message, I will update my reply to it, according to your changes.
Use **/i** to use autocomplete to find an item.

Type <fullhelp> for information on all of the bot's commands.`,
            thumbnail: {url: bot.user.avatarURL()},
        }),

        'fullhelp': () => ({
            title: bot.user.username,
            description: `Search for an item with <item name>.
If the result isn\'t what you were looking for, you can also include the following in your search query: character, item type (e.g. card, relic, potion), type (e.g. skill, elite), or text from its description.

Anything highlighted in **bold** is a searchable keyword.

You can use up to 10 commands in a message.
If you edit or delete your message, I will update my reply to it, according to your changes.
I'll spoiler tag my reply to any messages which include "(s)" anywhere.
I'll ignore any messages which include the backtick (\`) symbol anywhere.

<item> will search through items from only vanilla Slay the Spire and mods specific to the server (can be set by server admins with **/addservermod**).
You can replace <item> with [[item]] to search through ALL mods.
You can use **/i** to use autocomplete to find an item.
You can use **/run** to run commands without anyone else seeing your result.
You can also search online at ${cfg.exportURL}/search

Server admins can add custom commands with **/customcommands**

__Commands:__
<[item name]> displays info about an item
- search query may include the following filters:
- - cost=? - only returns cards with specified cost
- - type=? - specify item type (e.g. relic, card, attack)
- - mod=? - specify mod name
- - rarity=? - specify item rarity
- - in=drawpile - results must include the phrase "draw pile" (ignores spaces)
- - ex=? - no results will include the specified phrase
- - r=2 - get second result
<s~item>, <d~[item]>, <i~[item name]>, <t~[item]>, <f~[item]> and <~[item]> are the same as the above, but the result is formatted differently
<customcommands> - lists the server's custom commands
<del> deletes your last search in this channel
<?[search query]> shows the most likely results for a search query
- page=? - specify result page
<show10 [search query]> shows the full item details for the first 10 results for a search query
<count?[search query]> shows the total number of results for a search query (more helpful with filters!)
<ws?[mod]> - searches for a slay the spire mod on the steam workshop
<mtsbot?[item]> - searches ModTheSpire Bot's data for an item. has a different search, type <mtsbot?> for help
<memes> help with the bot's meme generator
<artpreview [card name]> takes your first attachment and uses it as card art for a card
<c~artpreview [card name]> compares the art preview to the current card
<cut~artpreview [card name]>
<searchtext [item name]> shows the text the bot can use when searching for an item
<choose [word1 word2 word3...]> chooses one of the specified words for you at random
<exporttxt [search query]> exports the search details for the first 100 results for a search query formatted as a text file
<exportjson [search query]> same as the above, but returns the raw json details
<calc [equation]> https://www.npmjs.com/package/calculator-by-str
<plot [equation] [args]> - type <plot help> for more information
<remindme [time]> links you to a message in a certain amount of time (e.g. 10m, 5h, 30d)
<feedback?[message]> sends a message to a channel seen only by the bot author
<lists> links to the bot's data
<wiki?[search]> searches certain modding-related github repos for wiki pages
<mtg?[card]> searches scryfall for a card from magic the gathering
`,
            thumbnail: {url: bot.user.avatarURL()},
        }),

        'del': async msg => {
            let messages = await msg.channel.messages.fetch();
            messages = messages.filter(i => i.author.id == bot.user.id);
            let i = 0;
            for (let m of messages) {
                i++;
                m = m[1];
                let found = true;
                let repliedTo;
                if (m.reference)
                    repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(()=>{});
                if (m.content.includes(msg.author.id) || (repliedTo != null && repliedTo.author.id == msg.author.id)) {
                    await m.delete().catch(e => {});
                    await msg.delete().catch(e => {});
                    return;
                }
                if (i >= delSearchLimit) break;
            }
            return;
        },

        'spoiler': async msg => {
            let messages = await msg.channel.messages.fetch();
            messages = messages.filter(i => i.author.id == bot.user.id && i.reference != null);
            let i = 0;
            for (let m of messages) {
                i++;
                m = m[1];
                let found = true;
                let repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(e => found = false);
                if (!found) continue;
                if (repliedTo.author.id == msg.author.id) {
                    await msg.delete().catch(e => {});
                    //spoiler hack
                    let origEmbeds = m.embeds;
                    if (origEmbeds.length > 0) {
                        await m.edit({content: `||https://bit.ly/3aSgJDF||`, embeds: [], allowedMentions: {repliedUser: false}}).catch(e => {});
                        await (new Promise(res => setTimeout(res, 1000)));
                        await m.edit({content: m.content, embeds: origEmbeds, allowedMentions: {repliedUser: false}}).catch(e => {});
                    }
                    return;
                }
                if (i >= delSearchLimit) break;
            }
            return;
        },

        'lists': async () => ({
            title: "lists",
            description: `web search: ${cfg.exportURL}/search\nexport: ${cfg.exportURL}\nfull data: https://github.com/OceanUwU/slaytabase/blob/main/docs/data.json\nfull data (formatted): https://github.com/OceanUwU/slaytabase/blob/main/docs/dataformatted.json\nmanually added items: https://github.com/OceanUwU/slaytabase/blob/main/extraItems.js`,
        }),

        'customcommands': async msg => {
            if (!msg.inGuild()) return {title: "You must be in a server to use custom commands."};
            let commands = await db.CustomCommand.findAll({where: {guild: msg.guildId}});
            return {title: `Custom commands in the \`${msg.guild.name}\` server:`, description: commands.map(c => `<${c.call}>`).join(', ')};
        },

        'forcestop': async (msg, arg) => {
            if (cfg.overriders.includes(msg.author.id)) {
                off.off = true;
                bot.user.setStatus('idle');
                bot.user.setActivity('about to restart...');
                return {title: "stopping soon."};
            } else return {title: "...nice try"};
        },

        'make me a card idea': async (msg, arg) => {
            let numEffects = 2 + Math.round(Math.random());
            let cost = Math.floor(Math.random() * 4);
            let rarity = ['Common', 'Uncommon', 'Rare'][Math.floor(Math.random() * 3)];
            let name = [];
            let cardEffects = [];
            let query = new String('randomitem type=card');
            query.filter = arg.filter;
            for (let i = 0; i < numEffects; i++) {
                let card = fn.find(query).item;
                let nameWords = card.name.split(' ');
                let effects = card.description.split('.').filter(e => fn.unPunctuate(e).length > 2);
                if (effects.length == 0) continue;
                name.push(nameWords[Math.floor(Math.random() * nameWords.length)]);
                cardEffects.push(effects[Math.floor(Math.random() * effects.length)].replaceAll('\n','').trim());
            }
            name = name.join(' ');
            let description = cardEffects.join('.\n').replaceAll('*', '')+'.';
            let cardType = description.toLowerCase().includes('deal') && description.toLowerCase().includes('damage') ? 'Attack' : (Math.random() > 0.8 ? 'Power' : 'Skill');

            let generated = await meme(msg, `${cost}=${name.replaceAll('=','')}=${description.replaceAll('~', '').replaceAll('=','').replace(/\<\:(.*)\>/g, '')}=${cardType}`, {
                w: 350,
                h: 500,
                bg: 'makeacard.png',
                items: [1, 1, 1,1],
                put: [],
                texts: [
                    [0, 43, 32, 40, 42, 'white'],
                    [1, 72, 75, 217, 32, 'white'],
                    [2, 67, 283, 198, 156, 'white'],
                    [3, 146, 235, 55, 16, 'white'],
                ]
            });

            return {
                title: name,
                description: `${rarity} ${cardType} / ${cost} <:colorless_energy:382625433016991745> / The Slaytabase / No One\n\n${description}`,
                thumbnail: generated.image,
                files: generated.files,
                footer: {text: 'i made this one just for you <3'}
            };
        },

        'adventurer board forecast': async msg => {
            return {
                title: 'The board forecast for this week:',
                url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2848995399',
                description: [-1, 0, 1, 2, 3, 4, 5, 6].map(d => {
                    let date = new Date(Date.now() + d * 1000 * 60 * 60 * 24);
                    let boards = fn.findAll(`type=board`);
                    let dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
                    let board = boards[dayOfYear % boards.length];
                    return `${d==0?'__':''}${date.toLocaleDateString(undefined, {weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'})}${d==0?'__':''}: [${board.item.name}](${board.item.url})`;
                }).join('\n')
            }
        },

        'star compass': msg => ({title: ' ', description: 'Oops, I dropped it. Oh well.'}),

        'xy': msg => ({
            title: 'Please explain your goal, not just your current issue',
            url: 'https://xyproblem.info/',
            description: 'What you\'re trying to accomplish is essential context for us helping you. Often people will be able to suggest alternate approaches that simplify the problem or provide a better overall solution. The more information you can provide, the better.',
            thumbnail: {url: 'https://i.imgur.com/bCmEbPU.png'},
            color: 15438388,
        })
    },

    prefix: {
        '?': async (msg, arg, args) => {
            if (arg.startsWith('??')) {
                let nArg = new String('?'+arg);
                nArg.filter = arg.filter;
                let item = fn.find(nArg);
                return (await embed({...item.item, score: item.score, query: nArg}, undefined, undefined, false)).data;
            }
            let results = fn.findAll(arg);
            let page = results.page;
            let totalResults = results.total;
            results = results.slice(0, 10);

            let resultText = results.map((i, index) => `${(page*10)+index+1}: ${i.item.itemType == 'card' ? i.item.character[0].replace('The ', '').toLowerCase() : ''} ${i.item.itemType} **${i.item.name}** - ${i.score.toFixed(2)}`).join('\n');
            let firstEmbed = results.length > 0 ? await embed(results[0].item, msg, undefined, false) : {data: {thumbnail: null}};

            return {
                title: `Searched for "${args.filter(a => !a.includes('=')).join(' ').slice(0, 70)}"`,
                url: `${cfg.exportURL}/search?${encodeURIComponent(arg)}`,
                description: results.length == 0 ? 'No results.' : resultText,
                thumbnail: firstEmbed.data.thumbnail,
                footer: {text: `Page ${page+1}/${Math.ceil(totalResults/10)}`},
                color: 14598591,
            };
        },

        'mtsbot?': async (msg, arg, args, oa) => {
            try {
                if (arg.length == 0 || arg == 'help' || arg == '?')
                    return {
                        title: 'ModTheSpire Bot data archive',
                        color: 16745472,
                        description: `You can use this command to search for items from the data of ModTheSpire Bot, which includes a bunch of older mods that may not be included in Slaytabase\'s data.
You must search for the exact item name with this search.
There are some filters available, but these are custom to this command and work differently from the ones from the regular search. Examples:
- cost=1 cost=x etc
- type=card type=skill etc
- rarity=boss
- mod=basegame mod=downfall etc (can be either modid or mod name)
- in=deal6damage in=gain5block etc (checks if the description has a certain string)
- ex=damage (makes sure description does NOT contain a certain string)
- r=2 r=3 etc (get nth result)
`
                    };
                let filters = args.filter(a => a.includes('=') && !a.startsWith('=') && !a.endsWith("="));
                args = args.filter(i => !filters.includes(i));
                let argFilter = arg.filter;
                arg = args.join(' ');
                filters = filters.map(f => [f.slice(0, f.indexOf('=')), f.slice(f.indexOf('=')+1)]);
                let items = mtsbotdata;
                if (argFilter)
                    items = items.filter(i => argFilter({item: i}));
                if (args.length > 0) {
                    items = items.filter(i => fn.unPunctuate(i.name) == arg);
                    if (oa.includes('+')) items = items.filter(i => i.name.includes('+'));
                    else items = items.filter(i => !i.name.includes('+'));
                }
    
                let resultNum = 0;
                for (let f of filters)
                    switch (f[0]) {
                        case 'cost':
                            items = items.filter(i => i.hasOwnProperty('cost') && i.cost.toLowerCase() == f[1]);
                            break;
    
                        case 'type':
                            items = items.filter(i => i.hasOwnProperty('type') && i.type.toLowerCase() == f[1] || i.itemType == f[1]);
                            break;
    
                        case 'rarity':
                            items = items.filter(i => i.hasOwnProperty('rarity') && i.rarity.toLowerCase() == f[1] || i.hasOwnProperty('tier') && i.tier.toLowerCase() == f[1]);
                            break;
    
                        case 'mod':
                            items = items.filter(i => i.hasOwnProperty('modId') && i.modId.includes(f[1]) || i.hasOwnProperty('mod') && (fn.unPunctuate(i.mod.replaceAll(' ', '')).includes(f[1]) || f[1].includes(fn.unPunctuate(i.mod.replaceAll(' ', '')))));
                            break;
    
                        case 'in':
                            items = items.filter(i => i.hasOwnProperty('description') && fn.unPunctuate(i.description.replaceAll(' ', '')).includes(f[1]));
                            break;
    
                        case 'ex':
                            items = items.filter(i => i.hasOwnProperty('description') && !fn.unPunctuate(i.description.replaceAll(' ', '')).includes(f[1]));
                            break;
    
                        case 'r':
                            let r = Math.max(1, parseInt(f[1])) - 1;
                            if (!Number.isNaN(r)) resultNum += r;
                            break;
                    }
                
                if (items.length >= resultNum+1) {
                    let i = items[resultNum];
                    let desc = '';
                    let keywordify = true;
                    switch (i.itemType) {
                        case 'mod':
                            desc = `\`Mod\` \`v${i.version}\`\nAuthor:    ${i.authors.join(' ')}\n${i.description}`;
                            keywordify = false;
                            break;

                        case 'card':
                            desc = `\`${i.type}\` \`${i.cost}\` \`${i.rarity}\` \`${i.color}\` \`${i.mod}\`\n${i.description}`;
                            break;
                            
                        case 'relic':
                            desc = `\`${i.tier} Relic\`${i.pool == '' ? '' : ` \`${i.pool}\``} \`${i.mod}\`\n${i.description}\n*${i.flavorText}*`;
                            break;
                            
                        case 'potion':
                            desc = `\`${i.rarity} Potion\` \`${i.mod}\`\n${i.description}`;
                            break;
                        
                        case 'keyword':
                            desc = `\`${i.mod} Keyword\`\n${i.description}`;
                            break;
                    
                        case 'creature':
                            desc = `\`${i.mod} ${i.type} Creature\` \`${i.minHP}-${i.maxHP}HP\``;
                            break;
                    }
                    if (keywordify)
                        desc = desc.replaceAll('\n', '\n ').split(' ').map(w => w.includes(':') ? `**${w.slice(w.indexOf(':')+1)}**` : w).join(' ').replaceAll('\n ', '\n')
                            .replaceAll('[R]', '<:red_energy:382625376838615061>')
                            .replaceAll('[G]', '<:green_energy:646206147220471808>')
                            .replaceAll('[B]', '<:blue_energy:668151236003889184>')
                            .replaceAll('[W]', '<:purple_energy:620384758068674560>')
                            .replaceAll('[E]', '<:colorless_energy:382625433016991745>');
                    return {title: i.name, description: desc, footer: items.length > 1 ? {text: `result ${resultNum+1}/${items.length}`} : null, color: 16745472};
                } else return {color: 0, title: `${items.length} results found.`}
            } catch (e) {
                console.error(e);
                return {color: 0, title: 'some kind of error happened?'};
            }
        },

        'count?': (msg, arg) => ({title: `Found ${fn.findAll(arg).total} results for "${arg}"`}),

        'show': async (msg, arg, args) => {
            let num = parseInt(args[0]);
            if (Number.isNaN(num)) {
                let nArg = new String('show'+arg);
                nArg.filter = arg.filter;
                let item = fn.find(nArg);
                return (await embed({...item.item, score: item.score, query: nArg}, undefined, undefined, false)).data;
            } else if (num < 1 || num > 10)
                return {title: 'number of items to show must be 1-10'};
            let query = new String(args.slice(1).join(' '));
            query.filter = arg.filter;
            let results = fn.findAll(query);
            results = results.slice(0, num);
            let embeds = await Promise.all(results.map(async (item, index) => {
                let e = await embed({...item.item, score: item.score, query}, undefined, undefined, index != 0);
                e.data.description = `${item.score.toFixed(2)} / ${e.data.description}`;
                e.data.footer = null;//{text: `${String(Math.round((1 - item.score) * 100))}% sure`};
                return e;
            }));
            if (embeds.length == 0)
                return {title: 'no results'};
            console.log({...embeds[0].data, extra_embeds: embeds.slice(1)});
            return {...embeds[0].data, extra_embeds: embeds.slice(1)};
        },

        'searchtext ': async (msg, arg) => {
            let result = fn.find(arg);
            if (result.item.itemType == 'fail') return {title: "no result?"};
            if (!result.hasOwnProperty('terms'))
                return {
                    title: `"${arg}" yields:`,
                    description: result.item.searchText,
                };
            return {
                title: `"${arg.slice(0,70)}" (${result.score}) yields:`,
                description: result.item.searchText.split(' ').map(w => result.terms.includes(w) ? `__${w}__` : w).join(' '),
            };
        },

        'data?': async (msg, arg) => {
            let result = fn.find(arg);
            if (result.item.itemType == 'fail') return {title: "no result?"};
            return {
                title: ' ',
                description: `\`\`\`json\n${JSON.stringify(result.item, null, 4)}\n\`\`\``,
            };
        },

        'exportjson': async (msg, arg) => {
            let results = fn.findAll(arg).slice(0, 100);
            results.forEach(r => delete r.matches);
            let filename = `search${String(Math.random()).slice(2)}.json`;
            fs.writeFileSync(filename, JSON.stringify(results, null, 4));
            return {
                title: `JSON file for first 100 results of search for query "${arg}" attached.`,
                files: [filename],
            };
        },

        'exporttxt': async (msg, arg) => {
            let results = (await Promise.all(fn.findAll(arg).slice(0, 100).map(async r => {
                let e = await embed({...r.item, score: r.score, query: arg}, msg);
                return `${e.data.title} / ${e.data.description}`.replace(r.item.description, r.item.originalDescription).replaceAll('\n\n', '\n').replaceAll(r.item.character[2], '⚪');
            }))).join('\n\n');
            let filename = `search${String(Math.random()).slice(2)}.txt`;
            fs.writeFileSync(filename, results);
            return {
                title: `Text file for first 100 results of search for query "${arg}" attached.`,
                files: [filename],
            };
        },

        'i~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            let image = itemEmbed.data.thumbnail;

            if (arg.endsWith('?left') || arg.endsWith('?right')) {
                try {
                    if (image && image.hasOwnProperty('url')) {
                        let img = await loadImage(image.url);
                        let canvas = createCanvas(img.width/2,img.height);
                        canvas.getContext('2d').drawImage(img, arg.endsWith("?left") ? 0 : -img.width/2, 0);
                        let filename = `export${String(Math.random()).slice(2)}.gif`;
                        fs.writeFileSync(filename, canvas.toBuffer());
                        return {
                            title: ' ',
                            image: {url: 'attachment://'+filename},
                            files: [filename],
                            color: itemEmbed.data.color,
                        };
                    }
                } catch (e) {
                    return {title: 'error cropping'};
                }
            }

            return {
                title: image == null ? `No image for ${item.item.itemType} "${item.item.name}"` : ' ',
                image: image,
                color: itemEmbed.data.color,
            };
        },

        'img ': async (msg, arg) => {
            return await commands.prefix['i~'](msg, arg);
        },

        't~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);

            return {
                title: itemEmbed.data.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : '​',
                thumbnail: itemEmbed.data.thumbnail,
                color: itemEmbed.data.color,
            };
        },
        
        'f~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            return {
                ...itemEmbed.data,
                thumbnail: {},
                image: itemEmbed.data.thumbnail,
            };
        },

        'd~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            switch (item.item.itemType) {
                case 'relic':
                    itemEmbed.data.description = itemEmbed.data.description.split('\n').slice(0,-1).join('\n');
                    break;
                case 'boss':
                    itemEmbed.data.description = itemEmbed.data.description.split('\n').slice(0,3).join('\n');
                    break;
                case 'event':
                    itemEmbed.data.description = `\n\n${item.item.description.replace('\n', ' ')}`;
                    break;
                default:
                    break;
            }
            return {
                ...itemEmbed.data,
                title: ' ',
                thumbnail: null,
                footer: null,
                description: `[${itemEmbed.data.title}](${itemEmbed.data.url}): ${itemEmbed.data.description.split('\n').slice(2).join(' ')}`,
            };
        },

        '~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            return {
                ...itemEmbed.data,
                footer: null,
                description: null,
            };
        },

        's~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            switch (item.item.itemType) {
                case 'event':
                    itemEmbed.data.description = `\n\n${item.item.description.replace('\n', ' ')}`;
                    break;
            }
            return {
                ...itemEmbed.data,
                title: ' ',
                description: `[${itemEmbed.data.title}](${itemEmbed.data.url}) - ${itemEmbed.data.description.replace('\n\n', '$$$$$').replaceAll('\n', ' ').replace('$$$', '\n')}`,
                thumbnail: null,
                footer: null,
            };
        },

        'owo~': async (msg, arg) => {
            let item = fn.find(arg);
            let data = (await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false)).data;
            data.title = owoify(data.title);
            data.description = owoify(data.description)
            if (data.footer)
                data.footer.text = owoify(data.footer.text)
            return data;
        },

        'choose ': async (msg, arg, args) => {
            if (args.length > 0)
                return {
                    title: `I choose "${args[Math.floor(Math.random() * args.length)]}"`,
                };
        },

        'c~artpreview ': async (msg, arg) => {
            try {
                let args = arg.split('=');
                let att = 0;
                if (args.length > 1)
                    att = parseInt(args[1])-1;
                let art = msg.attachments.at(att);
                if (art == undefined) return {title: 'you need to attach an image to preview!'};
                args[0] = new String(args[0]);
                args[0].filter = arg.filter;
                let item = fn.find(args[0]);
                if (!item.item.hasOwnProperty('itemType') || !['card', 'relic'].includes(item.item.itemType))
                    return {title: `that item couldn\'t be previewed. found ${item.item.itemType} "${item.item.name}"`};
                let itemEmbed = await embed({...item.item, score: item.score, query: args[0]});

                switch (item.item.itemType) {
                    case 'card':
                        let artcanvas = createCanvas(500,380);
                        let artctx = artcanvas.getContext('2d');
                        artctx.drawImage(await loadImage(art.url), 0, 0, 500, 380);
                        artctx.globalAlpha = 0.25;
                        artctx.drawImage(await shadows[cardTypes[item.item.type]], 0, 0);
                        artctx.globalAlpha = 1;
                        artctx.globalCompositeOperation = 'destination-out';
                        artctx.drawImage(await masks[cardTypes[item.item.type]], 0, 0);
        
                        let canvas = createCanvas(1356,874);
                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 0, 0, 678, 874, 0, 0, 678, 874);
                        ctx.drawImage(artcanvas, 89, 123);
                        ctx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 678, 0);
            
                        let filename = `${(item.item.id.includes(':') ? item.item.id.slice(item.item.id.indexOf(':')+1) : item.item.id).replaceAll(' ', '-')}_preview-${String(Math.random()).slice(10)}.png`;
                        fs.writeFileSync(filename, canvas.toBuffer());
        
        
                        let cutcanvas = createCanvas(500,380);
                        let cutctx = cutcanvas.getContext('2d');
                        cutctx.drawImage(await loadImage(art.url), 0, 0, 500, 380);
                        cutctx.globalCompositeOperation = 'destination-out';
                        cutctx.drawImage(await cuts[cardTypes[item.item.type]], 0, 0);
                        let filename2 = filename.replace('_preview-', '_p-');
                        fs.writeFileSync(filename2, cutcanvas.toBuffer());
                        await optimise(filename2);
        
                        let smallcanvas = createCanvas(250,190);
                        let smallctx = smallcanvas.getContext('2d');
                        smallctx.drawImage(cutcanvas, 0, 3, 250, 190);
                        let filename3 = filename2.replace('_p-', '-');
                        fs.writeFileSync(filename3, smallcanvas.toBuffer());
                        await optimise(filename3);
        
                        return {
                            title: item.item.name,
                            description: '250x190 →',
                            image: {url: 'attachment://'+filename},
                            thumbnail: {url: 'attachment://'+filename3},
                            footer: {iconURL: 'attachment://'+filename2, text: '← 500x380'},
                            files: [filename, filename2, filename3],
                            color: itemEmbed.data.color,
                        };


                    case 'relic':
                        let rFilename = `${(item.item.id.includes(':') ? item.item.id.slice(item.item.id.indexOf(':')+1) : item.item.id).replaceAll(' ', '-')}_preview-${String(Math.random()).slice(10)}.png`;
                        let rFilename2 = rFilename.replace('_preview-', '_outline-');
                        let rFilename3 = rFilename.replace('_preview-', '-');
                        let relicanvas = createCanvas(256, 256);
                        let relictx = relicanvas.getContext('2d');
                        relictx.drawImage(await loadImage(art.url), 0, 0, 256, 256);
                        let relicImageData = relictx.getImageData(0, 0, 256, 256)
                        for (let i = 0; i < relicImageData.data.length; i += 4) {
                          relicImageData.data[i] = 255;
                          relicImageData.data[i+1] = 255;
                          relicImageData.data[i+2] = 255;
                        }
                        let outlinecanvas = createCanvas(256, 256);
                        let outlinectx = outlinecanvas.getContext('2d');
                        outlinectx.putImageData(relicImageData,0,0);
                        await new Promise(res => gm(outlinecanvas.toBuffer())
                            .edge(4, 4)
                            .write(rFilename2, err => {
                                if (err) throw err;
                                res();
                            }));
                        outlinectx.clearRect(0,0,256,256);
                        outlinectx.drawImage(await loadImage(rFilename2),0,0);
                        let outlineImageData = outlinectx.getImageData(0, 0, 256, 256);
                        let outlineImageDataBlack = createImageData(256,256);
                        for (let i = 0; i < outlineImageData.data.length; i += 4) {
                            outlineImageData.data[i] = 255;
                            outlineImageData.data[i+1] = 255;
                            outlineImageData.data[i+2] = 255;
                            outlineImageData.data[i+3] = 255-outlineImageData.data[i+3];
                            outlineImageDataBlack.data[i] = 0;
                            outlineImageDataBlack.data[i+1] = 0;
                            outlineImageDataBlack.data[i+2] = 0;
                            outlineImageDataBlack.data[i+3] = outlineImageData.data[i+3];
                        }
                        outlinectx.clearRect(0,0,256,256);
                        outlinectx.putImageData(outlineImageData,0,0);
                        fs.writeFileSync(rFilename2, outlinecanvas.toBuffer());
                        outlinectx.putImageData(outlineImageDataBlack,0,0);
                        let compareCanvas = createCanvas(300,150);
                        let compareCtx = compareCanvas.getContext('2d');
                        compareCtx.globalAlpha = 0.11;
                        compareCtx.drawImage(outlinecanvas, -53, -53);
                        compareCtx.globalAlpha = 1;
                        compareCtx.drawImage(relicanvas, -53, -53);
                        compareCtx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 150, 0);
                        fs.writeFileSync(rFilename, compareCanvas.toBuffer());
                        fs.writeFileSync(rFilename3, relicanvas.toBuffer());
                        await new Promise(res => gm(rFilename2).resize(128,128).write(rFilename2, res));
                        await new Promise(res => gm(rFilename3).resize(128,128).write(rFilename3, res));
                        await optimise(rFilename2);
                        await optimise(rFilename3);
                        return {
                            title: item.item.name,
                            description: '128x128 →',
                            image: {url: 'attachment://'+rFilename},
                            thumbnail: {url: 'attachment://'+rFilename3},
                            footer: {iconURL: 'attachment://'+rFilename2, text: '← outline'},
                            files: [rFilename, rFilename2, rFilename3],
                            color: itemEmbed.data.color,
                        };
                }
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'artpreview ': async (msg, arg) => {
            try {
                let preview = await commands.prefix['c~artpreview '](msg, arg);
                let img = await loadImage(preview.files[0]);
                let canvas = createCanvas(img.width/2,img.height);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                fs.writeFileSync(preview.files[0], canvas.toBuffer());
                return preview;
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'cut~artpreview ': async (msg, arg) => {
            try {
                let preview = await commands.prefix['c~artpreview '](msg, arg);
                delete preview.image;
                fs.unlinkSync(preview.files[0]);
                preview.files = preview.files.slice(1);
                return preview;
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'resize': async (msg, arg) => {
            try {
                let args = arg.split("=");
                if (!args[0].includes('x'))
                    return {title: "resolution must be in the following format: 1280x720 (where 1280 is the width and 720 is the height)"}
                let w = parseInt(args[0].split('x')[0]);
                let h = parseInt(args[0].split('x')[1]);
                if (w > 4000 || h > 4000 || w <= 0 || h <= 0 || isNaN(w) || isNaN(h))
                    return {title: "please make each dimension at least 1 and at most 4000"};
                let n = args.length > 1 ? parseInt(args[1]) : 0;
                let attachment = msg.attachments.at(n-1);
                if (attachment == undefined)
                    return {title: 'format for attachments is att?n?name where n is the number of the attachment e.g. att?1?awsom'};
                let origImg = await loadImage(attachment.url);
                let canvas = createCanvas(origImg.width, origImg.height);
                let ctx = canvas.getContext('2d')
                ctx.drawImage(origImg, 0, 0);
                let filename = `export${String(Math.random()).slice(2)}.png`;
                let filename2 = filename.replace('export', 'resized');
                fs.writeFileSync(filename, canvas.toBuffer());
                await new Promise(res => gm(filename).resize(w,h,'!').write(filename2, res));
                await optimise(filename);
                await optimise(filename2);
                return {
                    title: `${w}x${h} →`,
                    thumbnail: {url: 'attachment://'+filename2},
                    footer: {iconURL: 'attachment://'+filename, text: `← ${origImg.width}x${origImg.height}`},
                    files: [filename, filename2],
                };
            } catch (e) {
                console.log(e);
                return {title: "error resizing"};
            }
        },

        'setnick ': async (msg, _, __, oa) => {
            if (cfg.overriders.includes(msg.author.id) && msg.inGuild()) {
                (await msg.guild.members.fetchMe()).setNickname(oa);
                return {title: ':+1:'};
            } else return {title: "oi!!"};
        },

        'setpresence ': async (msg, _, __, oa) => {
            if (cfg.overriders.includes(msg.author.id)) {
                fs.writeFileSync('presence.txt', Buffer.from(oa));
                setActivity();
                return {title: ':+1:'};
            } else return {title: "this ain't for you"};
        },

        memes: () => ({
            title: 'Meme generator',
            description: `Some memes take more than one item, separate items with the "=" symbol.
The bot can also take users as arguments, to grab their profile pictures, with <meme user?[userId]> for example: <user?${bot.user.id} my beloved>
You can also use just "user?me" to specify yourself.
Add '?left' or '?right' after an item name to just take half of its image e.g. <strike?left my beloved>
            
__List of memes:__
<megamind no [item]>
<megamind textno [text]>
<friendship ended [bad item]=[good item]=[friender]>
<coolerdaniel [daniel]=[coolerdaniel]>
<5 dollar [footlong]>
<19 dollar [fortnite card]>
<distracted [gf]=[distraction]=[bf]>
<[item] my beloved>
<pet the [item]>
<why cant i hold all these [item]=[holder]>
<[item] speech bubble>
<the floor here is made out of [item]>
<the text here is made out of [text]>
<sb [item]=[text in speech bubble]>
<sb [item1]=[text1]=[item2]=[text2]>
<[item] from slay the spire>
<[item] on a billboard>
<[item] on a flying flag>
<[item] on a circuit board>
<i know [item] got me>
<handshake [item]=[other item]=[thing they both do]>
<i believe in [item] supremacy>
<damn [item] got hands>
<spinning [item]>
<rotating [item]>
<squashing [item]>
<dissolving [item]>
<live [name]=[item] reaction>
<same picture [item]=[other item]>
<trade offer [item]=[other item]>
<guardian presents [card]?left>
<[name] is typing>
<image of [item] is typing>
<another one [item]>
<ill take that [item]>
<i have [card]?left in my hand>
<i have [card]?left in my pocket>
<waiter waiter more [item] please>
<finally i have them all [item1]=[item2]=[item3]>
<[item] wants to know your location>
`,
            thumbnail: {url: 'https://media.discordapp.net/attachments/802410376498249820/1002367368623825027/unknown.png?width=566&height=566'},
        }),
        

        'megamind no ': async (msg, arg) => await gifMeme(msg, arg, './memetemplates/mm.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
            ctx.drawImage(items[0].image, 185, 7, 158, 45);
        }, {fps: 12}),

        'megamind textno': async (msg, arg, args, oa) => {
            return {
                title: 'disabled for now - sorry!',
            };
            let textCanvas = createCanvas(158, 45);
            let textCtx = textCanvas.getContext('2d');
            textCtx.fillStyle = 'white';
            drawMultilineText(textCtx, oa, {
                rect: {x: 0, y: 0, width: 158, height: 45},
                lineHeight: 1.0,
                minFontSize: 1,
                maxFontSize: 500,
            });
            let buffer = await canvasGif(
                './memetemplates/mm.gif',
                (ctx, w, h, totalFrames, currentFrame) => {
                    ctx.drawImage(textCanvas, 185, 7);
                },
                {fps: 12}
            );
            let filename = `export${String(Math.random()).slice(2)}.gif`;
            fs.writeFileSync(filename, buffer);
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename]
            };
        },

        'friendship ended ': async (msg, arg) => await meme(msg, arg, {
            w: 600,
            h: 450,
            bg: 'fse.png',
            items: [0, 0, 0],
            put: [
                [1, 113, 66, 111, 107],
                [2, 380, 103, 98, 127],
                [0, 0, 247, 143, 200],
                [0, 422, 271, 176, 177],
                ['fsecross1.png', 4, 260, 135, 184],
                ['fsecross2.png', 431, 283, 155, 149]
            ],
            texts: [
                [0, 402, 0, 170, 64, 'red'],
                [1, 235, 123, 98, 49, 'green'],
            ]
        }),

        'coolerdaniel ': async (msg, arg) => await meme(msg, arg, {
            w: 1452,
            h: 816,
            bg: 'daniel.png',
            items: [0, 0],
            put: [
                [0, 229, 84, 381, 458],
                [1, 794, 110, 341, 414],
            ]
        }),

        '5 dollar ': async (msg, arg) => await meme(msg, arg, {
            w: 757,
            h: 607,
            bg: 'footlong.png',
            items: [0],
            put: [[0, 374, 183, 165, 32]],
            texts: [[0, 407, 16, 346, 110, 'black']]
        }),

        '19 dollar ': async (msg, arg) => await meme(msg, arg, {
            w: 779,
            h: 751,
            bg: '19dollar.png',
            items: [0],
            put: [[0, 60, 404, 157, 229]],
            texts: [[0, 82, 653, 622, 98, 'white']]
        }),

        'distracted ': async (msg, arg) => await meme(msg, arg, {
            w: 800,
            h: 533,
            bg: 'distracted.png',
            items: [0, 0, 0],
            put: [
                [0, 598, 145, 110, 108],
                [1, 152, 120, 158, 160],
                [2, 397, 88, 89, 106]
            ],
        }),

        'why cant i hold all these ': async (msg, arg) => await meme(msg, arg, {
            w: 450,
            h: 600,
            bg: 'hold.png',
            items: [0, 0],
            put: [
                [0, 116, 439, 38, 38],
                [0, 225, 374, 44, 40],
                [0, 187, 370, 38, 38],
                [0, 207, 390, 37, 37],
                [0, 148, 349, 44, 43],
                [0, 105, 367, 45, 43],
                ['holdhand.png', 87, 351, 253, 131],
                [0, 221, 398, 48, 45],
                [1, 139, 100, 124, 160],
            ],
            texts: [[0, 276, 518, 86, 48, 'white']]
        }),

        'the floor here is made out of ': async (msg, arg) => await meme(msg, arg, {
            w: 554,
            h: 394,
            bg: 'floor.png',
            items: [0],
            put: [
                [0, 278, 208, 47, 50],
                [0, 496, 208, 47, 50],
            ],
        }),
        
        'the text here is made out of ': async (msg, arg) => await meme(msg, arg, {
            w: 554,
            h: 394,
            bg: 'floor.png',
            items: [1],
            texts: [
                [0, 278, 208, 47, 50, 'black'],
                [0, 496, 208, 47, 50, 'black'],
            ],
        }),
        
        'handshake ': async (msg, arg) => await meme(msg, arg, {
            w: 697,
            h: 500,
            bg: 'handshake.png',
            items: [0, 0, 1],
            put: [
                [0, 67, 234, 203, 220],
                [1, 376, 180, 204, 205],
            ],
            texts: [[2, 123, 32, 293, 156, 'white']],
        }),
        
        'same picture ': async (msg, arg) => await meme(msg, arg, {
            w: 500,
            h: 559,
            bg: 'samepicture.png',
            items: [0, 0],
            put: [
                [0, [[77, 16], [263, 32], [201, 198], [8, 163]]],
                [1, [[315, 41], [561, 77], [480, 242], [233, 200]]],
            ],
            texts: [],
        }),
        
        'trade offer ': async (msg, arg) => await meme(msg, arg, {
            w: 607,
            h: 794,
            bg: 'tradeoffer.png',
            items: [0, 0],
            put: [
                [0, 34, 182, 187, 177],
                [1, 346, 181, 194, 176],
            ],
            texts: [],
        }),

        'guardian presents': async (msg, arg) => await meme(msg, arg, {
            w: 720,
            h: 512,
            bg: 'guardianpresents1.png',
            items: [0],
            put: [
                [0, 6, 28, 287, 370],
                ['guardianpresents2.png', 0, 0, 720, 512]
            ],
        }),

        'finally i have them all ': async (msg, arg) => await meme(msg, arg, {
            w: 1920,
            h: 1920,
            bg: 'finally.png',
            items: [0, 0, 0],
            put: [
                [0, [[588, 6], [921, 171], [591, 465], [246, 288]]],
                [1, [[948, 186], [1299, 348], [945, 672], [615, 507]]],
                [2, [[1323, 369], [1668, 528], [1311, 861], [957, 693]]],
            ],
        }),

        'pet the ': async (msg, arg) => {
            let items = await getMemeItems(arg, {items: [0]}, msg);
            if (!Array.isArray(items))
                return items;
            let imgUrl = items[0].image.toDataURL ? items[0].image.toDataURL('image/png') : items[0].url;
            let gif = await petPetGif(imgUrl);
            let filename = `petpet${String(Math.random()).slice(2)}.gif`;
            fs.writeFileSync(filename, gif);
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename]
            };
        },

        'spinning ': async (msg, arg) => await gifMeme(msg, arg, './memetemplates/empty60frames.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
            let progress = currentFrame/totalFrames*4;
            let phase = Math.floor(progress);
            progress %= 1;
            progress = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2
            if (phase > 1) {
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
            }
            if (phase%2==0)
                ctx.drawImage(items[0].image, w/2*(1-progress), 0, w*progress, h);
            else
                ctx.drawImage(items[0].image, w/2*(progress), 0, w*(1-progress), h);
        }),

        'rotating ': async (msg, arg) => await gifMeme(msg, arg, './memetemplates/empty60frames.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
            let progress = currentFrame/totalFrames;
            ctx.translate(w/2, h/2);
            ctx.rotate(progress * Math.PI * 2);
            ctx.drawImage(items[0].image, -w/2, -h/2, w, h);
        }),

        'squashing ': async (msg, arg) => await gifMeme(msg, arg, './memetemplates/empty60frames.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
            let progress = currentFrame/totalFrames;
            let imgW = w*(0.75+Math.sin(progress*Math.PI*2)*0.25);
            let imgH = h*(0.75+Math.cos(progress*Math.PI*2)*0.25);
            ctx.drawImage(items[0].image, (w-imgW)/2, h-imgH, imgW, imgH);
        }),

        'dissolving ': async (msg, arg) => {
            let items = await getMemeItems(arg, {items: [0]}, msg);
            if (!Array.isArray(items))
                return items;
            let croppedCanvas = createCanvas(250, 250);
            let croppedCtx = croppedCanvas.getContext('2d');
            croppedCtx.fillStyle = 'black';
            croppedCtx.fillRect(0, 0, 250, 250);
            croppedCtx.drawImage(items[0].image, 0, 0, 250, 250);
            let pixels = croppedCtx.getImageData(0, 0, 250, 250).data;
            pixels = Array(pixels.length/4).fill(null).map((p, i) => ({
                oX: i % 250,
                oY: ~~(i / 250),
                x: i % 250,
                y: ~~(i / 250),
                r: pixels[i*4],
                g: pixels[i*4+1],
                b: pixels[i*4+2],
                a: pixels[i*4+3],
                p: 0,
                d: Math.random() * 2 - 1,
                f: Math.random()
            }));
            let started = [];
            return await gifMeme(msg, arg, './memetemplates/empty60frames.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
                let progress = currentFrame/totalFrames;
                if (progress > 0.25) {
                    fn.shuffle(pixels);
                    for (let i = 0; i < w * h / totalFrames * 4; i++) {
                        if (pixels.length == 0) break;
                        started.push(pixels.pop());
                    }
                }
                let image = croppedCtx.getImageData(0, 0, 250, 250);
                let data = image.data;
                for (let p of started) {
                    let index = (w * p.oY + p.oX) * 4;
                    data[index] = 0;
                    data[index+1] = 0;
                    data[index+2] = 0;
                }
                let progressAdd = 4/totalFrames;
                for (let p of started) {
                    p.p += progressAdd;
                    if (p.p >= 1 || p.a == 0 || p.r + p.b + p.g == 0) continue;
                    p.x += 3 * p.d;
                    p.y -= 8 * p.f * p.p;
                    if (p.x < 0 || p.x >= 250 || p.y < 0 || p.y >= 250) continue;
                    let index = (w * ~~p.y + ~~p.x) * 4;
                    let a = (p.a * (1 - p.p)) / 255;
                    let bA = 1 - a;
                    data[index] = ~~(p.r * a + data[index] * bA);
                    data[index+1] = ~~(p.g * a + data[index+1] * bA);
                    data[index+2] = ~~(p.b * a + data[index+2] * bA);
                }
                ctx.putImageData(image, 0, 0);
            });
        },

        'another one ': async (msg, arg) => await gifMeme(msg, arg, './memetemplates/anotherone.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
            if ([[0, 11], [21, 28], [38, 45], [59, 67], [83, 92], [102, 111], [127, 133]].some(e => e[0] <= currentFrame-1 && e[1] >= currentFrame-1)) {
                ctx.fillStyle = 'white';
                ctx.fillRect(131, 57, 45, 40);
                ctx.drawImage(items[0].image, 131, 57, 45, 40);
            }
        }, {
            coalesce: true,
            fps: 12
        }),

        'ill take that ': async (msg, arg) => await gifMeme(msg, arg, './memetemplates/cattake.gif', (ctx, w, h, totalFrames, currentFrame, items) => {
            if (currentFrame >= 55 && currentFrame <= 113)
            (new Perspective(ctx, items[0].image)).draw([[69, 172], [122, 185], [102, 226], [48, 216]].map(c => [c[0]+currentFrame * 0.1, c[1]]));
        }, {
            coalesce: true,
            fps: 33
        }),

        'sb ': async (msg, _, __, oa) => {
            let args = oa.split('=');
            let numArgs = args.length;
            if (numArgs % 2 != 0) return {title: "The number of arguments for this must be a multiple of 2."};

            let options = {
                w: 100*numArgs,
                h: 200,
                bg: 'empty.png',
                items: [],
                put: [],
                texts: [],
            };
            for (let i = 0; i < numArgs / 2; i++) {
                let xOffset = 200*i;
                options.items.push(0);
                options.items.push(1);
                options.put.push([2*i, 25+xOffset, 50, 150, 150]);
                if (args[i*2+1] != '')
                    options.put.push(['speechbubble2.png', 0+xOffset, 0, 200, 200]);
                options.texts.push([2*i+1, 17+xOffset, 13, 164, 31, 'black']);
            }
            return await meme(msg, oa, options);
        },

        'calc ': async (msg, _, __, oa) => {
            return {
                title: ' ',
                description: oa.split(',').map(eq => `${eq.replaceAll('\\*', '*').replaceAll('*', '\\*')} = ${fmFunc(eq)}`).join('\n'),
            }
        },

        'plot ': async (msg, arg, _, oa) => {
            if (arg == 'help') {
                return {
                    title: 'plot help',
                    description: 'example: <plot y=x*(x+7)/2+12 minx=0 maxx=20 interval=1> would output the following:',
                    image: {url: 'https://media.discordapp.net/attachments/959928848076660756/1065417596507275264/graph8854503956392445.png?width=720&height=540'}
                }
            }
            let attrs = {};
            let args = oa.toLowerCase().split(' ');
            for (let i of args.slice(1)) {
                if (!i.includes('=')) return {title: 'invalid arguments'};
                let parts = i.split('=');
                attrs[parts[0]] = Number(parts[1]);
                if (Number.isNaN(attrs[parts[1]])) return {title: 'invalid number'};
            }
            for (let i of ['minx', 'maxx', 'interval']) if (!attrs.hasOwnProperty(i)) return {title: `missing "${i}" argument`};
            let numPoints = (attrs.maxx-attrs.minx)/attrs.interval;
            if (numPoints < 1 || numPoints > 1000) return {title: 'must graph at least 1 point and at most 1001 points'};
            let equation = args[0];
            if (equation.includes('=')) equation = equation.slice(equation.indexOf('=')+1);
            let points = [];
            for (let x = attrs.minx; x <= attrs.maxx; x+=attrs.interval)
                points.push({x: x, y: fmFunc(equation.replaceAll('x', x))});
            let filename = `graph${String(Math.random()).slice(2)}.png`;
            let precision = Math.ceil(attrs.interval);
            fs.writeFileSync(filename, await charter.renderToBuffer({
                type: 'line',
                data: {
                    labels: points.map(p => Number(p.x.toPrecision(5))),
                    datasets: [{
                        label: "y = "+equation,
                        data: points.map(p => p.y),
                    }]
                },
                options: {}
            }));
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename]
            };
        },

        'ws?': async (msg, arg) => {
            let response = await fetch(`https://steamcommunity.com/workshop/browse/?appid=646570&searchtext=${arg.replaceAll(' ', '+')}`);
            let body = await response.text();
            if (body.includes('class="ugc"')) {
                body = body.split('\n');
                let linkIndex = body.findIndex(e => e.includes('class="ugc"'));
                let link = body[linkIndex];
                let img = body[linkIndex+2];
                let title = body[linkIndex+10];
                let url = link.slice(link.indexOf('"')+1,link.indexOf('" '));
                let imgUrl = img.slice(img.indexOf('src="')+5,img.indexOf('">'));
                let name = title.slice(title.indexOf('s">')+3,title.indexOf('</div>'));
                let description;
                let author = {};
                let footer;
                let response2 = await fetch(url);
                let body2 = await response2.text();
                if (body2.includes('class="stats_table"')) {
                    body2 = body2.split('\n');
                    let authorLine = body2.find(e => e.includes('s Workshop'));
                    author.name = `${authorLine.slice(authorLine.indexOf('0">')+3, authorLine.indexOf('s Workshop')-1)}'s Workshop`;
                    author.url = authorLine.slice(authorLine.indexOf("href=")+6, authorLine.indexOf('0">')+1);
                    let response3 = await fetch(author.url);
                    let body3 = await response3.text();
                    if (body3.includes('playerAvatar medium')) {
                        body3 = body3.split('\n');
                        let avatarIndex = body3.findIndex(e => e.includes('playerAvatar medium'));
                        let avatarLine = body3[avatarIndex+(body3[avatarIndex+1].includes('profile_avatar_frame') ? 10 : 3)];
                        author.iconURL = avatarLine.slice(avatarLine.indexOf('srcset=')+8, avatarLine.indexOf('" />')-2);
                    }
                    let tableIndex = body2.findIndex(e => e.includes('class="stats_table"'));
                    let subs = body2[tableIndex+6].slice(body2[tableIndex+6].indexOf('<td>')+4, body2[tableIndex+6].indexOf('</td>'));
                    let detailsIndex = body2.findIndex(e => e.includes('class="detailsStatsContainerRight"'));
                    let date = body2[detailsIndex+2].slice(body2[detailsIndex+2].indexOf('">')+2, body2[detailsIndex+2].indexOf(' @ '));
                    description = `[Open in Steam](${cfg.exportURL}/redirect/${encodeURIComponent(`steam://url/CommunityFilePage/${url.slice(url.indexOf('=')+1, url.indexOf('&'))})`)}\n${subs} Subscribers / Posted ${date}`;
                    let commentIndex = body2.findIndex(e => e.includes('commentthread'));
                    if (commentIndex != -1) body2 = body2.slice(0, commentIndex);
                    let githubLine = body2.find(e => e.includes('/linkfilter/?url=https://github.com'));
                    if (githubLine != undefined) {
                        githubLine = githubLine.slice(githubLine.indexOf('/linkfilter/?url=https://github.com')+17);
                        description += ` / [GitHub](${githubLine.slice(0, githubLine.indexOf('"'))})`;
                    } else {
                        githubLine = body2.find(e => e.includes('/linkfilter/?url=http://github.com'));
                        if (githubLine != undefined) {
                            githubLine = githubLine.slice(githubLine.indexOf('/linkfilter/?url=http://github.com')+17);
                            description += ` / [GitHub](${githubLine.slice(0, githubLine.indexOf('"'))})`;
                        }
                    }
                }
                return {
                    title: name,
                    url,
                    author,
                    description,
                    footer,
                    color: 1779768,
                    thumbnail: {url: imgUrl},
                };
            } else return {title: `no mod found under ${arg}`};
        },

        'workshop?': async (msg, arg) => {
            return await commands.prefix['ws?'](msg, arg);
        },

        'google?': async (msg, _, __, oa) => {
            try {
                let results = await googleIt({query: oa.toString(), disableConsole: true, limit: 1});
                if (results.length > 0) {
                    let result = results[0];
                    let site = result.link.slice(result.link.indexOf('://')+3)
                    site = site.slice(0, site.indexOf('/'));
                    return {
                        author: {
                            name: site,
                        },
                        title: result.title,
                        url: result.link,
                        description: result.snippet
                    };
                } else return {title: "No results."}
            } catch (e) {
                console.error(e);
                return {title: 'error'};
            }
        },

        'github?': async (msg, arg) => {
            let url = `https://github.com/search?q=${arg.replaceAll(' ', '+')}`;
            let response = await fetch(url);
            let body = await response.text();
            if (body.includes('repo-list-item')) {
                let dom = new JSDOM(body);
                let results = Array.from(dom.window.document.getElementsByClassName('repo-list-item')).map((e, i) => `${i+1}, https://github.com/${e.children[1].children[0].children[0].children[0].innerHTML.replaceAll('<em>', '').replaceAll('</em>', '')}`);
                
                return {
                    title: `Searched GitHub for \"${arg}\"`,
                    url,
                    description: results.join('\n')
                };
            } else return {title: `No results on GitHub for "${arg}"`};
        },

        'wiki?': async (msg, arg) => {
            let url = `https://github.com/search?type=wikis&q=repo%3Akiooeht%2FModTheSpire+repo%3Adaviscook477%2FBaseMod+repo%3Akiooeht%2FStSLib+repo%3AAlchyr%2FBasicMod+${arg.replaceAll(' ', '+')}`;
            let response = await fetch(url);
            let body = await response.text();
            try {
                if (body.includes('react-app.embeddedData')) {
                    body = body.slice(body.indexOf("react-app.embeddedData\">") + "react-app.embeddedData\">".length)
                    body = body.slice(0, body.indexOf("</script>"))
                    let result = JSON.parse(body).payload.results[0];
                    let baseWikiUrl = `https://github.com/${result.repo.repository.owner_login}/${result.repo.repository.name}/wiki/`;
                    let response2 = await fetch(`${baseWikiUrl}${result.path}`);
                    let content = await response2.text();
                    content = content.replace(/\[\[(.*)\]\]/g, `[$1](${baseWikiUrl}$1)`);
                    content = content.replace(/\[(.*)\]\(\#(.*)\)/g, `[$1](${baseWikiUrl}${result.path.replace('.md', '')}#$2)`);
                    content = content.replace(/\[(.*)\]\(((?!http).*)\)/g, `[$1](${baseWikiUrl}$2)`);
                    if (content.length > 1000) {
                        content = content.slice(0, 1000);
                        if ((content.match(new RegExp('```', 'gi')) ?? []).length % 2 == 1)
                            content += '\n```';
                        content += '...';
                    }
                    return {
                        author: {
                            name: `${result.repo.repository.owner_login}/${result.repo.repository.name} - Wiki`,
                            iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
                        },
                        title: result.title,
                        url: `${baseWikiUrl}${result.path.replace('.md', '')}`,
                        description: content,
                        footer: {text: `Last updated ${new Date(result.updated_at).toDateString()}`}
                    };
                } else
                    return {title: `No GitHub wiki result for "${arg}"`, url};
            } catch(e) {
                console.error(e);
                return {title: `No GitHub wiki result for "${arg}"`, url};
            }
        },

        'mtg?': async (msg, _, __, oa) => {
            let filters = oa.toLowerCase().split(' ').filter(a => a.includes('=')).map(a => a.split('='));
            let arg = oa.toLowerCase().split(' ').filter(a => !a.includes('=')).join(' ');
            let url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(arg)}`;
            let response = await fetch(url);
            let body = await response.text();
            const colors = {
                R: [16727357, '<:red:1142975145737195583>'],
                G: [5745515, '<:green:1142975140666290287>'],
                B: [1776667, '<:black:1142975136996262068>'],
                U: [6393287, '<:blue:1142975141651955723>'],
                W: [16774356, '<:white:1142975145015791706>'],
            };
            const emojis = {
                0: '<:zero:1142978589969625118>',
                1: '<:one:1142978590548439142>',
                2: '<:two:1142978592679153734>',
                3: '<:three:1142978593681571871>',
                4: '<:four:1142978595027963944>',
                5: '<:five:1142978596672114799>',
                6: '<:six:1142978597741678612>',
                7: '<:seven:1142978598693765310>',
                8: '<:eight:1142978621431087265>',
                9: '<:nine:1142978602003091526>',
                C: '<:colorless:1142975138829176892>',
                X: '<:x_:1142975143803637862>',
                'G/U': '<:gu:1142979006514348163>',
                'G/W': '<:gw:1142979014823247922>',
                'B/R': '<:br:1142979005247651951>',
                'R/G': '<:rg:1142979013787267072>',
                'U/B': '<:ub:1142979009190313994>',
                'U/R': '<:ur:1142979008183668757>',
                'W/B': '<:wb:1142979016664551464>',
                'R/W': '<:wr:1142979012495425587>',
                'W/U': '<:wu:1142979017784438824>',
                T: '<:tap:1142979030077947994>',
            };
            try {
                let results = JSON.parse(body);
                let resultNum = 0;
                for (let f of filters) {
                    if (f[0] == 'r') {
                        let r = Math.max(1, parseInt(f[1])) - 1;
                        if (!Number.isNaN(r)) resultNum += r;
                    }
                }
                let makeEmbed = (result, uri) => {
                    let embed = {
                        title: `${result.name}${result.mana_cost.length > 0 ? ` / ${result.mana_cost}` : ''}`,
                        url: uri,
                        description: `${result.hasOwnProperty('type_line') ? result.type_line : ''}${result.hasOwnProperty('power') ? ` | ${result.power}/${result.toughness}` : ''}${result.hasOwnProperty('oracle_text') ? `\n\n${result.oracle_text}` : ''}${result.hasOwnProperty('flavor_text') ? `\n\n*${result.flavor_text}*` : ''}`,
                        color: result.hasOwnProperty('color_identity') && result.color_identity.length > 0 && colors.hasOwnProperty(result.color_identity[0]) ? colors[result.color_identity[0]][0] : 3158833,
                        thumbnail: {url: result.image_uris.normal}
                    };
                    for (let c in colors) {
                        embed.title = embed.title.replaceAll(`{${c}}`, colors[c][1]);
                        embed.description = embed.description.replaceAll(`{${c}}`, colors[c][1]);
                    }
                    for (let e in emojis) {
                        embed.title = embed.title.replaceAll(`{${e}}`, emojis[e]);
                        embed.description = embed.description.replaceAll(`{${e}}`, emojis[e]);
                    }
                    return new EmbedBuilder(embed);
                }
                if (results.hasOwnProperty('data') && results.data.length > resultNum) {
                    let result = results.data[resultNum];
                    if (result.hasOwnProperty('card_faces'))
                        return {...makeEmbed(result.card_faces[0], result.scryfall_uri).data, extra_embeds: result.card_faces.slice(1).map(r => makeEmbed(r, result.scryfall_uri))};
                    else
                        return makeEmbed(result, result.scryfall_uri).data;
                }
                else
                    return {title: `Scryfall returned no result for "${arg}"`, url};
            } catch (e) {
                console.error(e);
                return {title: `Unknown error?`, url};
            }
        },

        'remindme ': async (msg, arg, args) => {
            let reqTime = Number(args[0].slice(0, -1));
            let time = reqTime;
            let timeunit = args[0].slice(-1);
            switch (timeunit) {
                case 'd':
                    time *= 24;
                case 'h':
                    time *= 60;
                case 'm':
                    time *= 60;
                case 's':
                    time *= 1000;
                    break;
                default:
                    time = NaN;
            }
            if (Number.isNaN(time))
                return {title: 'Usage: `<remindme 5m> fix that one bug`'};
            time += Date.now();
            db.Reminder.create({
                user: msg.author.id,
                at: time,
                contents: msg.content,
                message: msg.url
            });
            return {title: `Got it. I'll remind you <t:${Math.round(time/1000)}:R>.`};
        },

        'feedback?': async (msg, _, __, oa) => {
            if (!fs.existsSync('feedbacknum.txt'))
                fs.writeFileSync('feedbacknum.txt', '0');
            let num = JSON.parse(fs.readFileSync('feedbacknum.txt'));
            let channel = await bot.channels.fetch(cfg.feedbackChannel);
            if (channel) {
                channel.send({embeds: [EmbedBuilder.from({
                    author: {
                        name: msg.author.tag,
                        iconURL: msg.author.avatarURL()
                    },
                    description: `#${++num}${msg.inGuild() ? `: ${msg.url}` : ''}`,
                    title: oa.toString(),
                })]});
            }
            fs.writeFileSync('feedbacknum.txt', num.toString());
            return {title: `Sent feedback #${num}.`};
        },



        'vb?': async (msg, arg) => { return await commands.prefix['vexbox?'](msg, arg); },
        'box?': async (msg, arg) => { return await commands.prefix['vexbox?'](msg, arg); },
        'vexbox?': async (msg, arg) => {
            for (let i in vexboxdata.boxes) {
                if (vexboxdata.boxes[i].name.toLowerCase() == arg.toLowerCase()) {
                    return {
                        title: vexboxdata.boxes[i].name,
                        description: vexboxdata.boxes[i].description,
                        color: parseInt(vexboxdata.boxes[i].colour.substr(0, 2) + vexboxdata.boxes[i].colour.substr(2, 2) + vexboxdata.boxes[i].colour.substr(4, 2), 16),
                        thumbnail: {url: cfg.exportURL + "/vexbox/img/" + i + ".png"},
                    }
                }
            }
        },
    },

    suffix: {
        ' my beloved': async (msg, arg) => await makesweetMeme('heart-locket', arg, msg),
        ' on a flying flag': async (msg, arg) => await makesweetMeme('flag', arg, msg),
        ' on a billboard': async (msg, arg) => await makesweetMeme('billboard-cityscape', arg, msg),
        ' on a circuit board': async (msg, arg) => await makesweetMeme('circuit-board', arg, msg),

        ' from slay the spire': async (msg, arg) => await meme(msg, arg, {
            w: 680,
            h: 538,
            bg: 'fromsts.png',
            items: [0],
            put: [[0, 234, 75, 137, 126]],
            texts: [[0, 235, 352, 243, 47, 'black']]
        }),

        ' speech bubble': async (msg, arg) => await meme(msg, arg, {
            w: 200,
            h: 200,
            bg: 'empty.png',
            items: [0],
            put: [
                [0, 25, 50, 150, 150],
                ['speechbubble.png', 0, 0, 200, 200]
            ],
        }),

        ' is typing': async (msg, arg, args, oa) => {
            return { title: 'disabled for now - sorry!' };
            let textCanvas = createCanvas(194, 48);
            let textCtx = textCanvas.getContext('2d');
            textCtx.fillStyle = 'white';
            drawMultilineText(textCtx, oa, {
                rect: {x: 0, y: 0, width: 194, height: 48},
                lineHeight: 1.0,
                minFontSize: 1,
                maxFontSize: 500,
            });
            let buffer = await canvasGif(
                './memetemplates/typing.gif',
                (ctx, w, h, totalFrames, currentFrame) => {
                    ctx.drawImage(textCanvas, 87, 3);
                },
                {fps: 12}
            );
            let filename = `export${String(Math.random()).slice(2)}.gif`;
            fs.writeFileSync(filename, buffer);
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename]
            };
        },

        ' wants to know your location': async (msg, arg) => await meme(msg, arg, {
            w: 777,
            h: 290,
            bg: 'location.png',
            items: [0],
            put: [[0, 116, 46, 208, 55]],
            texts: []
        }),
    },

    prefixAndSuffix: [
        [
            'i know ', ' got me',
            async (msg, arg) => await meme(msg, arg, {
                w: 680,
                h: 651,
                bg: 'gotme.png',
                items: [0],
                put: [[0, 378, 107, 223, 223]],
                texts: [[0, 213, 418, 211, 92, 'black']],
            }),
        ],
        
        [
            'i have ', ' in my hand',
            async (msg, arg) => {
                if (arg.includes('='))
                    return await meme(msg, arg, {
                        w: 500,
                        h: 340,
                        bg: 'hand2.png',
                        items: [0,0],
                        put: [
                            [1, [[341, 34], [474, 144], [321, 318], [189, 202]]],
                            ['handoverlay2.png', 0, 0, 500, 340],
                            [0, [[49, 56], [225, -11], [325, 209], [153, 293]]],
                            ['handoverlay.png', 0, 0, 500, 340]
                        ],
                        texts: [],
                    });
                else
                    return await meme(msg, arg, {
                        w: 500,
                        h: 340,
                        bg: 'hand.png',
                        items: [0],
                        put: [
                            [0, [[49, 56], [225, -11], [325, 209], [153, 293]]],
                            ['handoverlay.png', 0, 0, 500, 340]
                        ],
                        texts: [],
                    });
            }
        ],

        [
            'i have ', ' in my pocket',
            async (msg, arg) => await meme(msg, arg, {
                w: 996,
                h: 664,
                bg: 'pocket.png',
                items: [0],
                put: [
                    [0, [[504, 273], [607, 92], [767, 297], [696, 459]]],
                    ['pocketover.png', 0, 0, 996, 664]
                ],
                texts: [],
            }),
        ],

        [
            'i believe in ', ' supremacy',
            async (msg, arg) => await meme(msg, arg, {
                w: 502,
                h: 497,
                bg: 'supremacy.png',
                items: [0],
                put: [[0, 26, 272, 151, 192]],
                texts: [[0, 54, 74, 408, 90, 'black']],
            }),
        ],

        [
            'damn ', ' got hands',
            async (msg, arg) => await meme(msg, arg, {
                w: 515,
                h: 500,
                bg: 'gothands.png',
                items: [0],
                put: [[0, 216, 53, 219, 205]],
                texts: [
                    [0, 375, 1, 137, 35, 'black'],
                    [0, 246, 354, 91, 36, 'black']
                ],
            }),
        ],

        [
            'live ', ' reaction',
            async (msg, arg) => await meme(msg, arg, {
                w: 196,
                h: 145,
                bg: 'livereaction1.png',
                items: [1, 0],
                upper: true,
                put: [
                    [1, 23, 48, 145, 145],
                    ['livereaction2.png', 0, 0, 196, 145],
                ],
                texts: [[0, 42, 6, 65, 22, 'white']]
            }),
        ],

        [
            'waiter waiter more ', ' please',
            async (msg, arg) => await meme(msg, arg, {
                w: 352,
                h: 466,
                bg: 'waiterwaiter.png',
                items: [0],
                put: [
                    [0, 47, 63, 128, 156]
                ],
                texts: []
            }),
        ],

        [
            'image of ', ' is typing',
            async (msg, arg, args, oa) => {
                return { title: 'disabled for now - sorry!' };
                let items = await getMemeItems(arg, {items: [0]}, msg);
                if (!Array.isArray(items))
                    return items;
                let buffer = await canvasGif(
                    './memetemplates/typing.gif',
                    (ctx, w, h, totalFrames, currentFrame) => {
                        ctx.fillStyle = 'white';
                        ctx.drawImage(items[0].image, 87, 3, 194, 48);
                    },
                    {fps: 12}
                );
                let filename = `export${String(Math.random()).slice(2)}.gif`;
                fs.writeFileSync(filename, buffer);
                return {
                    title: ' ',
                    image: {url: 'attachment://'+filename},
                    files: [filename]
                };
            },
        ]
    ]
};

export default commands;
