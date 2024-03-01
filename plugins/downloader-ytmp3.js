const fetch = require('node-fetch');

let handler = async (m, {conn, text, usedPrefix}) => {
  if (!text) throw 'Berikan URL dari YouTube!'
  try {
    const apiUrl = `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/?url=${encodeURIComponent(text)}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'eec836627dmsh1f5ef7f852cc725p17953djsnae472d927df7',
        'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
      }
    };

    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      throw new Error(`Terjadi kesalahan saat mengambil data dari API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.link) {
      throw new Error('URL audio tidak ditemukan dalam respons API');
    }

    const audioUrl = data.link;

    // Kirim audio ke pengguna
    await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m });  
  } catch (e) {
    console.error('Kesalahan:', e);
    throw 'Terjadi kesalahan dalam mengunduh video/audio: ' + e; // Menambahkan pesan kesalahan detail
  }
}
handler.command = handler.help = ['ytmp3'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = false;
handler.premium = false;
module.exports = handler;
