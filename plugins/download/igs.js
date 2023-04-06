exports.run = {
   usage: ['igs'],
   hidden: ['igstory'],
   use: 'username',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'mobilelegendsfyi'), m)
         if (text.match('instagram.com')) return client.reply(m.chat, `*❌ Use a username, for example*\n\n${(isPrefix ? isPrefix : '') + command} mobilelegendsfyi`, m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let json = await Api.igstory(args[0])
        if(json.result.data.length > 10) return  client.reply(m.chat, Func.texted('bold', `Sorry too many media files, max 10`), m)
         for (let i = 0; i < json.result.data.length; i++) {
           client.sendFile(m.chat, json.result.data[i].url, ``, ``, m)
          await Func.delay(1500)
         }
         client.reply(m.chat, Func.texted('bold', `✅ Successfully downloaded all stories from ${json.result.username}`), m)
      } catch {
        let json = await Func.fetchJson(`https://api.lolhuman.xyz/api/igstory/${args[0]}?apikey=c9b3628121d4a8adfbff2e11`);
for (let i = 0; i < json.result.length; i++) {
           client.sendFile(m.chat, json.result[i], ``, ``, m)
          await Func.delay(1500)
         }
         client.reply(m.chat, Func.texted('bold', `✅ Successfully downloaded all stories`), m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}