import { TextChannel, NewsChannel } from 'discord.js'

import { Command } from '../types'

const clear: Command = {
  name: 'clear',
  aliases: ['c', 'cls'],
  description: 'Delete previous messages',
  permissions: ['MANAGE_MESSAGES'],
  minArguments: 1,
  usage: '$clear [limit]',
  example: '$clear 7',
  run: async ({ message, embed, messageArgs }) => {
    const description: string[] = []

    const limit = Number(messageArgs[1])

    if (limit < 2 || limit > 9999 || isNaN(limit)) {
      description.push(':nazar_amulet: You not informed a valid value')
      description.push(
        ':nazar_amulet: Use numbers ​​greater than 1 and less than 9999'
      )
    } else {
      message.channel.messages
        .fetch({ limit: limit })
        .then(messageToDelete =>
          (message.channel as TextChannel | NewsChannel).bulkDelete(
            messageToDelete
          )
        )

      description.push(
        `:nazar_amulet: <@${message.author.id}> has deleted ${limit} messages`
      )
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  },
}

export default clear
