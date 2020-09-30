import { CommandClient } from 'eris'
import { tokenizeArgs } from '../../config/bot'

export const init = (bot: CommandClient): void => {
  bot.registerCommand('choose', (msg, args) => {
    const choices = tokenizeArgs(args.join(' '))
    return choices[Math.floor(Math.random() * choices.length)]
  })
}

export default {
  init
}
