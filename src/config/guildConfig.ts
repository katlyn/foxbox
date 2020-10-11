import pool from './postgres'

interface GuildConfig {
  pinLimit?: number
  pinReaction?: string
}

const cache = new Map<string, GuildConfig>()

const defaultConfig: GuildConfig = {
  pinLimit: 0,
  pinReaction: '📌'
}

const get = async (guild: string): Promise<GuildConfig> => {
  const cached = cache.get(guild)
  if (cached === undefined) {
    const storedConfig = await pool.query({
      text: 'SELECT * FROM guild_config WHERE id=$1',
      values: [guild]
    })

    const [row] = storedConfig.rows
    const newConf: GuildConfig = {
      pinLimit: row?.pin_limit ?? defaultConfig.pinLimit,
      pinReaction: row?.pin_reaction ?? defaultConfig.pinReaction
    }

    cache.set(guild, newConf)
    return newConf
  } else return cached
}

// Store an updated guild config.
const set = async (guild: string, config: GuildConfig): Promise<GuildConfig> => {
  const updatedConfig = {
    ...defaultConfig,
    ...cache.get(guild),
    ...config
  }
  await pool.query({
    text: `INSERT INTO guild_config (id, pin_limit, pin_reaction) VALUES ($1, $2, $3)
           ON CONFLICT (id) DO UPDATE
           SET pin_limit = excluded.pin_limit, pin_reaction = excluded.pin_reaction`,
    values: [guild, updatedConfig.pinLimit, updatedConfig.pinReaction]
  })
  cache.set(guild, updatedConfig)
  return updatedConfig
}

export default {
  get,
  set
}
