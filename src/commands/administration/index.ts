import { CommandClient } from 'eris'

import configuration from './configuration'
import gangs from './gangs'
import reactionRoles from './reactionRoles'

const init = (bot: CommandClient): void => {
  configuration.init(bot)
  gangs.init(bot)
  reactionRoles.init(bot)
}

export default {
  init
}
