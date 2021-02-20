import { CommandClient } from 'eris'

import ascii from './ascii'
import owo from './owo'
import uwu from './uwu'

const init = (bot: CommandClient): void => {
  ascii.init(bot)
  owo.init(bot)
  uwu.init(bot)
}

export default {
  init
}
