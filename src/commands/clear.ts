import { PermissionString, TextChannel } from 'discord.js'

import { Command, CommandConfig } from '../types'

class Clear implements Command {
  private limit: number
  constructor(private commandConfig: CommandConfig) {
    this.limit = Number(commandConfig.messageArgs[1])
  }

  static named = 'clear'
  static aliases = ['c', 'cls']
  static description = 'Delete previous messages'
  static permissions: PermissionString[] = ['MANAGE_MESSAGES']
  static minArguments = 1
  static usage = 'clear [limit]'
  static example = 'clear 7'

  validator() {
    return this.limit < 0 || this.limit > 4096 || isNaN(this.limit)
      ? [
          ':red_circle: You not informed a valid value',
          ':red_circle: Use low numbers greater than zero',
        ]
      : []
  }

  async run() {
    const { embed, message } = this.commandConfig

    await (message.channel as TextChannel).bulkDelete(this.limit + 1)

    embed.setDescription(
      `:nazar_amulet: Deleted **${this.limit}** messages in this channel`
    )

    return embed
  }
}

export default Clear
