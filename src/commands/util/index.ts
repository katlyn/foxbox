import { CommandClient } from 'eris'

import choose from './choose'
import color from './color'
import evaluate from './evaluate'
import help from './help'
import latex from './latex'
import wolfram from './wolfram'

const init = (bot: CommandClient): void => {
  choose.init(bot)
  color.init(bot)
  evaluate.init(bot)
  help.init(bot)
  latex.init(bot)
  wolfram.init(bot)
}

export default {
  init
}
