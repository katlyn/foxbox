import 'source-map-support/register'
import { CommandClient } from 'eris'

import ascii from './commands/fun/ascii'
import evaluate from './commands/util/evaluate'

const bot = new CommandClient(process.env.TOKEN, {}, {
  prefix: process.env.PREFIX.split(',')
})

ascii.init(bot)
evaluate.init(bot)

bot.on('ready', () => {
  console.log(`Connected to Discord as ${bot.user.username}#${bot.user.discriminator}`)
})

process.on('SIGTERM', () => {
  bot.disconnect({
    reconnect: false
  })
})

bot.connect()
  .catch(err => {
    console.error(err)
  })
