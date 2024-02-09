const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
  try {
    let res = await fetch('https://aemt.me/cnn');
    let data = await res.json();
    
    let replyText = "Berikut adalah 10 berita terbaru:\n\n";
    
    // Assuming the response structure is consistent
    for (let i = 0; i < 10 && i < data.result.length; i++) {
      let article = data.result[i];
      let { link, thumb, judul } = article;
      
      // Constructing the reply text with article titles and links
      replyText += `${i + 1}. Judul: ${judul}\nLink: ${link}\n\n`;
    }
    
    // Sending the reply to the chat
    conn.reply(m.chat, replyText, m);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle errors accordingly
    conn.reply(m.chat, 'Maaf, terjadi kesalahan dalam mengambil data.', m);
  }
};

handler.help = ['news']; // You might want to update the help text accordingly
handler.tags = ['info']; // You might want to update the tags accordingly
handler.command = /^(news)$/i; // You might want to update the command regex accordingly
handler.limit = false;
handler.admin = false;
handler.fail = null;

module.exports = handler;
