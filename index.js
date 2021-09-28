import fetch from 'node-fetch';

const WEI = 1000000000000000000;

const getActions = (category) => (fetch(`https://kawaii-martketplace-api.airight.io/v0/list_auction?category=${category}&limit=10&page=0&sort=PriceEndAsc`, {
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

const FIELDS = [];
const PLANTS = [];
const ANIMALS = [];

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

(async () => {

    await send("Hi");

    while (true) {
        //fields
        await getActions('fields').then(async r => {
            const price = r.items[0].endingPrice / WEI;
            if (price < 1000 && !FIELDS.includes(r.items[0].tokenId)) {
                FIELDS.push(r.items[0].tokenId);
                await send("FIELDS " + r.items[0].tokenId + " PRICE " + price + " AIRI");
            }
        }).catch(e => {
            log.error('FETCH ERROR', e)
        });

        //trees
        await getActions('trees').then(async r => {
            const price = r.items[0].endingPrice / WEI;
            if (price < 1000 && !PLANTS.includes(r.items[0].tokenId)) {
                PLANTS.push(r.items[0].tokenId);
                await send("TREES " + r.items[0].tokenId + " PRICE " + price + " AIRI");
            }
        }).catch(e => {
            log.error('FETCH ERROR', e)
        });

        //animals
        await getActions('animals').then(async r => {
            const price = r.items[0].endingPrice / WEI;
            if (price < 1000 && !ANIMALS.includes(r.items[0].tokenId)) {
                ANIMALS.push(r.items[0].tokenId);
                await send("ANIMALS " + r.items[0].tokenId + "  PRICE " + price + " AIRI");
            }
        }).catch(e => {
            log.error('FETCH ERROR', e)
        });

        await new Promise(r => setTimeout(r, 10 * 1000));
    }

})();