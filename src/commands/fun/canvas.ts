import redis from '../../config/redis'
import { createCanvas } from 'canvas'
import { Message, CommandClient } from 'eris'

export const height = 100
export const width = 100

export const cache: string[] = []

export const hexRegex = /^#?([0-9a-f]{3}){1,2}([0-9a-f]{2})?$/i

export const setPixel = async (x: number, y: number, color: string): Promise<'OK'> => {
  const index = y * width + x
  cache[index] = color
  return await redis.lset('canvas:set', index, color)
}

export const generate = (w: number, h: number): Buffer => {
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')
  const ratio = w / width

  for (let i = 0; i < cache.length; i++) {
    const x = i % width
    const y = Math.floor(i / width)
    ctx.fillStyle = `#${cache[i]}`
    ctx.fillRect(x * ratio, y * ratio, ratio, ratio)
  }

  return canvas.toBuffer()
}

export const setCommand = async (msg: Message, args: string[]): Promise<void> => {
  if (args.length !== 3) {
    await msg.channel.createMessage('Invalid usage. `paint <x> <y> <hex>`')
  }

  const x = Number(args[1]) - 1
  const y = Number(args[0]) - 1
  const color = args[2]

  // Check if coordinates are valid
  if (!(x >= 0 && x < width && y >= 0 && y < height)) {
    await msg.channel.createMessage('Hmm, something about those coordinates doesn\'t look right. Make sure they\'re actually on the canvas!')
    return
  }

  if (!hexRegex.test(color)) {
    await msg.channel.createMessage('I- I don\'t think that\'s a valid hex colour, sorry :<')
    return
  }

  const typingProm = msg.channel.sendTyping()
  const pixelProm = setPixel(x, y, color.replace('#', ''))

  await Promise.all([typingProm, pixelProm])
  await msg.channel.createMessage('Painted!', {
    file: generate(300, 300),
    name: 'canvas.png'
  })
}

export const generateCommand = async (msg: Message): Promise<void> => {
  await msg.channel.createMessage('', {
    file: generate(300, 300),
    name: 'canvas.png'
  })
}

export const init = (bot: CommandClient): void => {
  bot.registerCommand('canvas', generateCommand)
    .registerSubcommand('paint', setCommand)

  // Initialize the redis store
  redis.exists('canvas:set')
    .then(async exists => {
      if (exists === 1) {
        const rawCache = await redis.lrange('canvas:set', 0, -1)
        cache.splice(0, cache.length)
        for (const pixel of rawCache) {
          cache.push(pixel)
        }
      } else {
        for (let i = 0; i < width * height; i++) {
          cache.push('00000000')
        }
        await redis.lpush('canvas:set', cache)
      }
    }, err => {
      console.log(err)
    })
}

export default {
  init,
  generate,
  setPixel
}
