import { Client, GuildTextableChannel, Message } from 'eris'

import guildConfig from '../config/guildConfig'

const init = (bot: Client): void => {
  bot.on('messageReactionAdd', (msg, emoji) => {
    const guild = (msg.channel as GuildTextableChannel).guild
    if (guild !== undefined) {
      guildConfig.get(guild.id)
        .then(async config => {
          if (emoji.name === config.pinReaction) {
            const reacted = await bot.getMessageReaction(msg.channel.id, msg.id, config.pinReaction)
            if (reacted.length === config.pinLimit && config.pinLimit !== 0) {
              try {
                await (msg as Message).pin()
              } catch (e) {}
            }
          }
        })
        .catch(console.error)
    }
  })
}

export default {
  init
}
