const { search } = require('./../../scrape/play');
exports.run = {
   usage: ['play'],
   hidden: ['lagu', 'song', 'music'],
   use: 'query',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
         client.sendReact(m.chat, '🕒', m.key)
         const srch = await search(text)
         //if (!srch || srch.length == 0) return client.reply(m.chat, global.status.fail, m)
         const json = await Func.fetchJson('https://yt.nxr.my.id/yt2?url=https://youtu.be/' + srch[0].videoId + '&type=audio')
         if (!json.status || !json.data.url) return client.reply(m.chat, global.status.fail, m)
         let caption = `⦿  *Y T - P L A Y*\n\n`
         caption += `	◦  *Title* : ${json.title}\n`
         caption += `	◦  *Size* : ${json.data.size}\n`
         caption += `	◦  *Duration* : ${json.duration}\n`
         caption += `	◦  *Bitrate* : ${json.data.quality}\n\n`
         caption += global.footer
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, ` File size (${json.data.size}) is too large, download it by yourself via this link : ${await (await Api.tinyurl(json.data.url)).data}`, m)
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.thumbnail)
         }).then(async () => {
            client.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
               document: true,
               APIC: await Func.fetchBuffer(json.thumbnail)
            })
         })
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   restrict: true,
   cache: true,
   location: __filename
}
