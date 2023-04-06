const { decode } = require('html-entities')
const { mediafire2 } = require('./../../scrape/mediafire')
exports.run = {
   usage: ['mediafire'],
   hidden: ['mf'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://www.mediafire.com/file/1fqjqg7e8e2v3ao/YOWA.v8.87_By.SamMods.apk/file'), m)
         if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) return client.reply(m.chat, global.status.invalid, m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let json = await mediafire2(args[0])
       //if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let text = `⦿  *M E D I A F I R E*\n\n`
         text += '	◦  *Name* : ' + unescape(decode(json.filename)) + '\n'
         text += '	◦  *Size* : ' + json.size + '\n'
         text += '	◦  *Title* : ' + json.title + '\n'
         text += '	◦  *Published* : ' + json.published + '\n'
         text += '	◦  *Mime* : ' + json.mime + '\n'
         text += `	◦  *Url* : ${await (await Api.tinyurl(json.url)).data}\n`
         text += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         text += global.footer
         let chSize = Func.sizeLimit(json.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `❌ File size (${json.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Api.tinyurl(json.url)).data}`, m)
         client.sendMessageModify(m.chat, text, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/b2d5a31422827b0297871.jpg')
         }).then(async () => {
            client.sendFile(m.chat, json.url, unescape(decode(json.filename)), '', m)
         })
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}