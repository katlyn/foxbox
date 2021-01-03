import { CommandClient, GuildTextableChannel, Message } from 'eris'

import pool from '../../config/postgres'
import snowflake from '../../config/snowflake'
import { getReply, ReplyError } from '../../config/utils'

export interface Gang {
  // ID for this gang
  id: string
  // Gang message this is related to
  message: string
  // Role ID for this gand
  role: string
  // reaction Emoji for this gang
  emoji: string
}

const customEmojiRegex = /<(?<e>a?:\w+:[0-9]+)>/

const init = (bot: CommandClient): void => {
  bot.registerCommand('gangs', async msg => {
    let placeholder: Message|undefined
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const guild = (msg.channel as GuildTextableChannel).guild

      await msg.channel.createMessage('What would you like the announcement text to be? Reply with `cancel` to stop command execution at any time.')
      const announcement = (await getReply(msg.author, msg.channel)).content

      await msg.channel.createMessage('What channel should this be posted in?')
      let channelReply = await getReply(msg.author, msg.channel)
      let channel = guild.channels.get(channelReply.content.slice(2, -1))

      while (channel === undefined || ![0, 5].includes(channel.type)) {
        await msg.channel.createMessage('That\'s not a valid text channel. What channel should this be posted in?')
        channelReply = await getReply(msg.author, msg.channel)
        channel = guild.channels.get(channelReply.content.slice(2, -1))
      }

      placeholder = await (channel as GuildTextableChannel).createMessage({
        content: `${announcement}\n*This message will be updated momentarily with gang roles.*`,
        allowedMentions: {
          everyone: msg.mentionEveryone,
          roles: msg.roleMentions,
          users: msg.mentions.map(u => u.id)
        }
      })

      // Delete any other gangs
      await client.query({
        text: 'DELETE FROM gang_messages WHERE guild_id = $1',
        values: [guild.id]
      })
      // Add this gang message
      await client.query({
        text: 'INSERT INTO gang_messages (id, guild_id) VALUES ($1, $2)',
        values: [placeholder.id, guild.id]
      })

      const gangs: Gang[] = []

      // loop to collect all gangs
      await msg.channel.createMessage('What gangs would you like to add? Reply with an emoji and role mention, and `done` when all gangs are provided.')
      while (true) {
        const reply = await (await getReply(msg.author, msg.channel))
        if (reply.content.toLowerCase() === 'done') {
          break
        }

        const [emoji, role] = reply.content.split(' ')
        if (role === undefined) {
          await msg.channel.createMessage('That is not a valid role. Reply with an emoji and role mention, and `done` when all gangs are provided.')
          continue
        }

        const guildRole = guild.roles.get(role.slice(3, -1))
        if (guildRole === undefined) {
          await msg.channel.createMessage('That is not a valid role. Reply with an emoji and role mention, and `done` when all gangs are provided.')
          continue
        }

        const gang = {
          id: snowflake.next(),
          emoji: customEmojiRegex.test(emoji) ? customEmojiRegex.exec(emoji)?.groups?.e : emoji,
          role: guildRole.id,
          message: placeholder.id
        }

        try {
          await reply.addReaction(gang.emoji)
          gangs.push(gang)
          await msg.channel.createMessage('Gang added. Reply with an emoji and role mention, and `done` when all gangs are provided.')
        } catch (err) {
          await msg.channel.createMessage('I don\'t have access to that emoji. Reply with an emoji and role mention, and `done` when all gangs are provided.')
        }
      }

      await placeholder.edit({
        content: `${announcement}\n${gangs.map(g => `${g.emoji.includes(':') ? `<${g.emoji}>` : g.emoji} - <@&${g.role}>`).join('\n')}`,
        allowedMentions: {
          everyone: msg.mentionEveryone,
          roles: msg.roleMentions,
          users: msg.mentions.map(u => u.id)
        }
      })

      await Promise.all(gangs.map(async g => {
        await placeholder?.addReaction(g.emoji)
        await client.query({
          text: 'INSERT INTO gangs (id, gang_message, role_id, emoji) VALUES ($1, $2, $3, $4)',
          values: [g.id, g.message, g.role, g.emoji]
        })
      }))

      await client.query('COMMIT')
      await msg.channel.createMessage('Gangs created!')
    } catch (err) {
      await client.query('ROLLBACK')
      if (err instanceof ReplyError) {
        await msg.channel.createMessage('Command cancelled.')
      } else {
        await msg.channel.createMessage('Command exited with unknown error. No changes have been made.')
        console.log(err)
      }
      if (placeholder !== undefined) {
        await placeholder.delete()
      }
    } finally {
      client.release()
    }
  }, {
    aliases: ['roles'],
    description: 'Admin management of gangs.',
    fullDescription: 'Similar to reaction roles, only one set of gangs can be active on each guild. A user can only be in one gang at a time',
    defaultSubcommandOptions: {
      usage: 'admin'
    },
    requirements: {
      permissions: {
        administrator: true
      }
    },
    usage: 'administration'
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  bot.on('messageReactionAdd', async (msg, emoji, user) => {
    try {
      if (msg.guildID === undefined) {
        return
      }
      const guild = bot.guilds.get(msg.guildID)
      if (!guild.permissionsOf(bot.user.id).has('manageRoles')) {
        return
      }

      const emojiString = emoji.id === null
        ? emoji.name
        : `${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}`

      // TODO: Cache all the emoji reactions because that'd be a good thing to.
      const gangs = await pool.query({
        text: 'SELECT role_id, emoji FROM gangs WHERE gang_message = $1',
        values: [msg.id]
      })

      const gangRole = gangs.rows.find(g => g.emoji === emojiString)?.role_id
      if (gangRole === undefined) {
        return
      }

      const [member] = await guild.fetchMembers({
        userIDs: [user.id]
      })

      const roles = member.roles.filter(r => gangs.rows.find(g => g.role_id === r) === undefined)
      roles.push(gangRole)

      await member.edit({
        roles
      }, 'Gang change')

      if (guild.permissionsOf(bot.user.id).has('manageMessages')) {
        const fullMessage = await bot.getMessage(msg.channel.id, msg.id)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        gangs.rows.forEach(async g => {
          if (g.emoji !== emojiString) {
            await fullMessage.removeReaction(g.emoji, user.id)
          }
        })
      }
    } catch (err) {} // Silently fail
  })
}

export default {
  init
}
