@viertechjs/baileys

"@viertechjs/baileys" adalah versi modifikasi dan pengembangan dari Baileys milik "WhiskeySockets" (https://github.com/WhiskeySockets/Baileys).

Project ini dikembangkan dan dimodifikasi lebih lanjut oleh Harta Javier untuk menambahkan berbagai fungsi tambahan, helper, dan penyesuaian yang dibutuhkan dalam pengembangan WhatsApp Bot berbasis Baileys.

Repository:

GitHub: "aa-javier/viertech-baileys"

Tentang Project

Project ini tetap mempertahankan sebagian besar struktur dan kompatibilitas API dari Baileys original, sehingga penggunaan dasar seperti "makeWASocket", event, message handling, authentication, group management, dan fitur bawaan Baileys tetap dapat digunakan.

Selain fitur bawaan tersebut, "@viertechjs/baileys" dikembangkan dengan beberapa fungsi tambahan yang tidak tersedia secara langsung pada versi upstream.

Fitur Tambahan VierTech

Beberapa fungsi tambahan yang dikembangkan pada versi ini antara lain:

Sticker Pack

Dukungan helper untuk mengirim WhatsApp Sticker Pack secara langsung.

Fitur ini juga digunakan untuk kebutuhan game seperti UNO, di mana beberapa kartu sticker dapat dikirim sebagai satu sticker pack.

Contoh:

await sock.sendStickerPack(jid, {
  name: 'UNO Cards',
  publisher: 'VierTech',
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
    }
  ]
})

Helper juga tersedia melalui export:

import {
  sendStickerPack
} from '@viertechjs/baileys'

---

Polling Helper

Menambahkan helper tambahan untuk menangani dan melakukan decrypt terhadap vote polling WhatsApp.

Fitur ini dibuat agar implementasi polling pada bot menjadi lebih sederhana dan dapat menangani berbagai kemungkinan format JID WhatsApp seperti:

- PN JID
- LID
- Device JID
- Poll Creator JID
- Voter JID

Helper yang tersedia:

import {
  decryptPollVoteWithCandidates,
  getPollMessageSecret,
  getAggregateVotesInPollMessage
} from '@viertechjs/baileys'

Polling helper ini digunakan untuk beberapa sistem game seperti:

- PG / Pilihan Ganda
- Werewolf
- Mafia

---

Instalasi

Menggunakan npm:

npm install @viertechjs/baileys

Menggunakan yarn:

yarn add @viertechjs/baileys

Atau install langsung dari GitHub:

npm install github:aa-javier/viertech-baileys

Penggunaan

import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@viertechjs/baileys'

const { state, saveCreds } = await useMultiFileAuthState('./session')

const sock = makeWASocket({
  auth: state
})

sock.ev.on('creds.update', saveCreds)

Sebagian besar penggunaan Baileys original tetap kompatibel dengan versi ini.

Tujuan Pengembangan

"@viertechjs/baileys" dikembangkan untuk:

- mempertahankan kompatibilitas dengan Baileys upstream;
- menambahkan helper yang sering dibutuhkan WhatsApp Bot;
- mengurangi implementasi fungsi berulang pada source bot;
- menyediakan fungsi tambahan untuk sistem game;
- mempermudah pengembangan project berbasis WhatsApp Web Multi-Device;
- menyediakan versi Baileys yang dapat dikembangkan lebih lanjut sesuai kebutuhan VierTech.

Credits

Project ini merupakan fork/modifikasi dari:

WhiskeySockets/Baileys

Copyright dan atribusi dari project upstream tetap dihormati sesuai dengan lisensi aslinya.

Pengembangan dan modifikasi tambahan:

Harta Javier — VierTech

Disclaimer

Project ini tidak berafiliasi, disponsori, atau didukung secara resmi oleh WhatsApp maupun Meta.

WhatsApp adalah merek dagang dari pemiliknya masing-masing.

License

Project ini mengikuti ketentuan lisensi dari Baileys upstream dan lisensi yang disertakan di repository ini.

---

Developed & Modified by Harta Javier — VierTech
