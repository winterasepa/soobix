const { default: axios, isAxiosError } = require('axios')
const cheerio = require("cheerio")
const { load } = require('cheerio');
const { lookup } = require('mime-types');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Proxy = (url)=>(url ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp`: '');
async function getExt(filename, split) {
     var getFilename = filename.split(split)
     var ext = getFilename[getFilename.length - 1]
     return ext;
   };
const mediafire5 = async (url) => {
		return new Promise(async (resolve, reject) => {
			await axios.get(Proxy(url), {
				headers: {
					'User-Agent': global.userAgent
				}
			}).then(({ data }) => {
				if (isAxiosError()) return reject(Error('Axios Error'));
				const $ = cheerio.load(data);
				const judul = $('html > head > title').text();
				const upload_date = $('ul.details > li:nth-child(2) > span').text();
				const size = $('ul.details > li:nth-child(1) > span').text();
				const filename = $('div.filename').eq(0).text();
				const mimet = lookup(judul);
				let exte = await getExt(judul, '.');
				const link = $('#downloadButton').attr('href').replace('https://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=', '');
				const result = {
					title: judul,
					published: upload_date,
					size: size,
					filename: filename,
					mime: mimet,
					ext: exte,
					url: link
				};
				resolve(result);
			}).catch(reject);
		});
	}
module.exports = { getExt, mediafire5 }