import { Channel, GenericCheckFunction, Guild, GuildChannel, Message, User } from 'eris'

import { bot } from './bot'

export const BOT_ADMINS = ['250322741406859265']

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
    }, 2 * 60 * 1000)

    bot.on('messageCreate', listener)
  })
}
