import { Constants, Interaction, Structures, Utils } from 'detritus-client'
import { BaseSet } from 'detritus-utils'
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = Constants
const { Embed, Markup } = Utils

export class BaseInteractionCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
  error = 'Command'
  guildIds = (process.env.NODE_ENV === 'development' && process.env.DEV_GUILD !== undefined) ? new BaseSet([process.env.DEV_GUILD]) : undefined

  async onDmBlocked (context: Interaction.InteractionContext): Promise<void> {
    const command = Markup.codestring(context.name)
    return await context.editOrRespond({
      content: `⚠ ${this.error} ${command} cannot be used in a DM.`,
      flags: MessageFlags.EPHEMERAL
    })
  }

  async onRunError (context: Interaction.InteractionContext, args: ParsedArgsFinished, error: any): Promise<void> {
    const embed = new Embed()
    embed.setTitle(`${this.error} Error`)
    embed.setDescription(Markup.codestring(String(error)))

    return await context.editOrRespond({
      embed,
      flags: MessageFlags.EPHEMERAL
    })
  }

  async onValueError (context: Interaction.InteractionContext, args: Interaction.ParsedArgs, errors: Interaction.ParsedErrors): Promise<void> {
    const embed = new Embed()
    embed.setTitle(`${this.error} Argument Error`)

    const store: { [key: string]: string } = {}

    const description: string[] = ['Invalid Arguments' + '\n']
    for (const key in errors) {
      const message = errors[key].message
      if (message in store) {
        description.push(`**${key}**: Same error as **${store[message]}**`)
      } else {
        description.push(`**${key}**: ${message}`)
      }
      store[message] = key
    }

    embed.setDescription(description.join('\n'))
    return await context.editOrRespond({
      embed,
      flags: MessageFlags.EPHEMERAL
    })
  }
}

export class BaseCommandOption<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
  type = ApplicationCommandOptionTypes.SUB_COMMAND
}

export class BaseCommandOptionGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
  type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
}

export class BaseSlashCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends BaseInteractionCommand<ParsedArgsFinished> {
  error = 'Slash Command'
  type = ApplicationCommandTypes.CHAT_INPUT
}

export interface ContextMenuMessageArgs {
  message: Structures.Message
}

export class BaseContextMenuMessageCommand extends BaseInteractionCommand<ContextMenuMessageArgs> {
  error = 'Message Context Menu'
  type = ApplicationCommandTypes.MESSAGE
}

export interface ContextMenuUserArgs {
  member?: Structures.Member
  user: Structures.User
}

export class BaseContextMenuUserCommand extends BaseInteractionCommand<ContextMenuUserArgs> {
  error = 'User Context Menu'
  type = ApplicationCommandTypes.USER
}
