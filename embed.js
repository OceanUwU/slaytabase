import { EmbedBuilder } from 'discord.js';
import cfg from './cfg.js';
import fn from './fn.js';

let stars = n => Array(Number(n)).fill('\\⭐').join('');

const intentEmojis = {
    D: '1130343362575208450',
    a: '1130343365251174421',
    ab: '1130343275191087195',
    ad: '1130343273827934288',
    af: '1130343276491317318',
    b: '1130343282841501797',
    bd: '1130343281579004074',
    bf: '1130343278898839642',
    d: '1130343288382173264',
    e: '1130343265833586738',
    f: '1130343284099797082',
    s: '1130343269637832805',
    u: '1130343270879338588',
    z: '1130343268329214022',
};

async function embed(item, msg, embeds=[], encode=true) {
    let e = {};
    e.title = `${item.name}`;
    if (item.hasOwnProperty('url'))
        e.url = item.url;
    if (item.hasOwnProperty('img'))
        e.thumbnail = {url: `${cfg.exportURL}/${item.img}`};
    if (item.hasOwnProperty('query') && !item.query.includes(fn.unPunctuate(item.name)) && item.query != item.searchId)
        e.footer = {
            //iconURL: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp?size=32`,
            text: `${item.query.filter ? '<' : '[['}${item.query.slice(0, 75)}${item.query.length > 75 ? '...' : ''}${item.query.filter ? '>' : ']]'} = ${item.name == 'No results' ? '?' : item.searchName}${item.score != undefined ? ', '+item.score.toFixed(2) : ''}`, //text: `${msg.author.username}: <${item.query}>`,
        };
    switch (item.itemType) {
        case 'card':
            e.color = item.character[1];
            e.description = `${item.type != 'Curse' ? `${item.rarity} ${item.type} / ` : ''}${item.cost == '' ? '' : `${item.cost} ${item.character[2]} / `}${item.character[0]} / ${item.hasOwnProperty('pack') ? `Pack: ${item.pack}` : item.mod}\n\n${item.description.replaceAll('~~-', '​~~-')}${item.flavor ? `\n*-# ${item.flavor.replaceAll("\n", "\n#- ")}*` : ''}`;
            break;

        case 'relic':
            e.color = item.character[1];
            e.description = ` ${item.tier} Relic / ${item.character[0]} / ${item.mod}\n\n${item.description}\n*-# ${item.flavorText.replaceAll("\n", "\n#- ")}*`;
            break;
            
        case 'potion':
            if (item.character[0] != 'All')
                e.color = item.character[1];
            e.description = `${item.rarity} Potion / ${item.character[0]} / ${item.mod}\n\n${item.description}${item.flavor ? `\n*-# ${item.flavor.replaceAll("\n", "\n#- ")}` : ''}*`;
            break;
        
        case 'event':
            e.color = 4608066;
            e.description = `Event / Act${item.acts.length > 1 ? 's' : ''} ${item.acts.join(', ')} / ${item.character[0]}${item.character == 'All' ? ' characters' : ''} / ${item.mod}\n\`\`\`ansi\n${item.colouredDesc.replaceAll('\n', '\n``````ansi\n')}\n\`\`\``;
            break;
            
        case 'creature':
            e.description = `${item.type} / ${item.minHP == item.maxHP ? item.maxHP : `${item.minHP}-${item.maxHP}`}${item.hasOwnProperty('minHPA') && item.minHPA != item.minHP || item.maxHPA != item.maxHPA ? ` (${item.minHPA != item.maxHPA ? `${item.minHPA}-${item.maxHPA}` : item.maxHPA})` : ''} HP / ${item.mod}\n\n${item.hasOwnProperty('moves') ? item.moves.map(m => `**<:intent_${m.type}:${intentEmojis[m.type]}> ${m.name}**\n\`\`\`ansi\n${m.colouredDesc}\n\`\`\``).join('') : ''}${item.description ? `\n${item.description}` : ''}`;
            break;

        case 'blight':
            e.description = `Blight / ${item.mod}\n\n${item.description}`;
            break;
        
        case 'boss':
            e.color = item.character[1];
            e.description = item.description;
            break;
        
        case 'keyword':
            e.description = `Keyword / ${item.mod}\n\n${item.description}`;
            break;
        
        case 'mod':
            e.description = `Mod / By ${item.authors.join(', ')} / ${item.version} / [Export](${cfg.exportURL}/${encodeURIComponent(item.name.toLowerCase())}) / [Search](${cfg.exportURL}/search?mod%3D${fn.unPunctuate(item.name.replaceAll(' ',''))})${item.credits.length > 0 ? `\nCredits: ${item.credits}` : ''}\n\n${item.originalDescription}`;
            e.url = `https://steamcommunity.com/workshop/browse/?appid=646570&searchtext=${item.name.replaceAll(' ', '+')}`;
            break;
        
        case 'pack':
            e.color = 12083229;
            e.description = `${item.mod.replace('The ', '')} Card Pack / By ${item.author}\n\n${item.description}\nOffense: ${stars(item.offense)}\nDefense: ${stars(item.defense)}\nSupport: ${stars(item.support)}\nFrontload: ${stars(item.frontload)}\nScaling: ${stars(item.scaling)}\nTags: ${item.tags.join(', ')}\n\nCards: ${item.cards.join(', ')}${item.credits.length > 0 ? '\n\nCredits: '+item.credits : ''}`;
            break;
        
        case 'augment':
            e.description = `${item.rarity} Augment / ${item.mod}\n\n${item.description}`;
            break;
        
        case 'nodemodifier':
            e.description = `${item.type} Nodemodifier / ${item.mod}\n\n${item.description}\n*Appears on ${item.rooms.length > 1 ? `${item.rooms.slice(0, -1).join(', ')} and ${item.rooms.slice(-1)}` : item.rooms.join(', ')}*.`;
            break;
        
        case 'adventurerboard':
            e.description = `Adventurerboard / ${item.mod}\n\n${item.specialRule != 'None' ? `Special rule: ${item.specialRule}\n\n` : ''}${item.effects}`;
            break;
        
        case 'command':
            e.color = 16777215;
            e.title = '';
            delete e.url;
            delete e.footer;
            let args;
            if (item.type == 'prefix')
                args = item.query.slice(item.name.length);
            else if (item.type == 'suffix')
                args = item.query.slice(0, item.query.length-item.name.length);
            else if (item.type == 'exact')
                args = '';
            else if (item.type == 'prefixAndSuffix')
                args = item.query.slice(item.name.length, item.query.length-item.suffix.length);
            args = args.trim().split(' ');
            let arg = new String(args.join(' '));
            arg.filter = item.query.filter;
            let oa = new String(item.type == 'prefix' ? item.originalQuery.slice(item.name.length) : item.originalQuery.slice(0, -item.name.length));
            oa.filter = item.query.filter;
            let result = await item.do(msg, arg, args, oa);
            for (let i in result)
                e[i] = result[i];
            break;
        
        case 'custom':
            e.color = 8224125;
            e.description = item.command.description;
            e.thumbnail = {url: decodeURI(item.command.image)};
            delete e.footer;
            break;
        
        case 'fail':
            delete e.url;
            e.description = `If you think this is a mistake, contact <@106068236000329728>\n\n[Search for "${item.query.replaceAll('+', '')}" on the Slay the Spire wiki](https://slaythespire.wiki.gg/wiki/Special:Search?query=${item.query.replaceAll('+', '').replaceAll(' ', '+')})?`;
            e.color = 0;
            break;
    }

    if (encode) {
        if (e.thumbnail && e.thumbnail.hasOwnProperty('url'))
            e.thumbnail.url = encodeURI(e.thumbnail.url);
        if (e.image && e.image.url)
            e.image.url = encodeURI(e.image.url);
    }

    return e.title == '' ? null : new EmbedBuilder(e);
}

export default embed;
