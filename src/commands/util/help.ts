import { Command, CommandClient, Embed, EmbedField, Message } from 'eris'

const init = (bot: CommandClient): void => {
  bot.registerCommand('help', async (msg, args) => {
    const embed: Embed = {
      author: {
        name: bot.user.username,
        icon_url: bot.user.avatarURL
      },
      fields: [],
      type: 'rich'
    }

    if (args.length === 0) {
      embed.fields = await fieldifyCommands(bot.commands, msg)
    } else {
      const command = bot.commands[args[0].toLowerCase()]
      if (command === undefined) {
        embed.description = 'Command not found.'
      } else {
        embed.description = command.description
        embed.fields = await fieldifyCommands(command.subcommands, msg)
      }
    }

    embed.footer = {
      text: `Created by ${bot.commandOptions.owner}`
    }

    await msg.channel.createMessage({ embed })
  }, {
    description: 'This help command.',
    usage: 'utility'
  })
}

const fieldifyCommands = async (commands: {[key: string]: Command}, context: Message): Promise<EmbedField[]> => {
  const usageMap = new Map<string, Command[]>()
  for (const key of Object.keys(commands)) {
    const cmd = commands[key]
    const category = usageMap.get(cmd.usage)
    if (category === undefined) {
      usageMap.set(cmd.usage, [cmd])
    } else {
      category.push(cmd)
    }
  }
  const fields: EmbedField[] = []
  for (const key of usageMap.keys()) {
    const cmds = usageMap.get(key)
    const cmdTests = await Promise.all(cmds.map(async c => await ((c as any).permissionCheck(context) as Promise<boolean>)))
    const usableCmds = cmds.filter((c, i) => c.hidden ? false : cmdTests[i])
    fields.push({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: usableCmds.length > 0
        ? usableCmds.map(c => `\`${c.label}\` - ${c.description}`).join('\n')
        : '*You are not able to use any commands in this category.*'
    })
  }
  return fields
}

export default {
  init
}
