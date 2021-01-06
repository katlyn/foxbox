import { CommandClient } from 'eris'
import pool from '../../config/postgres'

const init = (bot: CommandClient): void => {
  bot.registerCommand('uwu', async (msg, args) => {
    const topFive = await pool.query({
      text: 'SELECT * FROM USERS ORDER BY uwus DESC LIMIT 5'
    })
    const userScore = await pool.query({
      text: 'SELECT * FROM USERS WHERE id = $1',
      values: [msg.author.id]
    })
    const lines = []
    if (userScore.rows[0] !== undefined) {
      lines.push(`You have uwud ${userScore.rows[0].uwus} times.`, '\n')
    } else {
      lines.push('It doesn\'t look like you\'ve uwud before :<', '\n')
    }
    lines.push('Top five uwuers')
    topFive.rows.forEach(u => lines.push(`<@${u.id}> - **${u.uwus}**`))
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
    if (msg.content.toLocaleLowerCase() === 'uwu') {
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
