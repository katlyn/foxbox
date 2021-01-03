import FlakeID from 'flake-idgen'

const snowflake = new FlakeID({
  // Raidbot's account creation date.
  epoch: 1609659182923,
  datacenter: Number(process.env.DATACENTER),
  worker: Number(process.env.WORKER)
})

const getString = (): string => {
  const flake = snowflake.next()
  return flake.readBigInt64BE().toString()
}

export default {
  next: getString
}
