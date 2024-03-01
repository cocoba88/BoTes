const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');

const unlinkAsync = promisify(fs.unlink);

async function postTo9xBuddy(url) {
    console.log("Posting URL to 9xBuddy:", url);
    
    return axios.post('https://9xbuddy.in/process?url=' + encodeURIComponent(url))
        .then(async function (response) {
            // Response yang diterima dari 9xBuddy adalah HTML, jadi kita perlu memanipulasi DOM untuk mendapatkan URL unduhan
            const downloadUrl = extractDownloadUrl(response.data);
            return downloadUrl;
        });
}

function extractDownloadUrl(html) {
    // Manipulasi DOM untuk mendapatkan URL unduhan
    const regex = /"hreff":"(.*?)"/g;
    const match = regex.exec(html);
    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error("Tidak dapat menemukan URL unduhan.");
    }
}

async function downloadFile(url, destination) {
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(destination);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function sendFileToUser(m, filePath) {
    // Lakukan proses pengiriman file ke pengguna di sini (misalnya menggunakan WhatsApp, Telegram, dll.)
}

async function handleDownloadRequest(m, { text, usedPrefix, command }) {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://doods.pro/e/gabqlk2otto0`;
    m.reply("Tunggu sebentar, sedang di proses...");
    try {
        let match = text.match(/https:\/\/doods\.pro\/e\/([A-Za-z0-9_-]+)/);
        if (!match) throw new Error("Format URL tidak valid.");

        let url = match[0];

        let downloadUrl;
        try {
            downloadUrl = await postTo9xBuddy(url);
        } catch (error) {
            console.error("Gagal mengirim URL ke 9xBuddy:", error);
            throw new Error("Gagal mengirim URL ke 9xBuddy");
        }

        const tmpFolder = './tmp/';
        const fileName = 'downloaded_file.mp4'; // Ubah nama file sesuai kebutuhan
        const destination = resolve(tmpFolder, fileName);

        await downloadFile(downloadUrl, destination);

        // Kirim file jika ukuran kurang dari atau sama dengan 99Mb
        const stats = fs.statSync(destination);
        const fileSizeInBytes = stats.size;
        const fileSizeInMb = fileSizeInBytes / (1024 * 1024);
        if (fileSizeInMb <= 99) {
            await sendFileToUser(m, destination);
            await unlinkAsync(destination); // Hapus file setelah dikirim
        } else {
            throw new Error("Ukuran file melebihi 99Mb, tidak dapat dikirim.");
        }
    } catch (e) {
        console.error(e);
        throw new Error(`Error: ${e.message}`);
    }
}

// Export handler
handleDownloadRequest.command = handleDownloadRequest.help = ['sore'];
handleDownloadRequest.tags = ['downloader'];
handleDownloadRequest.limit = false;
module.exports = handleDownloadRequest;
