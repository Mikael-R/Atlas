import { Command } from '../types'

const clear: Command = {
  name: 'clear',
  aliases: ['c'],
  description: 'Delete previous messages',
  permissions: ['MANAGE_MESSAGES'],
  minArguments: 1,
  usage: '$clear [limit]',
  example: '$clear 7',
  run: (message, embed, messageArgs) => {
    const description: string[] = []
    const limit = Number(messageArgs[1])

    if (limit < 2 || isNaN(limit)) {
      description.push(':nazar_amulet: You not informed a valid value')
      description.push(':nazar_amulet: Use numbers more than 1')
    } else {
      message.channel.messages
        .fetch({ limit: limit })
        .then(messageToDelete => message.channel.bulkDelete(messageToDelete))

      description.push(
        `:nazar_amulet: <@${message.author.id}> has deleted ${limit} messages`
      )
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  },
}

export default clear
