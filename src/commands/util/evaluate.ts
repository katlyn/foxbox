import { CommandClient, Message } from 'eris'

function * arrayIterator <T> (items: T[]): Generator<T, T> {
  while (true) {
    for (const item of items) {
      yield item
    }
  }
}

const deniedStrings = arrayIterator([
  'sorry you\'re too cute to run this command',
  '<a:ablobcatcoffee:636641712860823562>',
  'uwu',
  '<:heck:775991013491212309>',
  'heck u',
  '<:aaaaa:775988449886863390>',
  'no',
  '<a:AYAYAsmile:722484198870482980>'
])

export const init = (bot: CommandClient): void => {
  bot.registerCommand('evaluate', async (msg: Message, args: string[]): Promise<void> => {
    const isTyping = msg.channel.sendTyping()
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

      if (res === undefined || String(res).length === 0) {
        res = '[No Output]'
      }
      await isTyping
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
    usage: 'utility',
    requirements: {
      userIDs: ['250322741406859265']
    },
    permissionMessage: () => deniedStrings.next().value
  })
}

export default {
  init
}
