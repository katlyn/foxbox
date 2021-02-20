import { CommandClient } from 'eris'

import reactionPins from './reactionPins'

const init = (bot: CommandClient): void => {
  reactionPins.init(bot)
}

export default {
  init
}
