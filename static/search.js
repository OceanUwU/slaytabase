const ITEMS_RETURNED = 50;
const POPUP_SHOW_TIME = 200;

var searchBar = document.getElementById('search');
var resultsBox = document.getElementById('results');
var resultFormat = document.getElementById('resultFormat');
var imagePopup = document.getElementById('popup');
var loadMoreButton = document.createElement('button');
loadMoreButton.classList.add('btn', 'btn-primary', 'btn-sm');
loadMoreButton.innerText = 'Load more';
imagePopup.onclick = () => {
    imagePopup.animate([{opacity: 1}, {opacity: 0}], {duration: POPUP_SHOW_TIME, iterations: 1});
    setTimeout(() => imagePopup.style.display = 'none', POPUP_SHOW_TIME-10);
}

let resultNum = 1;

let firstQuery = decodeURIComponent(window.location.search.slice(1));
if (firstQuery.includes('?embnum=0'))
    firstQuery = firstQuery.slice(0, firstQuery.indexOf('?embnum=0'));
searchBar.value = window.location.search.length > 1 ? firstQuery : '';
if (searchBar.value.length > 0)
    (async () => addItems(await getResults(searchBar.value)))();

searchBar.onkeyup = () => {
    let queryBefore = searchBar.value;
    setTimeout(async () => {
        let query = searchBar.value;
        if (query == queryBefore) {
            if (window.history.replaceState)
                window.history.replaceState({}, null, `?${encodeURIComponent(queryBefore)}`);
            resultNum = 1
            let results = await getResults(query);
            resultsBox.innerHTML = '';
            addItems(results);
        }
    }, 500);
};

function getResults(query) {
    return new Promise(res => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                res(JSON.parse(xmlHttp.responseText));
        }
        xmlHttp.open('GET', '/s?'+encodeURIComponent(query), true);
        xmlHttp.send(null);
    });
}

loadMoreButton.onclick = async () => {
    resultsBox.removeChild(loadMoreButton);
    resultNum += ITEMS_RETURNED;
    addItems(await getResults(`${searchBar.value} r=${resultNum}`));
};

const stars = n => Array(Number(n)).fill('⭐').join('');

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

function addItems(items) {
    for (let i of items) {
        let item = i.item;
        let block = {
            title: item.name,
            footer: `${i.score.toFixed(2)} - ${item.id}`
        };
        if (item.hasOwnProperty('character'))
            block.colour = item.character[1];
        
        let modPath = item.mod;
        if (item.v != 1) modPath = `${item.v}-${modPath}`;
        switch(item.itemType) {
            case 'card':
                block.thumbnail = `/${modPath}/cards/${item.id.replace('+', '').replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('\"', '').replaceAll('?', '').replaceAll('/', '')}.png`.toLowerCase();
                block.content = `${item.type != 'Curse' ? `${item.rarity} ${item.type} / ` : ''}${item.cost == '' ? '' : `${item.cost} ${item.character[2]}${item.hasOwnProperty('starCost') ? ` ${item.starCost} <:energy_star:1477661993463844875>` : ''} / `}${item.character[0]} / ${item.hasOwnProperty('pack') ? `Pack: ${item.pack}` : item.mod}\n\n${item.description}${item.flavor ? `\n*${item.flavor}*` : ''}`;
                break;

            case 'relic':
                block.thumbnail = `/${modPath}/relics/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '').replaceAll('?', '')}.png`.toLowerCase();
                block.content = ` ${item.tier} Relic / ${item.character[0]} / ${item.mod}\n\n${item.description}\n*${item.flavorText}*`;
                break;
                
            case 'potion':
                block.thumbnail = `/${modPath}/potions/${item.id.replaceAll(' ', '').replaceAll(':','-')}.png`.toLowerCase();
                block.content = `${item.rarity} Potion / ${item.character[0]} / ${item.mod}\n\n${item.description}${item.flavor ? `\n*${item.flavor}*` : ''}`;
                break;
            
            case 'event':
                block.colour = 4608066;
                block.thumbnail = `/extraImages/events/${item.name.toLowerCase().replaceAll(' ', '').replaceAll('?', '').replaceAll('!', '')}.jpg`.toLowerCase();
                block.content = `Event / Act${item.acts.length > 1 ? 's' : ''} ${item.acts.join(', ')} / ${item.character[0]}${item.character == 'All' ? ' characters' : ''} / ${item.mod}\n\`\`\`ansi\n${item.colouredDesc.replaceAll('\n', '\n``````ansi\n')}\n\`\`\``;
                break;
                
            case 'creature':
                block.thumbnail = `/${modPath}/creatures/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '')}.png`.toLowerCase();
                block.content = `${item.type} / ${item.minHP == item.maxHP ? item.maxHP : `${item.minHP}-${item.maxHP}`}${item.hasOwnProperty('minHPA') && item.minHPA != item.minHP || item.maxHPA != item.maxHPA ? ` (${item.minHPA != item.maxHPA ? `${item.minHPA}-${item.maxHPA}` : item.maxHPA})` : ''} HP / ${item.mod}\n\n${item.hasOwnProperty('moves') ? item.moves.map(m => `**<:intent_${m.type}:${intentEmojis[m.type]}> ${m.name}**: ${m.description}`).join('\n') : ''}${item.description ? `\n\n${item.description}` : ''}`;
                break;

            case 'blight':
                block.thumbnail = `/${modPath}/blights/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '')}.png`.toLowerCase();
                block.content = `Blight / ${item.mod}\n\n${item.description}`;
                break;
            
            case 'boss':
                block.thumbnail = `/extraImages/bosses/${item.name.replaceAll(' ', '')}.png`.toLowerCase();
                block.content = item.description;
                break;
            
            case 'keyword':
                block.content = `Keyword / ${item.mod}\n\n${item.description}`;
                break;
        
            case 'enchantment':
                block.content = `Enchantment / ${item.mod}\n\n${item.description}`;
                break;
            
            case 'affliction':
                block.content = `Affliction / ${item.mod}\n\n${item.description}`;
                break;
        
            case 'mod':
                block.content = `Mod by ${item.authors.join(', ')}\nVersion on bot: ${item.version}${item.credits.length > 0 ? `\nCredits: ${item.credits}` : ''}\n\n${item.originalDescription}`;
                break;
        
            case 'augment':
                block.content = `${item.rarity} Augment / ${item.mod}\n\n${item.description}`;
                break;
        
            case 'nodemodifier':
                block.content = `${modPath} Nodemodifier / ${item.mod}\n\n${item.description}\n*Appears on ${item.rooms.length > 1 ? `${item.rooms.slice(0, -1).join(', ')} and ${item.rooms.slice(-1)}` : item.rooms.join(', ')}*.`;
                block.thumbnail = `/${item.mod}/nodemodifiers/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '')}.png`.toLowerCase();
                break;
        
            case 'adventurerboard':
                block.content = `Adventurerboard / ${item.mod}\n\n${item.specialRule != 'None' ? `Special rule: ${item.specialRule}\n\n` : ''}${item.effects}`;
                break;
            
            case 'pack':
                block.thumbnail = `/${modPath}/packs/${item.id.replaceAll(':', '-')}.png`.toLowerCase();
                block.color = 12083229;
                block.content = `${item.mod.replace('The ', '')} Card Pack / By ${item.author}\n\n${item.description}\nOffense: ${stars(item.offense)}\nDefense: ${stars(item.defense)}\nSupport: ${stars(item.support)}\nFrontload: ${stars(item.frontload)}\nScaling: ${stars(item.scaling)}\nTags: ${item.tags.join(', ')}\n\nCards: ${item.cards.join(', ')}${item.credits.length > 0 ? '\n\nCredits: '+item.credits : ''}`;
                break;
        }

        let el = resultFormat.cloneNode(true);
        el.id = item.id;
        el.classList.remove('d-none');
        el.firstChild.style.backgroundColor = `#${block.colour.toString(16).padStart(6, "0")}`;
        el.style.backgroundColor = el.firstChild.style.backgroundColor.replace('rgb', 'rgba').replace(')', ', 0.05)');
        if (block.hasOwnProperty('thumbnail'))
            el.lastChild.firstChild.src = block.thumbnail;
        else
            el.removeChild(el.lastChild)
        let info = el.childNodes[1];
        info.firstChild.firstChild.innerText = block.title;
        info.firstChild.firstChild.href = `/w/${item.mod}/${item.id}`;
        info.lastChild.innerText = block.footer;
        let content = info.childNodes[1];
        content.innerHTML = block.content
            .replaceAll('\n', '<br>')
            .replaceAll('```ansi', '')
            .replaceAll('```', '')
            .replaceAll('[2;37m', '')
            .replaceAll('[2;31m', '')
            .replaceAll('[2;32m', '')
            .replaceAll('[0;2m', '')
            .replaceAll('[2;34m', '')
            .replaceAll('[2;33m', '')
            .replace(/\*\*(.*?)\*\*/gm, '<b>$1</b>')
            .replace(/\*(.*?)\*/gm, '<i>$1</i>')
            .replace(/~~(.*?)~~/gm, '<s>$1</s>')
            .replace(/\<\:(.*?)\:(.*?)\>/gm, '<img src="https://cdn.discordapp.com/emojis/$2?size=20">');

        resultsBox.appendChild(el);
    }

    if (items.length >= ITEMS_RETURNED)
        resultsBox.appendChild(loadMoreButton);
}

function previewImage(image) {
    imagePopup.firstChild.src = image.src;
    imagePopup.style.display = '';
    imagePopup.animate([{opacity: 0}, {opacity: 1}], {duration: POPUP_SHOW_TIME, iterations: 1});
}