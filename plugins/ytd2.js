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
    const apiUrl = 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=' + encodeURIComponent(args[0]) + '&filename=Test%20video';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'eec836627dmsh1f5ef7f852cc725p17953djsnae472d927df7',
            'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(apiUrl, options);
        const result = await response.json();
        if (!result.links || result.links.length === 0) throw "Video tidak ditemukan atau terjadi kesalahan saat mengunduh.";
        
        // Mengirimkan video dengan kualitas sd_360p sebagai mime type buffering
        const downloadLink = result.links.find(link => link.quality === 'sd_360p');
        if (!downloadLink) throw "Kualitas video tidak tersedia.";
        
        conn.sendFile(m.chat, downloadLink.link, 'video.mp4', '', m, false, {
            mimetype: 'video/mp4',
            quoted: m
        });
    } catch (error) {
        throw `Terjadi kesalahan: ${error}`;
    }
};

handler.command = handler.help = ['ytd2'];
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
