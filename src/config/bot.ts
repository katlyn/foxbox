import { InteractionCommandClient } from 'detritus-client'

if (process.env.DISCORD_TOKEN === undefined) {
  throw new Error('DISCORD_TOKEN env var does not exist')
}

const client = new InteractionCommandClient(process.env.DISCORD_TOKEN)

export default client
