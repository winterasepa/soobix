const axios = require("axios")
const qs = require("qs");
const cheerio = require("cheerio");

async function wikipedia(query) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://id.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(query)}`)
            .then(async ({ data }) => {
                const getId = data.query.search[0].pageid;
                await axios.get(`https://id.wikipedia.org/?curid=${getId}`)
                    .then(({ data }) => {
                        const $ = cheerio.load(data);
                        let script = $("script[type='application/ld+json']").get();
                        let json;
                        for (let anu of script) {
                            json = JSON.parse(anu.children[0].data);
                        }
                        const result = $("table.infobox").next().text().trim();
                        const resultt = {
                            title: json.headline || query,
                            url: json.url,
                            publisher: json.publisher.name,
                            datePublished: json.datePublished,
                            thumbnail: json.image || json.publisher.logo.url,
                            context: result
                        };
                        resolve(resultt);
                    }).catch(reject);
            }).catch(reject);
    });
}

module.exports = {
  wikipedia
}