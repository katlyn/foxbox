import { CommandClient, Message } from 'eris'

export const init = (bot: CommandClient): void => {
  bot.registerCommand('evaluate', async (msg: Message, args: string[]): Promise<void> => {
    if (msg.author.id !== '250322741406859265') {
      const msgs = [
        'sorry you\'re too cute to run this command',
        'ur not a l33t enough hax0r to use this',
        'heck u',
        'no',
        'HTTP error 401',
        ';~;',
        '<:QunaUwU:662854241613774849>',
        '<:ponderpaissa:663451113244196864>',
        '<:hackerman:625772587787747347>',
        '<a:ablobcatcoffee:636641712860823562>',
        '<:sleepnyaissa:663458717362028575>',
        '<:SquirtleGun:597568157464395786>',
        '<a:owoRunFast:654065913112428544>'
      ]
      await msg.channel.createMessage(msgs[Math.floor(Math.random() * msgs.length)])
      return
    }
    await msg.channel.sendTyping()
    // Message content minus prefix
    let toEval = msg.content.replace(/\S+/, '').trim()
    if (toEval.startsWith('```')) {
      // Remove first line from message
      toEval = toEval.replace(/.*/, '').trim()
    }
    if (toEval.endsWith('```')) {
      toEval = toEval.substring(0, toEval.length - 3).trim()
    }
    const startTime = new Date()
    let res: string
    let errored = false
    try {
      // eslint-disable-next-line no-eval
      res = await eval(toEval + ';')
    } catch (err) {
      errored = true
      res = err.toString()
    } finally {
      const endTime = new Date()
      const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000
  
      if (res.length === 0) {
        res = '[No Output]'
      }
  
      await msg.channel.createMessage({
        embed: {
          color: errored ? 0xec282c : 0x31ada9,
          description: `\`\`\`js\n${res}\n\`\`\``,
          footer: {
            text: `Took ${timeElapsed} seconds`
          },
          title: errored ? 'Eval threw exception' : 'Eval result'
        }
      })
    }
  }, {
    aliases: ['eval'],
    hidden: true
  })
}

export default {
  init
}
