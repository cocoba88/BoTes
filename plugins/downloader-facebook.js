const fetch = require('node-fetch');
let handler = async (m, { conn, args, usedPrefix, command }) => {  
    if (!args[0]) throw `Gunakan contoh ${usedPrefix}${command} https://fb.watch/mcx9K6cb6t/?mibextid=8103lRmnirLUhozF`;
    try {
        const res = await fetch(`https://aemt.me/download/fbdl?url=${encodeURIComponent(args[0])}`);
        const json = await res.json();
        if (!json.status) {
            throw json.error || 'Gagal mengambil URL video dari tautan yang diberikan';
        }
        const { Normal_video, HD, audio } = json.result;
        if (Normal_video) {
            conn.sendFile(m.chat, Normal_video, 'fb.mp4', `*Facebook Downloader*`, m);
        } else if (HD) {
            conn.sendFile(m.chat, HD, 'fb_hd.mp4', `*Facebook Downloader (HD)*`, m);
        } else if (audio) {
            conn.sendFile(m.chat, audio, 'fb_audio.mp4', `*Facebook Downloader (Audio)*`, m);
        } else {
            throw 'Tidak dapat menemukan URL video yang sesuai dari tautan yang diberikan';
        }
    } catch (error) {
        console.log(error);
        throw 'Terjadi kesalahan saat melakukan proses download';
    }
}
handler.help = ['facebook'].map(v => v + ' <url>');
handler.command = /^(fb|facebook|facebookdl|fbdl|fbdown|dlfb)$/i;
handler.tags = ['downloader'];
handler.limit = false;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;
module.exports = handler;
