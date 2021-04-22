import { CommandClient } from 'eris'

import configuration from './configuration'
import gangs from './gangs'

const init = (bot: CommandClient): void => {
  configuration.init(bot)
  gangs.init(bot)
}

export default {
  init
}
