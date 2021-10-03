import 'source-map-support/register'

import client from './config/bot'
import migrate from './config/migrations'

(async () => {
  // Run database migrations
  await migrate()

  // Exit (somewhat) gracefully
  process.on('SIGTERM', () => {
    client.kill()
  })

  await client.addMultipleIn('commands')

  const cluster = await client.run()
  console.log(`Connected to Discord. Using ${cluster.shardCount} shards.`)
})()
  .catch(console.error)
