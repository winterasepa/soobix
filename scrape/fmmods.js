const { get } = require('axios');
const { load } = require('cheerio');
  
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{2})+(?!\d))/g, ".");
    return str.join(".");
}

async function fm() {
return new Promise(async (resolve, reject) => {
try {
let { data } = await get('https://fmmods.com/download-center/mega.php')
let $ = load(data)
let version = $("#downloadlink1").attr('href').split('/')[4].replace('.', '_').replace('_apk','.apk').replace(/\D/g, '')
const result = $('div.su-button-center').get().map(output => {
    let isObject = new Object();
      isObject.version = separator(version)
      isObject.package = $(output).find('a > span').text().split('(')[0].trim()
      isObject.title = $(output).find('a').attr('href').split('/')[4].replace('.', '_').replace('_apk','.apk')
      isObject.url = $(output).find('a').attr('href');
      return isObject;
    });
resolve({ 
    creator: '@Wans',
    status: true,
    data: result })
return resolve
} catch (e) {
      return({
      creator: '@Wans',
      status: false,
      msg: String(e)
         })
      }
})
}

module.exports = {
  fm
}