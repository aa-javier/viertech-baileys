import crypto from 'crypto'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { proto } from '../../WAProto/index.js'
import type { WAMessage } from '../Types'
import { encryptedStream } from './messages-media'
import { generateMessageID } from './generics'

export type StickerPackStickerInput = {
	buffer?: Buffer | Uint8Array
	url?: string
	emojis?: string[]
	label?: string
	isAnimated?: boolean
	isLottie?: boolean
	mimetype?: string
}

export type StickerPackOptions = {
	name?: string
	publisher?: string
	description?: string
	cover?: Buffer | Uint8Array | string
	stickers: StickerPackStickerInput[]
}

type StickerPackSocket = {
	waUploadToServer: (path: string, opts: any) => Promise<any>
	relayMessage: (jid: string, message: proto.IMessage, opts: any) => Promise<any>
}

async function urlToBuffer(url: string) {
	const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' })
	if (!res.ok) throw new Error(`[StickerPack] HTTP ${res.status} fetch: ${url}`)
	return Buffer.from(await res.arrayBuffer())
}

async function resolveBuffer(input: Buffer | Uint8Array | string) {
	if (Buffer.isBuffer(input)) return input
	if (input instanceof Uint8Array) return Buffer.from(input)
	if (typeof input === 'string') return urlToBuffer(input)
	throw new Error('[StickerPack] Input must be a Buffer, Uint8Array, or URL string.')
}

function crc32(buffer: Uint8Array) {
	let crc = 0xffffffff
	for (const byte of buffer) {
		crc ^= byte
		for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
	}
	return (crc ^ 0xffffffff) >>> 0
}

/** Minimal ZIP writer using STORE mode. Sticker packs do not need compression because WebP is already compressed. */
async function buildZip(files: Record<string, Buffer>) {
	const locals: Buffer[] = []
	const centrals: Buffer[] = []
	let offset = 0

	for (const [name, data] of Object.entries(files)) {
		const fileName = Buffer.from(name)
		const checksum = crc32(data)
		const local = Buffer.alloc(30 + fileName.length)
		local.writeUInt32LE(0x04034b50, 0)
		local.writeUInt16LE(20, 4)
		local.writeUInt16LE(0, 6)
		local.writeUInt16LE(0, 8)
		local.writeUInt16LE(0, 10)
		local.writeUInt16LE(0, 12)
		local.writeUInt32LE(checksum, 14)
		local.writeUInt32LE(data.length, 18)
		local.writeUInt32LE(data.length, 22)
		local.writeUInt16LE(fileName.length, 26)
		local.writeUInt16LE(0, 28)
		fileName.copy(local, 30)
		locals.push(local, data)

		const central = Buffer.alloc(46 + fileName.length)
		central.writeUInt32LE(0x02014b50, 0)
		central.writeUInt16LE(20, 4)
		central.writeUInt16LE(20, 6)
		central.writeUInt16LE(0, 8)
		central.writeUInt16LE(0, 10)
		central.writeUInt16LE(0, 12)
		central.writeUInt16LE(0, 14)
		central.writeUInt32LE(checksum, 16)
		central.writeUInt32LE(data.length, 20)
		central.writeUInt32LE(data.length, 24)
		central.writeUInt16LE(fileName.length, 28)
		central.writeUInt16LE(0, 30)
		central.writeUInt16LE(0, 32)
		central.writeUInt16LE(0, 34)
		central.writeUInt16LE(0, 36)
		central.writeUInt32LE(0, 38)
		central.writeUInt32LE(offset, 42)
		fileName.copy(central, 46)
		centrals.push(central)
		offset += local.length + data.length
	}

	const centralOffset = offset
	const centralSize = centrals.reduce((sum, item) => sum + item.length, 0)
	const end = Buffer.alloc(22)
	end.writeUInt32LE(0x06054b50, 0)
	end.writeUInt16LE(0, 4)
	end.writeUInt16LE(0, 6)
	end.writeUInt16LE(centrals.length, 8)
	end.writeUInt16LE(centrals.length, 10)
	end.writeUInt32LE(centralSize, 12)
	end.writeUInt32LE(centralOffset, 16)
	end.writeUInt16LE(0, 20)

	return Buffer.concat([...locals, ...centrals, end])
}

async function encryptAndUpload(sock: StickerPackSocket, buffer: Buffer, mediaType: 'sticker-pack' | 'sticker-pack-thumbnail') {
	const tmpIn = path.join(os.tmpdir(), `wa_sp_${crypto.randomUUID()}.bin`)
	await fs.writeFile(tmpIn, buffer)
	let encFilePath: string | undefined
	try {
		const enc = await encryptedStream({ url: tmpIn }, mediaType)
		encFilePath = enc.encFilePath
		const result = await sock.waUploadToServer(enc.encFilePath, {
			fileEncSha256B64: enc.fileEncSha256.toString('base64'),
			mediaType,
			timeoutMs: 120_000
		})
		return {
			fileSha256: enc.fileSha256,
			fileEncSha256: enc.fileEncSha256,
			mediaKey: enc.mediaKey,
			fileLength: enc.fileLength,
			directPath: result.directPath
		}
	} finally {
		await fs.unlink(tmpIn).catch(() => undefined)
		if (encFilePath) await fs.unlink(encFilePath).catch(() => undefined)
	}
}

/** Send a native WhatsApp StickerPackMessage. Useful for UNO/card games and sticker collections. */
export async function sendStickerPack(sock: StickerPackSocket, jid: string, options: StickerPackOptions): Promise<WAMessage> {
	const { name = 'Sticker Pack', publisher = '', description = '', cover, stickers = [] } = options
	if (!stickers.length) throw new Error('[StickerPack] At least 1 sticker is required.')
	if (stickers.length > 60) throw new Error('[StickerPack] Maximum 60 stickers per pack.')

	const packId = crypto.randomUUID()
	const stickerBuffers = await Promise.all(
		stickers.map(async (sticker, index) => {
			const input = sticker.buffer ?? sticker.url
			if (!input) throw new Error(`[StickerPack] Sticker[${index}] requires buffer or url.`)
			return resolveBuffer(input)
		})
	)
	const first = stickers[0]!
	const coverBuffer = await resolveBuffer(cover ?? first.buffer ?? first.url!)
	const trayIconFileName = `${packId}.webp`
	const zipFiles: Record<string, Buffer> = {}
	const stickerMeta: proto.Message.StickerPackMessage.ISticker[] = []

	for (let index = 0; index < stickerBuffers.length; index++) {
		const buf = stickerBuffers[index]!
		const sticker = stickers[index]!
		const hash = crypto.createHash('sha256').update(buf).digest('base64url')
		const fileName = `${String(index).padStart(2, '0')}_${hash}.webp`
		zipFiles[fileName] = buf
		stickerMeta.push({
			fileName,
			emojis: sticker.emojis ?? [],
			isAnimated: sticker.isAnimated ?? false,
			isLottie: sticker.isLottie ?? false,
			mimetype: sticker.mimetype ?? 'image/webp',
			accessibilityLabel: sticker.label ?? ''
		})
	}
	zipFiles[trayIconFileName] = coverBuffer

	const zipBuffer = await buildZip(zipFiles)
	const uploaded = await encryptAndUpload(sock, zipBuffer, 'sticker-pack')
	const thumbnail = await encryptAndUpload(sock, coverBuffer, 'sticker-pack-thumbnail').catch(() => uploaded)
	const stickerPackMessage = proto.Message.StickerPackMessage.create({
		stickerPackId: packId,
		name,
		publisher,
		packDescription: description,
		stickerPackOrigin: 1,
		fileSha256: uploaded.fileSha256,
		fileEncSha256: uploaded.fileEncSha256,
		mediaKey: uploaded.mediaKey,
		directPath: uploaded.directPath,
		fileLength: uploaded.fileLength,
		stickerPackSize: zipBuffer.length,
		thumbnailDirectPath: thumbnail.directPath,
		thumbnailSha256: thumbnail.fileSha256,
		thumbnailEncSha256: thumbnail.fileEncSha256,
		thumbnailWidth: 512,
		thumbnailHeight: 512,
		trayIconFileName,
		stickers: stickerMeta
	})
	const fullMessage = proto.Message.create({ stickerPackMessage })
	const messageId = generateMessageID()
	await sock.relayMessage(jid, fullMessage, { messageId })

	return {
		key: { fromMe: true, remoteJid: jid, id: messageId },
		message: fullMessage,
		messageTimestamp: Math.floor(Date.now() / 1000),
		status: proto.WebMessageInfo.Status.PENDING
	}
}
