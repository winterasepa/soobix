const { tiktok, tiktok2 } = require('./../../../scrape/tiktok')
exports.run = {
   regex: /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/,
   async: async (m, {
      client,
      body,
      users,
      setting,
      prefixes
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => Func.ttFixed(v).match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
               }
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('tiktok', m.sender)
               links.map(async link => {
                  let json = await tiktok(Func.ttFixed(link))
                  let caption = `⦿ *Tiktok - Download*\n\n`

         caption += `	◦  *Sound* : ${json.title_audio}\n`

         caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`

         caption += global.footer
         client.sendMessage(m.chat, { video: { url: json.video[0] }, caption: caption }, { quoted: m })
                  //if (!json.status) return client.reply(m.chat, global.status.fail, m)
       /*client.sendButton(m.chat, json.video[0], caption, ``, m, [{
                     buttonId: `${prefixes[0]}tikmp3 ${link}`,
                     buttonText: {
                        displayText: 'Backsound'
                     },
                     type: 1
                  }])*/
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