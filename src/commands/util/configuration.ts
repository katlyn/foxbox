import { CommandClient, GuildTextableChannel } from 'eris'

import guildConfig from '../../config/guildConfig'

export const init = (bot: CommandClient): void => {
  const config = bot.registerCommand('config', msg => {
    return `Use ${msg.prefix}help config for subcommands.`
  }, {
    defaultSubcommandOptions: {
      guildOnly: true,
      requirements: {
        permissions: {
          administrator: true
        }
      },
      usage: 'utility'
    },
    description: 'Configure various bot options.',
    usage: 'utility'
  })

  config.registerSubcommand('pin-limit', async (msg, [limit]) => {
    const guild = (msg.channel as GuildTextableChannel).guild
    if (limit === undefined) {
      const config = await guildConfig.get(guild.id)
      return `This guild's pin limit is currently set to \`${config.pinLimit}\`.`
    }

    const numberLimit = Number(limit)
    if (numberLimit >= 0) {
      await guildConfig.set(guild.id, { pinLimit: numberLimit })
      return 'Successfully updated config.'
    } else {
      return 'Invalid value. Must be a positive integer. Set to zero to disable.'
    }
  }, {
    description: 'Specify the number of reactions required to pin a message. Set to zero to disable.'
  })
}

export default {
  init
}
