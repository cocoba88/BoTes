const uploadFile = require('../lib/uploadFile');
const axios = require('axios');

const handleConvertToPdf = async (conn, m) => {
  try {
    // Memeriksa apakah pesan memiliki attachment
    if (!m.quoted || !m.quoted.fileSha256) {
      throw new Error('Harap balas pesan dengan dokumen yang ingin Anda konversi ke PDF.');
    }

    // Mengunggah file menggunakan library uploadFile
    const fileUrl = await uploadFile(m.quoted.fileSha256);

    // Melakukan konversi ke PDF menggunakan URL yang diunggah
    const pdfData = await convertToPdf(fileUrl);

    // Mengirimkan file PDF yang dihasilkan sebagai balasan
    conn.sendFile(m.chat, pdfData, 'converted.pdf', 'Berikut adalah file PDF yang telah dikonversi dari dokumen yang Anda kirim.');

  } catch (error) {
    console.error('Terjadi kesalahan saat konversi ke PDF:', error);
    console.log(error); // Menampilkan detail error ke konsol
    conn.reply(m.chat, `Terjadi kesalahan saat melakukan konversi ke PDF: ${error.message}`, m);
  }
};

const convertToPdf = async (fileUrl) => {
  const options = {
    method: 'POST',
    url: 'https://pdf4me.p.rapidapi.com/RapidApi/ConvertToPdf',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      'X-RapidAPI-Key': 'eec836627dmsh1f5ef7f852cc725p17953djsnae472d927df7',
      'X-RapidAPI-Host': 'pdf4me.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      fileUrl: fileUrl
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Gagal melakukan konversi:', error);
    console.log(error); // Menampilkan detail error ke konsol
    throw new Error(`Gagal melakukan konversi: ${error.message}`);
  }
};

// Event handler untuk perintah '.topdf'
const handler = async (conn, m) => {
  try {
    // Memeriksa apakah pesan dimulai dengan '.topdf'
    if (m.msg && m.msg.startsWith('.topdf')) {
      // Menangani perintah konversi ke PDF
      await handleConvertToPdf(conn, m);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    console.log(error); // Menampilkan detail error ke konsol
    conn.reply(m.chat, `Terjadi kesalahan: ${error.message}`, m);
  }
};

handler.help = ['topdf'];
handler.tags = ['topdf'];
handler.command = /^topdf/i;

module.exports = handler;
