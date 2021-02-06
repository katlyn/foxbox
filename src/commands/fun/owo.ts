import { CommandClient } from 'eris'
import snowflake from '../../config/snowflake'
import pool from '../../config/postgres'

export interface OwoImage {
  // ID of the image
  id: string
  // Link to the image
  link: string
  // Any tags the image should have (author, meium, etc)
  tags: string[]
}

const init = (bot: CommandClient): void => {
  const owo = bot.registerCommand('owo', async msg => {
    const imageQuery = await pool.query<OwoImage>({
      text: 'SELECT * FROM owo_images ORDER BY RANDOM() LIMIT 1'
    })

    if (imageQuery.rowCount < 1) {
      await msg.channel.createMessage('For some reason I can\'t find any images in my database ;~;')
      return
    }

    await msg.channel.createMessage(imageQuery.rows[0].link)
  }, {
    usage: 'fun',
    description: 'Get some nice art'
  })

  owo.registerSubcommand('add', async (msg, args) => {
    const [link, ...tags] = args
    const id = snowflake.next()
    await pool.query({
      text: 'INSERT INTO owo_images (id, link, tags) VALUES ($1, $2, $3)',
      values: [id, link, tags]
    })
    return id
  }, {
    usage: 'utility',
    requirements: {
      userIDs: ['250322741406859265']
    }
  })
}

export default {
  init
}
