import 'source-map-support/register'

import { bot } from './config/bot'
import runMigrations from './config/migrations'
import pool from './config/postgres'

import ascii from './commands/fun/ascii'
import canvas from './commands/fun/canvas'
import choose from './commands/util/choose'
import evaluate from './commands/util/evaluate'
import wolfram from './commands/util/wolfram'

(async () => {
  await runMigrations(pool)

  ascii.init(bot)
  canvas.init(bot)
  choose.init(bot)
  evaluate.init(bot)
  wolfram.init(bot)

  bot.on('ready', () => {
    console.log(`Connected to Discord as ${bot.user.username}#${bot.user.discriminator}`)
  })

  process.on('SIGTERM', () => {
    bot.disconnect({
      reconnect: false
    })
  })

  await bot.connect()
})()
  .catch(error => { throw error })
