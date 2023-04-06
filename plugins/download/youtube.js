const axios = require('axios')
const xfarr = require('xfarr-api')
const { ytVideo } = require('./../../scrape/alldownload');
exports.run = {
   usage: ['yt', 'ytdl', 'ytmp3', 'ytmp4', 'youtube'],
   hidden: ['convert', 'yta', 'ytv'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      client,
      args,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (command == 'yt' || command == 'youtube') {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, '🕒', m.key)
            const json = await ytVideo(args[0]);
            let caption = `⦿ *Y T - M P 4*\n\n`
               caption += `	◦  *Title* : ${json.title}\n`
               caption += `	◦  *Duration* : ${json.duration}\n\n`
               caption += global.footer;
            client.sendFile(m.chat, json.link, Func.filename('mp4'), caption, m)
            /*const json = await xfarr.downloader.youtube(args[0])
               let caption = `⦿ *Y T - M P 4*\n\n`
               caption += `	◦  *Title* : ${json.title}\n`
               caption += `	◦  *Username* : ${json.username}\n`
               caption += `	◦  *Quality* : ${json.fquality}\n`
               caption += `	◦  *Size* : ${json.size}\n\n`
               caption += global.footer
let chSize = Func.sizeLimit(json.size, global.max_upload)
               if (chSize.oversize) return client.reply(m.chat, `❌ File size (${json.size}) is too large, download it by yourself via this link : ${await (await Api.tinyurl(json.download_url)).data}`, m)
let isSize = (json.size).replace(/MB/g, '').trim()
               if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer(json.thumbnail)
               }).then(async () => await client.sendFile(m.chat, json.download_url, json.title, '', m, {
                  document: true
               }))
         client.sendFile(m.chat, json.download_url, Func.filename('mp4'), caption, m)*/
         } else if (/yt?(a|mp3)/i.test(command)) {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Func.fetchJson('https://yt.nxr.my.id/yt2?url=' + args[0] + '&type=audio')
            if (!json.status || !json.data.url) return client.reply(m.chat, global.status.error, m)
            let caption = `⦿ *Y T - P L A Y*\n\n`
            caption += `	◦  *Title* : ${json.title}\n`
            caption += `	◦  *Size* : ${json.data.size}\n`
            caption += `	◦  *Duration* : ${json.duration}\n`
            caption += `	◦  *Bitrate* : ${json.data.quality}\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(json.data.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `❌ File size (${json.data.size}) is too large, download it by yourself via this link : ${await (await Api.tinyurl(json.data.url)).data}`, m)
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json.thumbnail)
            }).then(async () => {
               client.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
                  document: true,
                  APIC: await Func.fetchBuffer(json.thumbnail)
               })
            })
         } else if (/yt?(v|mp4)/i.test(command)) {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, '🕒', m.key)
            const json = await ytVideo(args[0]);
            let caption = `⦿ *Y T - M P 4*\n\n`
               caption += `	◦  *Title* : ${json.title}\n`
               caption += `	◦  *Duration* : ${json.duration}\n\n`
               caption += global.footer;
            client.sendFile(m.chat, json.link, Func.filename('mp4'), caption, m)
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}
