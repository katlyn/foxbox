import 'source-map-support/register'
import { CommandClient } from 'eris'

const bot = new CommandClient(process.env.TOKEN)

bot.on('ready', () => {
  console.log(`Connected to Discord as ${bot.user.username}#${bot.user.discriminator}`)
})

bot.connect()
  .catch(err => {
    console.error(err)
  })
