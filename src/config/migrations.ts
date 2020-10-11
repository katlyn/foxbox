import { createDb, migrate } from 'postgres-migrations'
import { Pool } from 'pg'
import { resolve } from 'path'

const runMigrations = async (pool: Pool): Promise<void> => {
  const client = await pool.connect()
  // FIXME: This needs to be much more resilient
  const dbname = process.env.POSTGRES_URI.split('/')[3]
  try {
    await createDb(dbname, { client })
    await migrate({ client }, resolve(__dirname, '../../migrations'))
  } finally {
    client.release()
  }
}

export default runMigrations
