const ITEMS_RETURNED = 50;
const POPUP_SHOW_TIME = 200;

var searchBar = document.getElementById('search');
var resultsBox = document.getElementById('results');
var resultFormat = document.getElementById('resultFormat');
var imagePopup = document.getElementById('popup');
imagePopup.onclick = () => {
    imagePopup.animate([{opacity: 1}, {opacity: 0}], {duration: POPUP_SHOW_TIME, iterations: 1});
    setTimeout(() => imagePopup.style.display = 'none', POPUP_SHOW_TIME-10);
}

let firstQuery = decodeURIComponent(window.location.search.slice(1));
if (firstQuery.includes('?embnum=0'))
    firstQuery = firstQuery.slice(0, firstQuery.indexOf('?embnum=0'));
searchBar.value = window.location.search.length > 1 ? firstQuery : '';
if (searchBar.value.length > 0)
    (async () => addItems(await getResults(searchBar.value)))();
else
    document.getElementById('colours').classList.remove('d-none');

searchBar.onkeyup = () => {
    let queryBefore = searchBar.value;
    setTimeout(async () => {
        let query = searchBar.value;
        if (query == queryBefore) {
            resultsBox.innerHTML = '';
            if (window.history.replaceState)
                window.history.replaceState({}, null, `?${encodeURIComponent(queryBefore)}`);
            if (queryBefore.trim().length == 0)
                document.getElementById('colours').classList.remove('d-none');
            else {
                document.getElementById('colours').classList.add('d-none');
                let results = await getResults(query);
                addItems(results);
            }
        }
    }, 500);
};

function setImageSize(slider) {
    document.getElementById("imageSize").innerHTML = `.result {width: calc(100%/${slider.value});}`;
}
setImageSize(document.getElementById("imagesPerRow"));
function setUpgraded(check) {
    document.getElementById("showUpgrade").innerHTML = `.result > div > img {margin-left: ${check.checked ? -100 : 0}%;}`;
}
function color(colorName, v) {
    document.getElementById('colours').classList.add('d-none');
    searchBar.value = `v=${v} color=${colorName}`;
    searchBar.onkeyup();
}

function getResults(query) {
    return new Promise(res => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                res(JSON.parse(xmlHttp.responseText));
        }
        xmlHttp.open('GET', '/sf?'+encodeURIComponent(`${query} type=card limit=200`), true);
        xmlHttp.send(null);
    });
}

function addItems(items) {
    resultsBox.innerHTML = '';
    for (let i of items) {
        let el = resultFormat.cloneNode(true);
        el.id = i.item.id;
        el.classList.remove('d-none');
        let img = el.firstChild.firstChild
        img.src = `/${i.item.v == 1 ? '' : i.item.v + '-'}${i.item.mod}/cards/${i.item.id.replace('+', '').replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('\"', '').replaceAll('?', '').replaceAll('/', '')}.png`.toLowerCase();
        img.setAttribute('alt', i.item.name);

        resultsBox.appendChild(el);
    }
}

function copyEmbed(url, e) {
    navigator.clipboard.writeText(location.origin+'/e?'+encodeURIComponent(url));
    e.title = 'Copied!';
    e.tooltip.hide();
    e.tooltip = new bootstrap.Tooltip(e);
    e.tooltip.show();
}

function popup(image) {
    imagePopup.firstChild.src = image.src;
    imagePopup.style.display = '';
    imagePopup.animate([{opacity: 0}, {opacity: 1}], {duration: POPUP_SHOW_TIME, iterations: 1});
}