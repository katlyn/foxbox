import { GatewayClientEvents } from 'detritus-client'
import { ClientEvents } from 'detritus-client/lib/constants'

import client from './bot'

export const BOT_ADMINS = ['250322741406859265']

const TIMEOUT = 12e4 // two minutes

type FilterFunction = (d: GatewayClientEvents.MessageReactionAdd) => boolean
export class ReactionError extends Error {}
export const getReaction = async (filter: FilterFunction): Promise<GatewayClientEvents.MessageReactionAdd> => {
  return await new Promise((resolve, reject) => {
    const listener = (
      payload: GatewayClientEvents.MessageReactionAdd
    ): void => {
      if (filter(payload)) {
        client.off(ClientEvents.MESSAGE_REACTION_ADD, listener)
        clearTimeout(timeout)
        resolve(payload)
      }
    }

    const timeout = setTimeout(() => {
      client.off(ClientEvents.MESSAGE_REACTION_ADD, listener)
      reject(new ReactionError('timeout'))
    }, TIMEOUT)

    client.on(ClientEvents.MESSAGE_REACTION_ADD, listener)
  })
}
