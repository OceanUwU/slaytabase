import { search } from './index.js';

const unPunctuate = str => str.replaceAll('\n', ' ').replace(/[^\w\s?~=:]|_/g, "").replace(/\s+/g, " ").trim().toLowerCase();

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
  

function findAll(query) {
    let filter = query.filter;
    query = new String(unPunctuate(query));
    query.filter = filter;
    let args = query.split(' ');
    let actualSearch = args.filter(w => !w.includes('=')).join(' ').slice(0, 100);
    let results;
    args = args.map(a => a.endsWith('?left') ? a.replace('?left', '') : a);
    args = args.map(a => a.endsWith('?right') ? a.replace('?right', '') : a);
    if (args[0] == "randomitem")
        results = shuffle(search._docslist.map((r, i) => ({item: r, score: 0, refIndex: i})));
    else if (actualSearch == "")
        results = search._docslist.map((r, i) => ({item: r, score: 0, refIndex: i}));
    else
        results = search.search(actualSearch);
    if (query.filter) results = results.filter(query.filter);
    let page = 0;
    let mods = [];
    let result = 0;
    let limit = 0;
    for (let i of args) {
        if (i.includes("=")) {
            let prop = i.slice(0, i.indexOf("="));
            let val = i.slice(i.indexOf("=")+1);
            switch (prop) {
                case "cost":
                    results = results.filter(r => r.item.hasOwnProperty('cost') && r.item.cost.toLowerCase().includes(val));
                    break;

                case "type":
                    results = results.filter(r => (r.item.hasOwnProperty('itemType') && r.item.itemType.toLowerCase().includes(val)) || (r.item.hasOwnProperty('type') && r.item.type.toLowerCase().includes(val)));
                    break;

                case "sts":
                case "slaythespire":
                case "slay":
                case "spire":
                case "game":
                case "version":
                case "gameversion":
                case "v":
                    let v = Number.parseInt(val);
                    if (!Number.isNaN(v) && Number.isSafeInteger(v))
                        results = results.filter(r => (r.item.v == v));
                    break;

                case "mod":
                    mods.push(val);
                    break;

                case "rarity":
                    results = results.filter(r => (r.item.hasOwnProperty('rarity') && r.item.rarity.toLowerCase() == val) || (r.item.hasOwnProperty('tier') && r.item.tier.toLowerCase() == val));
                    break;

                case "in":
                    results = results.filter(r => r.item.searchText.replaceAll(' ', '').includes(val));
                    break;

                case "ex":
                    results = results.filter(r => !r.item.searchText.replaceAll(' ', '').includes(val));
                    break;
                
                case "color":
                    results = results.filter(r => (r.item.hasOwnProperty('color') && unPunctuate(r.item.color) == val) || (r.item.hasOwnProperty('tier') && unPunctuate(r.item.tier) == val));
                    break;
                
                case "tag":
                    results = results.filter(r => (r.item.hasOwnProperty('tags') && r.item.tags.find(t => t.toLowerCase() == val) != undefined));
                    break;
                
                case "r":
                    let resultNum = Math.max(1, Math.min(parseInt(val), results.length)) - 1;
                    if (!Number.isNaN(resultNum)) result += resultNum;
                    break;
                
                case "page":
                    page = Math.max(0, parseInt(val)-1);
                    if (Number.isNaN(page)) page = 0;
                    break;
                
                case "limit":
                    let limitNum = Math.max(1, Math.min(parseInt(val), results.length));
                    if (!Number.isNaN(limitNum)) limit += limitNum;
                    break;
            }
        }
    }
    if (mods.length > 0) {
        results = results.filter(r => {
            if (!r.item.hasOwnProperty('mod')) return false;
            let mod = unPunctuate(r.item.mod.replaceAll(' ', ''));
            return mods.some(m => mod.includes(m) || m.includes(mod));
        });
    }
    let total = results.length;
    results = [...results.slice(0, 100).sort((a,b) => {
        let aM = a.item.searchName == actualSearch || a.item.searchId == actualSearch;
        let bM = b.item.searchName == actualSearch || b.item.searchId == actualSearch;
        if (aM && !bM) return -1;
        else if (!aM && bM) return 1;
        else if (aM && bM) {
            let aV = a.item.mod == 'Slay the Spire' || a.item.mod == 'Slay the Spire 2';
            let bV = b.item.mod == 'Slay the Spire' || b.item.mod == 'Slay the Spire 2';
            if (aV && !bV) return -1;
            if (!bV && aV) return 1;
            return 0;
        } else return 0;
    }), ...results.slice(100)];
    results = results.slice(10*page);
    results = results.slice(result);
    if (limit > 0)
        results = results.slice(0, limit);
    results.total = total;
    results.page = page;
    return results;
}

function find(query) {
    let filter = query.filter;
    query = query.split(' ');
    query = query.map(a => a.endsWith('?left') ? a.replace('?left', '') : a);
    query = query.map(a => a.endsWith('?right') ? a.replace('?right', '') : a);
    query = new String(query.join(' '));
    query.filter = filter;
    //let actualSearch = query.split(' ').filter(w => !w.includes('=')).join(' ');
    let results = findAll(query);
    let item = results.length > 0 ? results[0] : undefined; //(query.includes('+') ? results.find(e => e.name.includes('+')) : results[0])
    if (item == undefined)
        item = {item: {
            itemType: 'fail',
            name: 'No results',
        }};
    return item;
}

export default {
    shuffle,
    unPunctuate,
    findAll,
    find,
};