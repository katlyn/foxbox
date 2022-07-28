import { InteractionContext } from 'detritus-client/lib/interaction'
import { BaseSlashCommand } from '../base'

export default class BotInfo extends BaseSlashCommand {
  description = 'General information about the bot'
  name = 'botinfo'

  async run (context: InteractionContext): Promise<void> {
    await context.editOrRespond({
      embed: {
        title: 'Raidbot Info',
        description: 'Created by katlyn#9607.',
        timestamp: new Date().toISOString(),
        fields: [
          {
            // TODO: Make this actually report an accurate version
            name: 'Version',
            value: '`TODO`',
            inline: true
          },
          {
            name: 'Guilds',
            value: context.client.guilds.size.toString(),
            inline: true
          },
          {
            // TODO: Replace with data from database
            name: 'Users',
            value: context.client.users.size.toString(),
            inline: true
          },
          {
            // TODO: Replace with data from database
            name: 'Raids',
            value: '12345',
            inline: true
          },
          {
            name: 'Memory Usage',
            value: Math.round(process.memoryUsage().rss / 1024 / 1024).toString() + 'MB',
            inline: true
          }
        ]
      }
    })
  }
}
