import { Collection, Message, PermissionString, TextChannel } from 'discord.js'

import { Command, CommandConfig } from '../../types'

class Clear implements Command {
  private limit: number
  private messagesToDelete: Promise<Collection<string, Message>>

  constructor(private commandConfig: CommandConfig) {
    const { channel } = commandConfig.message

    this.limit = Number(commandConfig.messageArgs[1])

    this.messagesToDelete = (channel as TextChannel).messages.fetch({
      limit: this.limit + 1,
    })
  }

  static commandName = 'clear'
  static aliases = ['c', 'cls']
  static description = 'Delete previous messages'
  static permissions: PermissionString[] = ['MANAGE_MESSAGES']
  static minArguments = 1
  static usage = 'clear [limit]'
  static example = 'clear 7'

  validator() {
    return this.limit <= 0 || this.limit > 1024 || isNaN(this.limit)
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
      messagesToDelete,
    } = this

    const description: string[] = []

    await (message.channel as TextChannel)
      .bulkDelete(await messagesToDelete)
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
