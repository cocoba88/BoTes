const whiskeySockets = require('whiskeysockets');

const fetch = require('node-fetch');
const os = require('os');

// Fungsi untuk mengonversi ukuran berkas dari byte ke format yang lebih mudah dibaca
function formatStorageSize(bytes) {
    const KB = 1024
    const MB = KB * 1024
    const GB = MB * 1024

    if (bytes >= GB) {
        const gigabytes = bytes / GB
        return gigabytes.toFixed(2) + "GB"
    } else {
        const megabytes = bytes / MB
        return megabytes.toFixed(2) + "MB"
    }
}

// Fungsi untuk melakukan permintaan unduhan ke Terabox
async function fetchDownload({ shareid, uk, sign, timestamp, fs_id }) {
    console.log("Fetching download content for fs_id:", fs_id); // Log download action
    const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36`;
    const headers = {
        'User-Agent': userAgent,
        'Host': 'terabox-dl.qtcloud.workers.dev',
        'Referer': 'https://terabox-dl.qtcloud.workers.dev/',
        'Accept': 'video/*',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    };
    const response = await fetch("https://terabox-dl.qtcloud.workers.dev/api/get-download", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ shareid, uk, sign, timestamp, fs_id }),
    });
    if (!response.ok) throw new Error(`Failed to fetch download content: ${response.status} ${response.statusText}`);
    const buffer = await response.buffer();
    return buffer;
}

// Fungsi untuk mengambil informasi dari Terabox berdasarkan URL
async function fetchInfo(shortUrl, pwd = '') {
    console.log("Fetching info for URL:", shortUrl); // Log fetching info
    return fetch(`https://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl=${shortUrl}&pwd=${pwd}`).then(async function (res) {
        const body = await res.json()

        if (!body.ok) throw new Error(body.message)

        return body.list.map((item) => ({
            isDir: item.is_dir != 0,
            name: item.filename,
            category: item.is_dir != 0 || parseInt(item.category),
            size: item.is_dir != 0 || formatStorageSize(parseInt(item.size)),
            downloadAction:
                item.is_dir != 0 ||
                async function () {
                    const buffer = await fetchDownload({
                        shareid: body.shareid,
                        uk: body.uk,
                        sign: body.sign,
                        timestamp: body.timestamp,
                        fs_id: item.fs_id,
                    });
                    return buffer;
                },
        }))
    })
}

// Handler untuk plugin
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `*Example:* ${usedPrefix + command} https://teraboxapp.com/s/1JgKwsrv2O4bGqUQ09O6y4w`;
    m.reply("Tunggu sebentar, sedang di proses...");   
    try {     
        let match = text.match(/https:\/\/teraboxapp\.com\/s\/([A-Za-z0-9_-]+)/);
        if (!match) throw new Error("Invalid URL format.");

        let shortUrl = match[1];
        let pwd = ''; // Opsional, Anda bisa mengekstrak kata sandi dari teks jika diperlukan.

        let info = await fetchInfo(shortUrl, pwd);
        console.log("Fetched info:", info); // Log fetched info

        // Periksa apakah ada beberapa video
        if (info.length > 0) {
            for (let i = 0; i < info.length; i++) {
                let file = info[i];
                let buffer = await file.downloadAction();
                whiskeySockets.sendFile(m.chat, { file: buffer, mimetype: 'video/mp4' });
            }
        } else {
            throw new Error("No videos found in the response.");
        }
    } catch (e) {     
        console.error(e); // Log error detail
        throw new Error(`Error: ${e.message}`);
    }
}

handler.command = handler.help = ['siro'];
handler.tags = ['downloader'];
handler.limit = false;
module.exports = handler;
