# @viertechjs/baileys

This repository is a VierTechJS-maintained fork of Baileys.

Repository: https://github.com/aa-javier/viertech-baileys

## Package

```bash
npm install @viertechjs/baileys
```

```js
import makeWASocket from '@viertechjs/baileys'
```

The fork intentionally preserves the upstream public API surface unless a VierTechJS release explicitly documents a breaking change. The upstream MIT license and copyright notices remain in `LICENSE`.

## VierTech game helpers

### Native sticker packs (UNO)

```ts
const pack = await sock.sendStickerPack(jid, {
  name: 'UNO Cards',
  publisher: 'VierTech',
  description: 'UNO game card pack',
  stickers: [
    { buffer: redSevenWebp, emojis: ['7️⃣', '🔴'] },
    { url: 'https://example.com/wild.webp', emojis: ['🎨'] }
  ]
})
```

The same implementation is also exported as `sendStickerPack(sock, jid, options)`.
A pack supports 1–60 WebP stickers, URL/Buffer/Uint8Array input, a custom cover, emojis, labels, animated/Lottie metadata, and native `StickerPackMessage` delivery.

### Robust poll vote decryption (PG / Werewolf / Mafia)

```ts
const result = decryptPollVoteWithCandidates(pollUpdate.vote, {
  pollEncKey: messageSecret,
  pollCreatorJids: creatorCandidates,
  pollMsgIds: pollIdCandidates,
  voterJids: voterCandidates
})

if (result) {
  const { vote, voterJid, pollCreatorJid, pollMsgId } = result
  // vote.selectedOptions is ready for getAggregateVotesInPollMessage(...)
}
```

This helper handles the PN/LID/device-JID candidate probing that game poll handlers previously had to duplicate.
Existing Baileys poll APIs (`decryptPollVote`, `getAggregateVotesInPollMessage`, and normal `sendMessage({ poll: ... })`) remain available and unchanged.

`getPollMessageSecret(...)` is also exported to extract the poll encryption secret from saved WAMessage/message variants before calling `decryptPollVoteWithCandidates`.
