import { CommandClient } from 'eris'

export const bot = new CommandClient(process.env.TOKEN, {}, {
  prefix: process.env.PREFIX.split(','),
  owner: 'katlyn#9607',
  defaultHelpCommand: false
})

export const tokenizeArgs = (argumentString: string): string[] => {
  const args: string[] = []

  let current = ''
  let openQuote = ''
  for (const char of argumentString) {
    if (['"', "'"].includes(char)) {
      if (current[current.length - 1] === '\\') {
        current = current.replace(/.$/, char)
      } else if (openQuote === char) {
        args.push(current)
        openQuote = ''
        current = ''
      } else if (openQuote === '' && current.length === 0) {
        openQuote = char
      } else {
        current += char
      }
    } else if (char === ' ') {
      if (openQuote === '') {
        if (current.length > 0) {
          args.push(current)
          current = ''
        }
      } else {
        current += char
      }
    } else {
      current += char
    }
  }

  if (openQuote !== '') {
    throw Error('Unmatched quote')
  }

  if (current.length > 0) {
    args.push(current)
  }

  return args
}
