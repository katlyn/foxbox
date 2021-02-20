import { CommandClient } from 'eris'

import administration from './administration'
import fun from './fun'
import util from './util'

const init = (bot: CommandClient): void => {
  administration.init(bot)
  fun.init(bot)
  util.init(bot)
}

export default {
  init
}
