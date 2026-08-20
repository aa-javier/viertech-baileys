import { proto } from '../../WAProto/index.js'
import { decryptPollVote } from './process-message'

export type PollVoteCandidateContext = {
	pollEncKey: Uint8Array
	pollCreatorJids: string[]
	pollMsgIds: string[]
	voterJids: string[]
}

export type DecryptedPollVoteCandidate = {
	vote: proto.Message.PollVoteMessage
	pollCreatorJid: string
	pollMsgId: string
	voterJid: string
}


/** Extract a poll message secret from Baileys WAMessage/message variants. */
export function getPollMessageSecret(...sources: any[]): Uint8Array | undefined {
	for (const source of sources) {
		if (!source) continue
		const message = source.message?.message ? source.message.message : source.message ?? source
		const secret =
			message?.messageContextInfo?.messageSecret ||
			message?.pollCreationMessage?.messageSecret ||
			message?.pollCreationMessageV2?.messageSecret ||
			message?.pollCreationMessageV3?.messageSecret
		if (secret) return secret as Uint8Array
	}
}

const uniqueStrings = (items: Array<string | null | undefined>) => [...new Set(items.filter(Boolean) as string[])]

/**
 * VierTech helper for games that need robust poll vote decryption across PN/LID/device JID variants.
 * It tries every supplied creator, poll id and voter candidate and returns the first valid vote.
 */
export function decryptPollVoteWithCandidates(
	encryptedVote: proto.Message.IPollEncValue,
	context: PollVoteCandidateContext
): DecryptedPollVoteCandidate | undefined {
	const pollCreatorJids = uniqueStrings(context.pollCreatorJids)
	const pollMsgIds = uniqueStrings(context.pollMsgIds)
	const voterJids = uniqueStrings(context.voterJids)

	for (const pollMsgId of pollMsgIds) {
		for (const pollCreatorJid of pollCreatorJids) {
			for (const voterJid of voterJids) {
				try {
					const vote = decryptPollVote(encryptedVote, {
						pollEncKey: context.pollEncKey,
						pollCreatorJid,
						pollMsgId,
						voterJid
					})

					if (!vote?.selectedOptions?.length) continue

					return { vote, pollCreatorJid, pollMsgId, voterJid }
				} catch {
					// Wrong candidate combination. Continue until one decrypts successfully.
				}
			}
		}
	}
}
