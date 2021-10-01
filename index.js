import fetch from 'node-fetch';

const WEI = 1000000000000000000;

const getActions = (category) => (fetch(`https://kawaii-martketplace-api.airight.io/v0/list_recent?category=${category}`, {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,th;q=0.8",
        "if-none-match": "W/\"19d5-lDLeecyND9vb26+JlRcawEcFMcQ\"",
        "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    },
    "referrer": "https://kawaii-islands.airight.io/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
})
    .then(x => x && x.json())
    .then(x => x)
    .catch(e => { console.error('FETCH ERROR', e) })
);

var CACHE = [];
const TELEGRAM_TOKEN = '';

const send = (message) => (fetch(`https://api.telegram.org/${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({
        chat_id: "-517618260",
        text: message.replace(/-/g, `\\-`).replace(">", `\\>`).replace(/\./g, `\\.`).replace(/\[/g, `\\[`).replace(/]/g, `\\]`).replace(/=/g, `\\=`).replace(/\+/g, `\\+`),
        parse_mode: "MarkdownV2"
    }),
    headers: { 'Content-Type': 'application/json' }
})
    .then(x => x && x.json())
    .then(x => x)
    .catch(e => { console.error('SEND MESSAGE ERROR', e) })
);

const find = async (category, limit) => {
    await getActions(category).then(async r => {
        for (let i = 0; i < r.items.length; i++) {
            const price = r.items[i].endingPrice / WEI;
            if (price < limit && !CACHE.includes(r.items[i].tokenId + "-" + r.items[i].indexToken)) {
                CACHE.push(r.items[i].tokenId + "-" + r.items[i].indexToken);
                await send(category.toUpperCase() + " " + r.items[i].tokenId + " PRICE " + price + " AIRI \nhttps://kawaii-islands.airight.io/auction/" + r.items[i].tokenId + "/" + r.items[i].indexToken);
            }
        }
    }).catch(e => {
        console.log('FETCH ERROR', e)
    });
}

(async () => {

    while (true) {
        //fields
        await find('fields', 1000);
        //trees
        await find('trees', 1000);
        //animals
        await find('animals', 1000);
        //materials
        await find('materials', 50);
        //dyes
        await find('dyes', 50);
        //decors
        await find('decors', 100);
        await new Promise(r => setTimeout(r, 5 * 1000));
    }

})();