import { Command } from 'src/types'

const ping: Command = {
  name: 'ping',
  aliases: ['p'],
  description: 'Show bot ping in milliseconds on send message',
  minArguments: 0,
  usage: '$ping',
  run: (message, embed, messageArgs) => {
    const description = []

    description.push(':ping_pong: Pong!')
    description.push(
      `:nazar_amulet: **${Date.now() - message.createdTimestamp}ms**`
    )

    embed.setDescription(description.join('\n\n'))

    return embed
  },
}

export default ping
