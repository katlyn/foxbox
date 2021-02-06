import 'source-map-support/register'

import { bot } from './config/bot'
import runMigrations from './config/migrations'
import pool from './config/postgres'

import gangs from './commands/administration/gangs'

import ascii from './commands/fun/ascii'
import owo from './commands/fun/owo'
import uwu from './commands/fun/uwu'

import config from './commands/util/configuration'
import choose from './commands/util/choose'
import evaluate from './commands/util/evaluate'
import help from './commands/util/help'
import latex from './commands/util/latex'
import wolfram from './commands/util/wolfram'

import reactionPins from './events/reactionPins'

(async () => {
  await runMigrations(pool)

  gangs.init(bot)

  ascii.init(bot)
  owo.init(bot)
  uwu.init(bot)

  config.init(bot)
  choose.init(bot)
  evaluate.init(bot)
  help.init(bot)
  latex.init(bot)
  wolfram.init(bot)

  reactionPins.init(bot)

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
