const fs = require('fs');
const { decode } = require('html-entities');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
exports.run = {
   usage: ['gitclone'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      text
   }) => {
try {
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'https://github.com/adiwajshing/Baileys'), m)
if (!regex.test(args[0])) return client.reply(m.chat, '*Url Invalid!*', m)
let [_, user, repo] = args[0].match(regex) || []
repo = repo.replace(/.git$/, '')
let url = `https://api.github.com/repos/${user}/${repo}/zipball`
let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
client.sendFile(m.chat, url, unescape(decode(filename)), '', m)
} catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
},
error: false,
   limit: true,
   cache: true,
   location: __filename
}