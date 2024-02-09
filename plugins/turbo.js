const axios = require('axios');
const fetch = require('node-fetch');

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Tutorial Mendapatkan Janda Pirang `;

    try {
        // Sending a random emoji and message
        conn.sendMessage(m.chat, {
            react: {
                text: `${pickRandom(['🗿', '🦍', '🦝', '☢️', '⚠', '🙈', '🔞', '🚭', '❌', '🐤', '🗿', '🐦', '🤨', '❎', '😐', '👆', '🖤', '🧑‍🧑‍🧒', '☠'])}`,
                key: m.key,
            }
        });

        // Sending a predefined message
        m.reply(
            `${pickRandom([
                'Ganggu Aja, Lagi Enak Nidurin Janda!',
                'Bentar, Lagi Ada Misi Menyelamatkan Dunia Dari Serangan Alien',
                'Lagi Enaknya Coli, Eh Ketahuan..',
                'Ganggu Lagi Boker Aja Lu!',
                'Nah Ini, Aku Tanyain Dulu Sama Sepuh',
                'Saya Juga Bingung',
                'Lagi Males Mikir...',
                'Bentar, Lagi Betulin Genteng!',
                'Bentar, Lagi Nyunatin Monyet!',
                'Pinjam Dulu Seratus',
                'Bentar, Aku Lagi Cari Tahu Dulu, Mana Yang Lebih Penting, Permintaanmu Atau Tidurku.',
                'Berisik!',
                'Belajar terus, pintar kagak!',
                'Bentar Ya, Aku Lagi Ada Panggilan Darurat Dari Lumba-Lumba. Harus Segera Diselamatkan.',
                'Lagi Ngelamun Jadi Jutawan. Eh, Malah Diganggu.',
                'Aku Lagi Sibuk Jadi Pawang Naga.',
                'Baik Aku Mengerti, Tapi Aku Nggak Bisa Ngirimnya Sekarang. Aku Lagi Diselidiki Polisi.',
                'Aku Lagi Diutus Oleh Presiden Untuk Menyelesaikan Krisis Di Ukraina',
                'Aku Sudah Bosan Disuruh Terus!',
                'Nanti Aku Fotoin Ya.',
                'Aku Nggak Ada Kuota Internet',
                'Saya menjawab pertanyaan ini karena saya tidak punya pekerjaan lain.',
                'Lihat dia kawan, Betapa bodohnya dia sampai tidak mengerti.',
                'Siap, puh!',
                'Saya tahu jawaban itu karena saya baru saja bertanya kepada Google.',
                'saya tidak peduli, karena itu bukan urusanku',
                'Maaf saya sedang dihipnotis',
                'Akan kubantu, sampai kamu mendapatkan penghargaan Nobel.',
                'Lagi banyak masalah ya?',
                'Aku Lagi Di Pantai. Nanti Aku Kirim Pas Aku Udah Pulang, Ya.'
            ])}`
        );

        // Adding a delay of 90 seconds
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Define an array of video URLs
        const videoUrls = [
             'https://telegra.ph/file/2f16d744fb4dca4aa9338.mp4',
			'https://telegra.ph/file/8c032faf28e60ba7649a3.mp4',
			'https://telegra.ph/file/969270b2982ddbb6af978.mp4',
			'https://aemt.me/file/aIhMVcQjtDdB.mp4',
			'https://aemt.me/file/7fX4RXx86iWv.mp4',
			'https://aemt.me/file/eEGf1JrFUnLY.mp4'
        ];

        // Randomly select a video URL
        const selectedVideoUrl = pickRandom(videoUrls);

        // Making a request to GPT-4 API
        const gpt4Options = {
            method: 'GET',
            url: `https://aemt.me/v2/turbo?text=${encodeURIComponent(text)}`,
            headers: {
                'accept': 'application/json'
            }
        };

        const gpt4Response = await axios.request(gpt4Options);

        if (gpt4Response.data.status && gpt4Response.data.result) {
            // Sending the GPT-4 generated response along with the randomly selected video
            conn.sendMessage(m.chat, {
                video: {
                    url: selectedVideoUrl
                },
                gifPlayback: true,
                caption: gpt4Response.data.result
            }, { quoted: m });
        } else {
            m.reply("Error getting response from GPT-4 API.");
        }
    } catch (error) {
        console.error(error);
        m.reply(`Error processing the command: ${error.message}`);
    }
};

handler.command = handler.help = ['turbo', 'openaix', 'chtx'];
handler.tags = ['tools'];
handler.premium = false;
module.exports = handler;
