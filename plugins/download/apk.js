const { fm } = require('./../../scrape/fmmods')
exports.run = {
   usage: ['fm'],
   hidden: ['getapk'],
   category: 'downloader',
   async: async (m, {
      client,
      text,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (command == 'fm') {
         let old = new Date();
         let json = await fm();
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let rows = []
            json.data.map(async (v, i) => {
               rows.push({
                  title: v.package,
                  rowId: `${isPrefix}getapk ${v.url}—${v.title}—⦿  *F M - M O D S*\n\n	◦  *Name* : ${v.title}\n	◦  *Version* : ${v.version}\n	◦  *Package* : ${v.package}\n	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n${global.footer}`,
                  description: `[ ${v.title} | v${v.version} ]`
               })
            })
            client.sendList(m.chat, '', `*The Latest Update from FM MODS*`, '', 'Tap!', [{
               rows
            }], m)
         } else if (command == 'getapk') {          
         let [url, name, capt] = text.split`—`;           
         client.sendReact(m.chat, '🕒', m.key);
         const urll = (url, name, capt) => {      
            client.sendFile(m.chat, url, name, capt, m)
            }
            let json = await urll(url, name, capt);         
               client.sendFile(m.chat, url, json.file.name, capt, m)         
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   restrict: true
}
