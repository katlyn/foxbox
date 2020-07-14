import { CommandClient } from 'eris'

import r from '../../config/redis'

export const init = (bot: CommandClient): void => {
  console.log('loaded')
  bot.registerCommand('boyspoints', async (msg, args) => {
    let user = msg.mentions[0]
    if (user === undefined) {
      user = msg.author
    }
    if (args.length === 2) {
      if (msg.author.id === user.id) {
        await msg.channel.createMessage('You can\'t change your own boys points bro')
      } else if (isNaN(Number(args[1]))) {
        await msg.channel.createMessage('smh that\'s not even a number bro')
      } else {
        const bp = await r.incrby(`boyspoints:${user.id}`, Math.floor(Number(args[1])))
        await msg.channel.createMessage(`${user.username} now has ${bp} boys points`)
      }
    } else {
      const bp = await r.get(`boyspoints:${user.id}`)
      await msg.channel.createMessage(`${user.username} has ${bp === null ? 0 : bp} boys points`)
    }
  }, {
    aliases: ['bp', 'boypoints', 'bropoints']
  })
}

export default {
  init
}
