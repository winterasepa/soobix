const { default: axios, isAxiosError } = require('axios')
const cheerio = require("cheerio")
const { load } = require('cheerio');
const { lookup } = require('mime-types');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Proxy = (url)=>(url ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp`: '');
async function getExt(filename, split) {
     var getFilename = filename.split(split)
     var ext = getFilename[getFilename.length - 1]
     return ext
   };
   
async function mediafire(url) {
const res = await axios.get(Proxy(url))
const $ = cheerio.load(res.data)
let isObject = new Object();
const hasil = []
const link = $('a#downloadButton').attr('href').replace('https://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=', '');
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
mimee = lookup(nama);
const extt = await getExt(nama, '.');
hasil.push({ nama, mimee, extt, size, link })
return hasil
}

async function mediafire2(url) {
		return new Promise(async (resolve, reject) => {
			await axios.get(Proxy(url), {
				headers: {
					'User-Agent': global.userAgent
				}
			}).then(({ data }) => {
				if (isAxiosError()) return reject(Error('Axios Error'));
				const $ = cheerio.load(data);
				const judul = $("body > main > div.content > div.center > div > div.dl-info > div > div.filename").text().trim();
				const upload_date = $('ul.details > li:nth-child(2) > span').text();
				const size = $('ul.details > li:nth-child(1) > span').text();
				const filename = $('div.filename').eq(0).text().trim();
				const mimet = lookup(judul);
				const link = $('#downloadButton').attr('href').replace('https://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=', '');
				const result = {
					title: judul,
					published: upload_date,
					size: size,
					filename: filename,
					mime: mimet,
					url: link
				};
				resolve(result);
			}).catch(reject);
		});
	}
	
async function mediafire3(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const sfetch = await fetch(Proxy(url))
      const CheerioFetch = await sfetch.text()
      const $ = load(CheerioFetch)

      let isObject = new Object();
      isObject.title = $("body > main > div.content > div.center > div > div.dl-info > div > div.filename").text().trim();
      isObject.size = $("body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span").text();
      isObject.date = $("body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span").text().split(" ").join(" | ");
      isObject.mime = lookup(isObject.title);
      isObject.ext = await getExt(isObject.title, '.');
      isObject.url = $('a#downloadButton').attr('href').replace('https://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=', '');
    
    resolve({ 
    creator: '@skam - AbuYoga',
    status: true,
    data: {
        name: isObject.title,
        size: isObject.size,
        date: isObject.date,
        mime: isObject.mime,
        ext: isObject.ext,
        url: isObject.url} })
    return resolve
  } catch (e) {
      resolve({
      creator: '@skam - AbuYoga',
      status: false,
      msg: e.toString()
         })
      }
      })
}
module.exports = { getExt, mediafire, mediafire2, mediafire3 }