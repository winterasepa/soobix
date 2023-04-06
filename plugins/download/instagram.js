const { igdl } = require('./../../scrape/alldownload')
exports.run = {
   usage: ['ig'],
   hidden: ['igdl'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://www.instagram.com/p/CK0tLXyAzEI'), m)
         if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return client.reply(m.chat, global.status.invalid, m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let json = await igdl(Func.igFixed(args[0]))
         let caption = `⦿  *INSTAGRAM - DOWNLOAD*\n\n`
         caption += `	◦  *Title* : ${json.title}\n`
         caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         caption += global.footer
client.reply(m.chat, caption, m)
for (let i of json.url) {
            client.sendFile(m.chat, i, '', '', m)
}
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}