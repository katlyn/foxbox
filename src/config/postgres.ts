import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI
})

export default pool
