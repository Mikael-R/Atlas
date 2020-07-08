import Discord from 'discord.js'

import { existPreference, updatePreference } from '@service/preferences'

const createEmbed = (title: string, color: string) => {
  return new Discord.MessageEmbed().setTitle(title).setColor(color)
}

const invalidCommand = (embed: Discord.MessageEmbed, flag: string) => {
  const message: Array<string> = []

  message.push(':purple_circle: Invalid command.')
  message.push(`:purple_circle: Use **${flag} help** to view command list.`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

const ping = (
  embed: Discord.MessageEmbed,
  msg: Discord.Message,
  client: Discord.Client
) => {
  const message: Array<string> = []

  message.push(':ping_pong: Pong!')
  message.push(`:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms`)
  message.push(`:purple_circle: Api: ${client.ws.ping}ms`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

const changePreference = (embed: Discord.MessageEmbed, command: Array<string>) => {
  if (!command[2] || !command[3]) {
    embed.setDescription(':purple_circle: Parameter not informed')
  } else if (!existPreference(command[2])) {
    embed.setDescription(`:purple_circle: Parameter "${command[2]}" not found`)
  } else {
    const newValue: string = command.join(' ').match(/('|")(.*)('|")/)
      ? command.join(' ').match(/('|")(.*)('|")/)[0].replaceAll(['\'', '"'], '')
      : command[3]

    updatePreference(command[2], newValue)
    embed.setDescription(`:purple_circle: Changed: **${command[2]}** to **${newValue}**`)
  }

  return embed
}

export {
  createEmbed,
  ping,
  invalidCommand,
  changePreference
}
