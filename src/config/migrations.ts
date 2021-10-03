import { migrate } from 'postgres-migrations'
import { resolve } from 'path'
import pool from './postgres'

const runMigrations = async (): Promise<void> => {
  if (process.env.POSTGRES_URI === undefined) {
    throw new Error('POSTGRES_URI env var does not exist')
  }
  const client = await pool.connect()
  // FIXME: This needs to be much more resilient
  const database = process.env.POSTGRES_URI.split('/')[3]
  try {
    await migrate({
      database,
      client,
      // @ts-expect-error
      ensureDatabaseExists: true
    }, resolve(__dirname, '../../migrations'))
  } finally {
    client.release()
  }
}

export default runMigrations
