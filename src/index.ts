import 'source-map-support/register'

import { bot } from './config/bot'
import runMigrations from './config/migrations'
import pool from './config/postgres'

import commands from './commands'
import events from './events'

(async () => {
  await runMigrations(pool)

  commands.init(bot)
  events.init(bot)

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
