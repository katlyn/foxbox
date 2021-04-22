import { CommandClient, GuildTextableChannel } from 'eris'
import { QueryResult } from 'pg'
import pool from '../../config/postgres'

const init = (bot: CommandClient): void => {
  bot.registerCommand('uwu', async (msg, args) => {
    const topFive: QueryResult<{id: string, uwus: string}> = await pool.query({
      text: 'SELECT * FROM USERS ORDER BY uwus DESC LIMIT 5'
    })
    const userScore: QueryResult<{id: string, uwus: string}> = await pool.query({
      text: 'SELECT * FROM USERS WHERE id = $1',
      values: [msg.author.id]
    })
    const lines = []
    if (userScore.rows[0] !== undefined) {
      lines.push(`You have uwud ${userScore.rows[0].uwus} times.\n`)
    } else {
      lines.push('It doesn\'t look like you\'ve uwud before :<\n')
    }
    lines.push('Top five uwuers')

    // Map the uwuers to nice names, only ping if in server.
    topFive.rows.map(u => {
      const { guild } = msg.channel as GuildTextableChannel
      if (guild !== undefined && guild.members.has(u.id)) {
        return {
          name: `<@${u.id}>`,
          uwus: u.uwus
        }
      }
      const user = bot.users.get(u.id)
      if (user !== undefined) {
        return {
          name: user.username,
          uwus: u.uwus
        }
      }
      return {
        name: u.id,
        uwus: u.uwus
      }
    }).forEach(u => lines.push(`${u.name} - **${u.uwus}**`))
    await msg.channel.createMessage({
      content: lines.join('\n'),
      allowedMentions: {
        users: false
      }
    })
  }, {
    aliases: ['uwus'],
    usage: 'fun',
    description: 'owo'
  })

  bot.on('messageCreate', msg => {
    if (msg.content.match(/(\s|^)uwu(\s|$)/i) && !msg.author.bot) {
      pool.query({
        text: 'INSERT INTO users (id, uwus) VALUES ($1, 1) ON CONFLICT (id) DO UPDATE SET uwus = users.uwus + 1',
        values: [msg.author.id]
      })
        .catch(console.error)
    }
  })
}

export default {
  init
}
