import { Channel, Emoji, Member, Message, PossiblyUncachedMessage, User } from 'eris'

import { bot } from './bot'

export const BOT_ADMINS = ['250322741406859265']

const TIMEOUT = 12e4 // two minutes

export class ReplyError extends Error {}
export const getReply = async (author: User, channel: Channel): Promise<Message> => {
  return await new Promise((resolve, reject) => {
    const listener = (msg: Message): void => {
      if (msg.author === author && msg.channel === channel) {
        bot.off('messageCreate', listener)
        clearTimeout(timeout)
        if (['!cancel', 'cancel'].includes(msg.content.toLowerCase())) {
          reject(new ReplyError('cancelled'))
        } else {
          resolve(msg)
        }
      }
    }

    // Remove the listener automatically after two minutes of no response.
    const timeout = setTimeout(() => {
      bot.off('messageCreate', listener)
      reject(new ReplyError('timeout'))
    }, TIMEOUT)

    bot.on('messageCreate', listener)
  })
}

type FilterFunction = (
  message: PossiblyUncachedMessage,
  emoji: Emoji,
  reactor: Member | { id: string; }
) => boolean
export class ReactionError extends Error {}
export const getReaction = async (filter: FilterFunction): Promise<{
  message: PossiblyUncachedMessage,
  emoji: Emoji,
  reactor: Member | { id: string; }
}> => {
  return await new Promise((resolve, reject) => {
    const listener = (
      message: PossiblyUncachedMessage,
      emoji: Emoji,
      reactor: Member | { id: string; }
    ): void => {
      if (filter(message, emoji, reactor)) {
        bot.off('messageReactionAdd', listener)
        clearTimeout(timeout)
        resolve({ message, emoji, reactor })
      }
    }

    const timeout = setTimeout(() => {
      bot.off('messageReactionAdd', listener)
      reject(new ReactionError('timeout'))
    }, TIMEOUT)

    bot.on('messageReactionAdd', listener)
  })
}
