import { Command, CommandConfig } from '@src/types'
import { PermissionString, TextChannel } from 'discord.js'

class Clear implements Command {
  private limit: number
  constructor(private commandConfig: CommandConfig) {
    this.limit = Number(commandConfig.messageArgs[1]) || -1
  }

  static commandName = 'clear'
  static aliases = ['c', 'cls']
  static description = 'Delete previous messages'
  static permissions = {
    client: ['MANAGE_MESSAGES'] as PermissionString[],
    user: ['MANAGE_MESSAGES'] as PermissionString[],
  }

  static minArguments = 1
  static usage = 'clear [limit]'
  static example = 'clear 7'

  validator() {
    return this.limit <= 0 || this.limit > 1024
      ? [
          ':red_circle: You not informed a valid value',
          ':red_circle: Use low numbers greater than zero',
        ]
      : []
  }

  async run() {
    const {
      commandConfig: { embed, message },
      limit,
    } = this

    const description: string[] = []

    await (message.channel as TextChannel)
      .bulkDelete(limit + 1)
      .then(() =>
        description.push(
          `:nazar_amulet: Deleted **${limit}** messages in this channel`
        )
      )
      .catch(error => {
        console.error(error)
        embed.setDescription(
          ':red_circle: An error occurred while clear messages'
        )
        embed.setColor('#E81010')
      })

    embed.setDescription(description.join('\n\n'))

    return embed
  }
}

export default Clear
