const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`;

    try {
        const apiUrl = `https://aemt.me/download/igdl?url=${encodeURIComponent(args[0])}`;
        const api = await fetch(apiUrl, { method: 'GET', headers: { 'accept': 'application/json' } });
        const res = await api.json();

        if (res.status && res.result.length > 0) {
            const limitnya = 10; // Jumlah foto yang ingin dikirim ke user (default 10 foto)

            for (let i = 0; i < Math.min(limitnya, res.result.length); i++) {
                await sleep(3000);
                conn.sendFile(m.chat, res.result[i].url, null, `*Instagram Downloader*`, m);
            }
        } else {
            throw `Tidak dapat mengunduh media dari Instagram`;
        }
    } catch (e) {
        console.error(e);
        throw `Terjadi kesalahan pada server`;
    }
};

handler.help = ['instagram'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl|instagramdl|igstroy)$/i;
handler.limit = true;

module.exports = handler;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
