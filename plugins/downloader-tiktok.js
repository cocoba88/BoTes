const https = require('https');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vm.tiktok.com/ZGJAmhSrp/`;
    }
    try {
        if (!args[0].match(/tiktok/gi)) {
            throw `URL Tidak Ditemukan!`;
        }
        m.reply('*Mohon tunggu..*');
        const api = await https.get(`https://aemt.me/download/tiktokdl?url=${encodeURIComponent(args[0])}`, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', async () => {
                const res = JSON.parse(data);
                if (res.status && res.result.status) {
                    const { video, title } = res.result;
                    await conn.sendFile(m.chat, video, null, `${title}`, m);
                } else {
                    throw `Gagal mengunduh video TikTok.`;
                }
            });
        }).on('error', error => {
            console.log(error);
            throw error.message;
        });
    } catch (e) {
        console.log(e);
        throw `Terjadi Kesalahan!`;
    }
};

handler.help = ['tiktok'];
handler.command = /^(tiktok|tt|tiktokdl|tiktoknowm)$/i;
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
