🚀 @viertechjs/baileys

<p align="center">
  <b>Modified Baileys for modern WhatsApp Bot development</b>
</p><p align="center">
  Dikembangkan dan dimodifikasi oleh <b>Harta Javier</b> — VierTech Solutions
</p><p align="center">
  <a href="https://github.com/aa-javier/viertech-baileys">
    <img src="https://img.shields.io/badge/GitHub-viertech--baileys-black?logo=github">
  </a>
  <a href="https://www.npmjs.com/package/@viertechjs/baileys">
    <img src="https://img.shields.io/badge/npm-%40viertechjs%2Fbaileys-red?logo=npm">
  </a>
  <a href="https://api.viertechsolutions.com">
    <img src="https://img.shields.io/badge/VierTech-REST%20API-blue">
  </a>
  <img src="https://img.shields.io/badge/License-MIT-green">
</p>---

📖 Tentang

"@viertechjs/baileys" adalah versi modifikasi dan pengembangan dari project open-source Baileys yang dikembangkan oleh "WhiskeySockets" (https://github.com/WhiskeySockets/Baileys).

Fork ini dikembangkan dan dimodifikasi lebih lanjut oleh Harta Javier untuk kebutuhan pengembangan WhatsApp Bot dengan menambahkan berbagai fungsi tambahan, helper, penyederhanaan implementasi, serta fitur yang tidak tersedia secara langsung pada Baileys upstream.

Project ini tetap mempertahankan kompatibilitas dengan API utama Baileys seperti:

- "makeWASocket"
- Multi Device authentication
- Message handling
- Group management
- Newsletter / Channel
- Media messages
- Poll messages
- Event system
- Connection management
- dan fitur bawaan Baileys lainnya

Tujuan utama project ini adalah memberikan Baileys yang lebih praktis untuk digunakan pada project WhatsApp Bot modern tanpa menghilangkan fleksibilitas dari library aslinya.

---

✨ Fitur Tambahan VierTech

Fitur| Keterangan
🃏 Sticker Pack| Helper untuk membuat dan mengirim WhatsApp Sticker Pack
📊 Polling Helper| Helper decrypt dan pengolahan vote polling
🐺 Werewolf Support| Poll helper yang dapat digunakan pada sistem voting Werewolf
🔫 Mafia Support| Poll helper untuk voting game Mafia
🎮 PG / Quiz Support| Poll helper untuk game pilihan ganda
🃏 UNO Support| Sticker Pack digunakan untuk pengiriman kartu UNO
🔐 JID Candidate Handling| Mendukung PN JID, LID dan Device JID
⚡ Extended WASocket| Beberapa helper tersedia langsung melalui instance socket

Fitur tambahan lainnya akan terus dikembangkan pada versi berikutnya.

---

🃏 Sticker Pack

"@viertechjs/baileys" menyediakan fungsi tambahan untuk mengirim WhatsApp Sticker Pack secara langsung.

Fitur ini salah satunya digunakan pada sistem game UNO, sehingga beberapa kartu dapat dikirim sebagai satu Sticker Pack.

Menggunakan WASocket

await sock.sendStickerPack(jid, {
  name: 'UNO Cards',
  publisher: 'VierTech Solutions',
  description: 'UNO Game Sticker Pack',

  cover: coverBuffer,

  stickers: [
    {
      buffer: sticker1,
      emojis: ['🟥']
    },
    {
      buffer: sticker2,
      emojis: ['🟦']
    },
    {
      buffer: sticker3,
      emojis: ['🟨']
    }
  ]
})

Menggunakan Helper

import {
  sendStickerPack
} from '@viertechjs/baileys'

Contoh:

await sendStickerPack(sock, jid, {
  name: 'VierTech Sticker Pack',
  publisher: 'VierTech Solutions',
  stickers
})

---

📊 Polling Helper

Versi VierTech menambahkan helper untuk menangani proses decrypt terhadap vote polling WhatsApp.

Pada implementasi bot yang kompleks, polling dapat menggunakan beberapa jenis identifier berbeda.

Helper ini dapat menangani kandidat seperti:

PN JID
LID
Device JID
Poll Creator JID
Voter JID
Poll Message ID

Hal ini mengurangi kebutuhan untuk menulis ulang loop decrypt polling pada setiap plugin game.

Import

import {
  decryptPollVoteWithCandidates,
  getPollMessageSecret,
  getAggregateVotesInPollMessage
} from '@viertechjs/baileys'

Contoh

const messageSecret = getPollMessageSecret(pollMessage)

const result = decryptPollVoteWithCandidates(
  pollUpdate.vote,
  {
    pollEncKey: messageSecret,

    pollCreatorJids: creatorCandidates,

    pollMsgIds: pollIdCandidates,

    voterJids: voterCandidates
  }
)

if (result) {
  console.log('Voter:', result.voterJid)
  console.log('Vote:', result.vote.selectedOptions)
}

---

🎮 Penggunaan Polling pada Game

Polling helper pada fork ini dikembangkan untuk mempermudah sistem game WhatsApp Bot.

Saat ini dapat digunakan untuk:

📚 PG / Pilihan Ganda

Digunakan untuk membaca jawaban pemain melalui polling WhatsApp.

🐺 Werewolf

Digunakan pada proses voting pemain seperti eliminasi dan mekanisme voting lainnya.

🔫 Mafia

Digunakan untuk sistem voting pada permainan Mafia.

Dengan helper bawaan library, logic decrypt polling tidak perlu lagi ditulis berulang kali di setiap plugin game.

---

📦 Installation

NPM

npm install @viertechjs/baileys

Yarn

yarn add @viertechjs/baileys

GitHub

Versi terbaru juga dapat di-install langsung dari repository:

npm install github:aa-javier/viertech-baileys

atau:

yarn add github:aa-javier/viertech-baileys

---

🚀 Quick Start

import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@viertechjs/baileys'

const { state, saveCreds } = await useMultiFileAuthState('./session')

const sock = makeWASocket({
  auth: state,

  printQRInTerminal: true
})

sock.ev.on('creds.update', saveCreds)

sock.ev.on('connection.update', update => {
  console.log(update)
})

---

🌐 VierTech REST API

Selain pengembangan library Baileys, VierTech juga menyediakan REST API yang dapat digunakan untuk berbagai kebutuhan WhatsApp Bot dan aplikasi lainnya.

VierTech Solutions REST API

https://api.viertechsolutions.com

REST API VierTech menyediakan berbagai kategori endpoint seperti:

- Downloader
- AI
- Sticker
- Search
- Games
- Tools
- Media utilities
- dan berbagai endpoint lainnya

Baileys dan VierTech REST API dapat digunakan bersama untuk membangun WhatsApp Bot dengan struktur yang lebih sederhana.

Contoh arsitektur:

WhatsApp
   │
   ▼
@viertechjs/baileys
   │
   ▼
WhatsApp Bot
   │
   ├── VierTech REST API
   │
   ├── Games
   │
   ├── Downloader
   │
   ├── AI
   │
   └── Sticker

---

🔗 Links

Project| Link
🚀 VierTech Baileys| https://github.com/aa-javier/viertech-baileys
🌐 VierTech REST API| https://api.viertechsolutions.com
📦 NPM| https://www.npmjs.com/package/@viertechjs/baileys
🥃 Baileys Upstream| https://github.com/WhiskeySockets/Baileys

---

👨‍💻 Developer

Harta Javier

Developer dan maintainer dari "@viertechjs/baileys".

Project ini dikembangkan sebagai bagian dari ekosistem VierTech Solutions.

📧 Email

"aajavie834@gmail.com" (mailto:aajavie834@gmail.com)

🌐 REST API

https://api.viertechsolutions.com

💻 GitHub

https://github.com/aa-javier

---

🛠️ Development

Project ini akan terus dikembangkan dengan fokus pada:

- peningkatan kompatibilitas WhatsApp terbaru;
- penambahan helper baru;
- penyederhanaan fungsi WhatsApp Bot;
- sistem polling yang lebih stabil;
- peningkatan Sticker Pack;
- helper game;
- dukungan fitur WhatsApp terbaru;
- integrasi dengan VierTech REST API;
- optimasi WASocket;
- dan fitur tambahan lainnya.

---

🤝 Upstream

Project ini merupakan fork dan modifikasi dari:

WhiskeySockets / Baileys

https://github.com/WhiskeySockets/Baileys

Sebagian besar core protocol dan implementasi WhatsApp berasal dari Baileys upstream.

VierTech melakukan pengembangan dan modifikasi tambahan tanpa menghilangkan atribusi kepada project original.

---

⚠️ Disclaimer

Project ini tidak berafiliasi, disponsori, didukung, maupun terhubung secara resmi dengan WhatsApp atau Meta.

WhatsApp merupakan merek dagang dari pemiliknya masing-masing.

Penggunaan library ini sepenuhnya menjadi tanggung jawab pengguna.

---

📜 License

Project ini menggunakan lisensi MIT sesuai dengan lisensi yang disertakan dalam repository.

Copyright dan atribusi terhadap project upstream tetap dipertahankan.

---

<p align="center">
  <b>@viertechjs/baileys</b>
</p><p align="center">
  Developed & Modified with ❤️ by <b>Harta Javier</b>
</p><p align="center">
  <b>VierTech Solutions</b>
</p>
