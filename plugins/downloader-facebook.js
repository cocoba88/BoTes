const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {  
    if (!args[0]) throw `Gunakan contoh ${usedPrefix}${command} https://fb.watch/mcx9K6cb6t/?mibextid=8103lRmnirLUhozF`;
    try {
        const url = `https://fb-video-reels.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(args[0])}&filename=MaganG`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'eec836627dmsh1f5ef7f852cc725p17953djsnae472d927df7',
                'X-RapidAPI-Host': 'fb-video-reels.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const json = await response.json();

        if (!json.success) {
            throw json.message || 'Gagal mengambil URL video dari tautan yang diberikan';
        }

        const { links } = json;
        if (!Array.isArray(links) || links.length === 0) {
            throw 'Tidak dapat menemukan URL video yang sesuai dari tautan yang diberikan';
        }

        // Mengambil URL kualitas HD jika tersedia
        const hdLink = links.find(link => link.quality === 'sd');
        const videoLink = hdLink ? hdLink.link : links[0].link;

        // Mengirimkan video ke pengguna
        await conn.sendFile(m.chat, videoLink, 'MaganG.mp4', '', m);
    } catch (error) {
        console.error(error);
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
