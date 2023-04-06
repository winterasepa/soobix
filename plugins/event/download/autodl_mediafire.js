const { decode } = require('html-entities')
const { mediafire2 } = require('./../../../scrape/mediafire')

exports.run = {
   regex: /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/,
   async: async (m, {
      client,
      body,
      users,
      setting
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
               }
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('mediafire', m.sender)
               links.map(async link => {
                  let json = await mediafire2(link)
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
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   download: true
}