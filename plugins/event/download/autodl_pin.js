const { pindl } = require('./../../../scrape/pinterest')
exports.run = {
   regex: /pin(?:terest)?(?:\.it|\.com)/,
   async: async (m, {
      client,
      body,
      users,
      setting
   }) => {
      try {
         const regex = /pin(?:terest)?(?:\.it|\.com)/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Func.texted('bold', `� Your limit is not enough to use this feature.`), m)
               }
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('pin', m.sender)
               links.map(async link => {
               let json = await pindl(link)
         let caption = `⦿  *Pinterest - Download*\n\n`
         caption += `	◦  *Full Name* : ${json.full_name}\n`
         caption += `	◦  *User Name* : ${json.user_name}\n`
         caption += `	◦  *Followers* : ${json.followers}\n`
         caption += `	◦  *Comment* : ${json.comments}\n`
         caption += `	◦  *Share* : ${json.share}\n`
         caption += `	◦  *Save* : ${json.save}\n`
         caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         caption += global.footer
         //if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         if (/image|video/.test(json.pin_data[0].type)) return client.sendFile(m.chat, json.pin_data[0].url, '', caption, m)
                  if (json.pin_data.type == 'gif') return client.sendFile(m.chat, json.pin_data[0].url, '', caption, m, {
                     gif: true
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
