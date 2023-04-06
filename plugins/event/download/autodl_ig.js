const { igdl } = require('./../../../scrape/alldownload')
exports.run = {
   regex: /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/,
   async: async (m, {
      client,
      body,
      users,
      setting
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => Func.igFixed(v).match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
               }
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('ig', m.sender)
               links.map(async link => {
               let json = await igdl(Func.igFixed(link))
               let caption = `⦿  *INSTAGRAM - DOWNLOAD*\n\n`
         caption += `	◦  *Title* : ${json.title}\n`
         caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         caption += global.footer
         client.reply(m.chat, caption, m)
for (let i of json.url) {
            client.sendFile(m.chat, i, '', '', m)
}
               })
               }
               }
      } catch (e) {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   limit: true,
   download: true
}