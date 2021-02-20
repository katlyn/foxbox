import { CommandClient } from 'eris'

import gangs from './gangs'

const init = (bot: CommandClient): void => {
  gangs.init(bot)
}

export default {
  init
}
