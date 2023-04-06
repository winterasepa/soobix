const { ytVideo } = require('./../../../scrape/alldownload')
exports.run = {
   regex: /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/,
   async: async (m, {
      client,
      body,
      users,
      setting,
      prefixes
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Func.texted('bold', `⚠️ Your limit is not enough to use this feature.`), m)
               }
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('yt', m.sender)
               links.map(async link => {
               const json = await ytVideo(link);
               let caption = `⦿ *Y T - M P 4*\n\n`
               caption += `	◦  *Title* : ${json.title}\n`
               caption += `	◦  *Duration* : ${json.duration}\n\n`
               caption += global.footer;
               client.sendFile(m.chat, json.link, Func.filename('mp4'), caption, m)
})
}                                    
         }
      } catch (err) {
         console.log(err)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   limit: true,
   download: true
}
