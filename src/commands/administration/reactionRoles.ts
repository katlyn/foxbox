import { CommandClient, Emoji, GuildTextableChannel, Member, Message, PartialEmoji, PossiblyUncachedMessage, Role } from 'eris'
import { QueryResult } from 'pg'
import pool from '../../config/postgres'
import snowflake from '../../config/snowflake'
import { getReaction, getReply, ReactionError, ReplyError } from '../../config/utils'

export interface ReactionRole {
  id: string
  role: string
  emoji: string
  message: string
  guild: string
}

const init = (bot: CommandClient): void => {
  const reactionRoles = bot.registerCommand('reaction-role', async msg => {
    await msg.channel.createMessage("React to the message you want to add a reaction role to with the emoji you want to use. Remember that I have to be able to see the channel you react in, or this won't work.")

    const { guild } = msg.channel as GuildTextableChannel
    try {
      const { message, emoji } = await getReaction((m, e, u) => {
        return u.id === msg.author.id && guild.channels.has(m.channel.id)
      })
      await msg.channel.createMessage(`You've selected \`:${emoji.name}:\` on https://discord.com/channels/${guild.id}/${message.channel.id}/${message.id} - what role would you like this reaction to assign?`)
      
      const { content: roleReply } = await getReply(msg.author, msg.channel)
      let role = guild.roles.get(roleReply.slice(3, -1)) ?? guild.roles.get(roleReply)
      while (role === void 0) {
        msg.channel.createMessage("That doesn't look like a valid role. What role do you want this reaction to assign? Respond with ID or mention.")
        const { content: roleReply } = await getReply(msg.author, msg.channel)
        role = guild.roles.get(roleReply.slice(3, -1)) ?? guild.roles.get(roleReply)
      }

      await pool.query({
        text: 'INSERT INTO reaction_messages (id, guild, message, emoji, role) VALUES ($1, $2, $3, $4, $5)',
        values: [snowflake.next(), guild.id, message.id, emoji.id ?? emoji.name, role.id]
      })

      await msg.channel.createMessage('Reaction role saved.')
    } catch (err) {
      if (err instanceof ReactionError) {
        await msg.channel.createMessage("Waiting for a reaction timed out. Make sure I have access to the channel you're reacting in. Command canceled.")
      } else if (err instanceof ReplyError) {
        await msg.channel.createMessage('Command canceled.')
      } else {
        console.error(err)
        await msg.channel.createMessage('Unknown error occured.')
      }
    }
  }, {
    aliases: ['reaction-roles', 'rr'],
    description: 'Admin management of reaction roles.',
    fullDescription: 'Allow users to self-manage roles by reacting to a message.',
    guildOnly: true,
    defaultSubcommandOptions: {
      guildOnly: true,
      usage: 'admin',
      requirements: {
        permissions: {
          administrator: true
        }
      }
    },
    requirements: {
      permissions: {
        administrator: true
      }
    },
    usage: 'administration'
  })

  reactionRoles.registerSubcommand('remove', async (msg, args) => {
    if (args[0] === void 0) {
      await msg.channel.createMessage('Please provide a message ID to remove reaction roles from.')
      return
    }
    const res = await pool.query({
      text: 'DELETE FROM reaction_messages WHERE message = $1',
      values: [args[0]]
    })
    await msg.channel.createMessage(`Done. ${res.rowCount} reaction roles deleted.`)
  })

  const getReactionRole = async (msg: PossiblyUncachedMessage, emoji: PartialEmoji) => {
    const res: QueryResult<ReactionRole> = await pool.query({
      text: 'SELECT * FROM reaction_messages WHERE message = $1 AND emoji = $2',
      values: [msg.id, emoji.id ?? emoji.name]
    })

    return res.rows[0]
  }

  bot.on('messageReactionAdd', async (msg, emoji, user) => {
    if (msg.guildID === void 0) {
      return
    }

    const guild = bot.guilds.get(msg.guildID)
    if (!guild.permissionsOf(bot.user.id).has('manageRoles')) {
      return
    }

    const reactionRole = await getReactionRole(msg, emoji)
    if (reactionRole === void 0) {
      return
    }

    const [member] = await guild.fetchMembers({
      userIDs: [user.id]
    })
    if (member.bot) {
      return
    }
    member.addRole(reactionRole.role, 'Reaction roles')
  })

  bot.on('messageReactionRemove', async (msg, emoji, user) => {
    if (msg.guildID === void 0) {
      return
    }

    const guild = bot.guilds.get(msg.guildID)
    if (!guild.permissionsOf(bot.user.id).has('manageRoles')) {
      return
    }

    const reactionRole = await getReactionRole(msg, emoji)
    if (reactionRole === void 0) {
      return
    }

    const [member] = await guild.fetchMembers({
      userIDs: [user]
    })
    if (member.bot) {
      return
    }
    member.removeRole(reactionRole.role, 'Reaction roles')
  })
}

export default {
  init
}
