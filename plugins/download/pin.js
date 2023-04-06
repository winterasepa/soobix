const { pindl } = require('./../../scrape/pinterest')
exports.run = {
   usage: ['pindl'],
   hidden: ['pin'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://pin.it/5fXaAWE'), m)
         if (!args[0].match(/pin(?:terest)?(?:\.it|\.com)/)) return client.reply(m.chat, global.status.invalid, m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let json = await pindl(args[0])
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
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}