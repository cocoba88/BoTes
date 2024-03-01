const { instagramdl } = require('@bochilteam/scraper');
const fetch = require('node-fetch');

const handler = async (m, { args, conn, usedPrefix, command }) => {
    if (!args[0]) throw `Ex:\n${usedPrefix}${command} https://www.instagram.com/reel/C0EEgMNSSHw/?igshid=MzY1NDJmNzMyNQ==`;

    m.reply('Sedang mengunduh video...')
    
    try {
        let res = await instagramdl(args[0]); // Menggunakan instagramdl langsung
        console.log(res); // Tampilkan respon di terminal untuk debugging
        let media = await res[0].url;
      
        const sender = m.sender.split(`@`)[0];

        if (!res) throw 'Can\'t download the post';
      
        await conn.sendMessage(m.chat, { video: { url: media }, caption: `ini kak videonya @${sender}`, mentions: [m.sender]}, m);

    } catch (e) {
        console.error(e); // Menampilkan detail kesalahan di terminal
        conn.reply(m.chat, 'Gagal mengunduh video', m);
    }
};

handler.help = ['instagram2'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(ig2|instagram2|igdl2|instagramdl2|igstroy2)$/i;
handler.limit = false;

module.exports = handler;
