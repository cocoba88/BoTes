const puppeteer = require('puppeteer-core');

async function generateDownloadLink(url) {
    const browser = await puppeteer.launch({
        executablePath: '/home/container/.cache/puppeteer/chrome/linux-122.0.6261.57/chrome-linux64/chrome', // Sesuaikan dengan path Chrome di server Anda
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Opsi tambahan
    });
    const page = await browser.newPage();

    // Set user agent to mimic browser behavior
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');

    // Navigate to the 9xbuddy page
    await page.goto('https://9xbuddy.in/');

    // Input the URL in the textbox and click download
    await page.type('input[name="url"]', url);
    await page.click('button[type="submit"]');

    // Wait for the redirect and the generate link to appear
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('a[href^="https://pr"][href*=".9xbud.com/down/"]');

    // Get the download link
    const downloadLink = await page.evaluate(() => {
        return document.querySelector('a[href^="https://pr"][href*=".9xbud.com/down/"]').href;
    });

    await browser.close();

    return downloadLink;
}

// Example function to handle download request
async function handleDownloadRequest(m, { text, usedPrefix, command }) {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://doods.pro/e/gabqlk2otto0`;
    m.reply("Tunggu sebentar, sedang di proses...");
    try {
        let match = text.match(/https?:\/\/doods\.pro\/[ed]\/([A-Za-z0-9_-]+)/);
        if (!match) throw new Error("Format URL tidak valid.");
        
        const downloadLink = await generateDownloadLink(text);
        m.reply(`Berikut adalah link untuk mengunduh: ${downloadLink}`);
    } catch (e) {
        console.error(e); // Log error detail
        throw new Error(`Error: ${e.message}`);
    }
}

handleDownloadRequest.command = handleDownloadRequest.help = ['lolo'];
handleDownloadRequest.tags = ['downloader'];
handleDownloadRequest.limit = false;

module.exports = handleDownloadRequest;
