const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
  try {
    let newsSources = [
      'https://aemt.me/cnn',
      'https://aemt.me/liputan6',
      'https://aemt.me/kompas',
      'https://aemt.me/cnbindonesia'
    ];

    let promises = newsSources.map(async (source) => {
      let res = await fetch(source);
      return res.json();
    });

    let responses = await Promise.all(promises);

    let replyText = "Berikut adalah 10 berita terbaru:\n\n";

    responses.forEach((data, index) => {
      if (data.result) {
        for (let i = 0; i < 10 && i < data.result.length; i++) {
          let article = data.result[i];
          let { link, thumb, judul } = article;

          // Constructing the reply text with article titles and links
          replyText += `${index + 1}.${i + 1}.  ${judul}\nLink: ${link}\n\n`;
        }
      }
    });

    // Sending the reply to the chat
    conn.reply(m.chat, replyText, m);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle errors accordingly
    conn.reply(m.chat, 'Maaf, terjadi kesalahan dalam mengambil data.', m);
  }
};

handler.help = ['news']; // Anda mungkin ingin memperbarui teks bantuan sesuai
handler.tags = ['info']; // Anda mungkin ingin memperbarui tag sesuai
handler.command = /^(news)$/i; // Anda mungkin ingin memperbarui regex perintah sesuai
handler.limit = false;
handler.admin = false;
handler.fail = null;

module.exports = handler;
