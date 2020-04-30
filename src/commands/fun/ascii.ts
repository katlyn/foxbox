import { CommandClient } from 'eris'

const flip = (text: string): string => {
  let ret = ''
  for (const c of text) {
    if (typeof flipTable[c] === 'string') {
      ret += flipTable[c]
    } else {
      ret += c
    }
  }
  return ret.split('').reverse().join('')
}

export const init = (bot: CommandClient): void => {
  bot.registerCommand('illdoit', () => {
    return '(ノ゜-゜ )ノ ┬─┬'
  }, {
    hidden: true
  })
  bot.registerCommand('riot', () => {
    return '┻━┻︵ \\\\(°□°)/ ︵ ┻━┻'
  }, {
    hidden: true
  })
  bot.registerCommand('unriot', () => {
    return '┬─┬ ᓕ (°w°) ᘄ ┬─┬'
  }, {
    hidden: true
  })
  bot.registerCommand('flip', msg => {
    const text = msg.cleanContent.substring(msg.prefix.length + 'flip'.length).trim()
    return `\`(╯°□°）╯︵ ${flip(text)}\``
  }, {
    hidden: true
  })
  bot.registerCommand('unflip', msg => {
    const text = msg.cleanContent.substring(msg.prefix.length + 'unflip'.length).trim()
    return `\`${text} ノ( ゜-゜ノ)\``
  }, {
    hidden: true
  })

  bot.registerCommand('ascii', () => {
    return 'ASCII commands\n' +
      '**`illdoit`** - I will, mark my words, I\'ll do it.\n' +
      '**`riot`** - I did it, and there\'s nothing you could have done to stop me.\n' +
      '**`unriot`** - Let\'s just forget that I ever did that.\n' +
      '**`flip`** - Everything\'s going wrong.\n' +
      '**`unflip`** - But maybe we found a solution.'
  }, {
    description: 'Information on the various ASCII commands.'
  })
}

interface FlipTable { [key: string]: string }
/* eslint-disable */
const flipTable: FlipTable = {
  '0': '0',
  '1': 'Ɩ',
  '2': 'ᄅ',
  '3': 'Ɛ',
  '4': 'ㄣ',
  '5': 'ϛ',
  '6': '9',
  '7': 'ㄥ',
  '8': '8',
  '9': '6',
  'a': 'ɐ',
  'b': 'q',
  'c': 'ɔ',
  'd': 'p',
  'e': 'ǝ',
  'f': 'ɟ',
  'g': 'ƃ',
  'h': 'ɥ',
  'i': 'ᴉ',
  'j': 'ɾ',
  'k': 'ʞ',
  'm': 'ɯ',
  'n': 'u',
  'p': 'd',
  'q' : 'b',
  'r': 'ɹ',
  't': 'ʇ',
  'u': 'n',
  'v': 'ʌ',
  'w': 'ʍ',
  'y': 'ʎ',
  'A': '∀',
  'C': 'Ɔ',
  'E': 'Ǝ',
  'F': 'Ⅎ',
  'G': 'פ',
  'H': 'H',
  'I': 'I',
  'J': 'ſ',
  'L': '˥',
  'M': 'W',
  'N': 'N',
  'P': 'Ԁ',
  'T': '┴',
  'U': '∩',
  'V': 'Λ',
  'W': 'M',
  'Y': '⅄',
  '.': '˙',
  ',': "'", 
  "'": ',',
  '"': ',,',
  '`': ',',
  '?': '¿',
  '!': '¡',
  '[': ']',
  ']': '[',
  '(': ')',
  ')': '(',
  '{': '}',
  '}': '{',
  '<': '>',
  '>': '<',
  '&': '⅋',
  '_': '‾',
  '∴': '∵',
  '⁅': '⁆'
}
/* eslint-enable */

export default {
  init
}
