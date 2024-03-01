const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Function to fetch information from Terabox based on URL
async function fetchInfo(shortUrl, pwd = '') {
    console.log("Fetching info for URL:", shortUrl); // Log fetching info
    return fetch(`https://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl=${shortUrl}&pwd=${pwd}`)
        .then(async function (res) {
            const body = await res.text();
            const $ = cheerio.load(body);

            const fileInfo = [];

            $('.tree-view .file').each((index, element) => {
                const fileName = $(element).find('.file-name').text().trim();
                const fileSize = $(element).find('.file-size').text().trim();
                const downloadButton = $(element).find('.file-download');
                const downloadUrl = downloadButton.attr('onclick').match(/'(.*?)'/)[1];
                
                fileInfo.push({
                    isDir: false,
                    name: fileName,
                    category: false,
                    size: fileSize,
                    url: downloadUrl
                });
            });

            return fileInfo;
        });
}

// Plugin handler
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `*Example:* ${usedPrefix + command} https://teraboxapp.com/s/1JgKwsrv2O4bGqUQ09O6y4w`;
    m.reply("Tunggu sebentar, sedang di proses...");   
    try {     
        let match = text.match(/https:\/\/teraboxapp\.com\/s\/([A-Za-z0-9_-]+)/);
        if (!match) throw new Error("Invalid URL format.");

        let shortUrl = match[1];
        let pwd = ''; // Optional, you can extract password from the text if needed.

        let info;
        try {
            info = await fetchInfo(shortUrl, pwd);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            throw new Error("Failed to fetch data");
        }

        console.log("Fetched info:", info); // Log fetched info

        let videoUrls = info.filter(file => !file.isDir && file.url); // Filter only non-directory files with available URL
        if (videoUrls.length > 0) {
            for (let i = 0; i < videoUrls.length; i++) {
                let file = videoUrls[i];
                await m.reply(`*Name:* ${file.name}\n*Size:* ${file.size}\n*URL:* ${file.url}`);
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
