const fetch = require("node-fetch");

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) throw `Masukkan URL!\n\ncontoh:\n${usedPrefix + command} https://twitter.com/gofoodindonesia/status/1229369819511709697`;
    if (!args[0].match(/https?:\/\/(www\.)?(twitter\.com|x\.com)/gi)) throw "URL Tidak Ditemukan!";
    m.reply(wait);
    try {
        const api = await fetch(`https://api.betabotz.eu.org/api/download/twitter2?url=${args[0]}&apikey=${lann}`);
        const res = await api.json();
        const mediaURLs = res.result.mediaURLs;

        for (const url of mediaURLs) {
            const response = await fetch(url);
            const buffer = await response.buffer();  
            await delay(3000)//3 detik jeda agar tidak spam        
            conn.sendFile(m.chat, buffer, null, '', m); // Tidak ada caption yang ditampilkan
        }
    } catch (e) {
        throw '*Server Down!*';
    }
};

handler.command = handler.help = ['twitter', 'twitdl', 'tw'];
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
