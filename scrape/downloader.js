const axios = require('axios');
const cheerio = require('cheerio');

async function fbdl(url) {
const {data} = await axios('https://ssyoutube.com/api/convert', {method: "POST", data: `url=${url}`})
return data
}

module.exports = {
  fbdl
}