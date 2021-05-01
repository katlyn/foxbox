import { CommandClient } from 'eris'

import rainbow from './rainbow'
const init = (bot: CommandClient): void => {
  rainbow.init(bot)
}

export default {
  init
}
