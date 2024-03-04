const fetch = require('node-fetch');

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://example.com`
    if (!args[0].match(/^https?:\/\/[^\s/$.?#].[^\s]*$/gi)) throw "URL tidak valid!";
    m.reply('Mohon tunggu sebentar...');
    const url = 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'eec836627dmsh1f5ef7f852cc725p17953djsnae472d927df7',
            'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
        },
        body: JSON.stringify({
            url: args[0]
        })
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.error) throw "Terjadi kesalahan saat memproses URL";
        if (result.medias && result.medias.length > 0) {
            for (let media of result.medias) {
                if (media.type === 'video' || media.type === 'audio') {
                    conn.sendFile(m.chat, media.url, null, '', m); // Mengirim file tanpa pesan tambahan
                }
            }
        } else {
            throw "Tidak ada media yang dapat diunduh dari URL ini";
        }
    } catch (error) {
        throw `Terjadi kesalahan saat mengunduh media: ${error}`;
    }
};

handler.command = handler.help = ['dl', 'dla', 'adl', 'idm'];
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
