const Xfarr = require("xfarr-api");
exports.run = {
   usage: ['soundcloud'],
   hidden: ['scdl'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} :\n\n${isPrefix + command} https://soundcloud.com/cipilatoz/keisya-levronka-tak-ingin-usai`, m)
         client.sendReact(m.chat, '🕒', m.key)

         const json = await Xfarr.downloader.soundcloud(text)
let caption = `⦿  *SOUNDCLOUD - P L A Y*\n\n`
         caption += `	◦  *Title* : ${json.title}\n`
caption += `	◦  *Duration* : ${json.duration}\n`
caption += `	◦  *Link* : ${await (await Api.tinyurl(json.download)).data}\n`
caption += `	◦  *Quality* : ${json.quality}\n\n`
caption += global.footer
 client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.thumbnail)
         })    
  client.sendFile(m.chat, json.download, json.title + '.mp3', '', m, {
            document: true
         })
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   limit: true,
   location: __filename
}