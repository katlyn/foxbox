import { CommandClient } from 'eris'
import { tokenizeArgs } from '../../config/bot'

export const init = (bot: CommandClient): void => {
  bot.registerCommand('choose', async (msg, args) => {
    const choices = tokenizeArgs(args.join(' '))
    await msg.channel.createMessage({
      content: choices[Math.floor(Math.random() * choices.length)],
      allowedMentions: {
        everyone: false,
        roles: false,
        users: false
      }
    })
  })
}

export default {
  init
}
