const { default: axios, isAxiosError } = require('axios')
const cheerio = require("cheerio")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function Ai(query) {
return new Promise(async (resolve, reject) => {
try {
const data = await fetch("https://better-gpt.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: query
      }),
    });
respon = await data.json() 
resolve({
creator: '@Wan',
    status: true,
    data: {
        result: respon.bot.trim()
} })
return resolve
} catch (e) {
      resolve({
      creator: '@Wan',
      status: false,
      msg: e.toString()
         })
}
})
}
module.exports = { Ai }
