import { spawn } from 'child_process'
import { CommandClient } from 'eris'
import fetch from 'node-fetch'
import fs from 'fs'
import { file } from 'tmp-promise'

const FRAMES = 30

const init = (bot: CommandClient): void => {
  bot.registerCommand('rainbow', async (msg, [delayInput]) => {
    const delay = Number(delayInput) || 2

    await msg.channel.sendTyping()
    const imageReq = await fetch(msg.author.staticAvatarURL)
    const imageFile = await file()
    await fs.promises.writeFile(imageFile.path, await imageReq.buffer())

    const cmdArgs = []
    for (let i = 0; i < FRAMES; ++i) {
      cmdArgs.push('(', imageFile.path, '-modulate', `100,100,${360 / FRAMES * i}`, ')')
    }

    const outFile = await file()
    cmdArgs.push('-delay', '2', '-set', 'delay', delay.toString(), '-loop', '0', `gif:${outFile.path}`)

    const convert = spawn('convert', cmdArgs)
    convert.stdout.on('data', d => console.log(d.toString()))
    convert.stderr.on('data', d => console.error(d.toString()))
    convert.on('error', console.error)
    convert.on('close', async code => {
      if (code === 0) {
        await msg.channel.createMessage('', {
          file: await fs.promises.readFile(outFile.path),
          name: 'rainbow.gif'
        })
      } else {
        await msg.channel.createMessage(`Exited with non-zero exit code: ${code}`)
      }
      await Promise.all([
        imageFile.cleanup(),
        outFile.cleanup()
      ])
    })
  }, {
    usage: 'image manipulation',
    description: 'Rainbowify your avatar'
  })
}

export default {
  init
}
