import { PermissionString, TextChannel } from 'discord.js'

import { Command, RunConfig } from '../types'

class Clear implements Command {
  name = 'clear'
  aliases = ['c', 'cls']
  description = 'Delete previous messages'
  permissions: PermissionString[] = ['MANAGE_MESSAGES']
  minArguments = 1
  usage = 'clear [limit]'
  example = 'clear 7'
  async run({ message, embed, messageArgs }: RunConfig) {
    const description: string[] = []

    const limit = Number(messageArgs[1])

    if (limit < 0 || limit > 4096 || isNaN(limit)) {
      description.push(':nazar_amulet: You not informed a valid value')
      description.push(':nazar_amulet: Use low numbers greater than zero')
    } else {
      await (message.channel as TextChannel).bulkDelete(limit + 1)

      description.push(
        `:nazar_amulet: <@${message.author.id}> has deleted **${limit}** messages`
      )
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  }
}

export default Clear
