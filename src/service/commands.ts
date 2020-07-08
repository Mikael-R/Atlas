import Discord from 'discord.js'

import replaceAll from '@utils/replaceAll'
import { existPreference, updatePreference } from '@service/preferences'

const createEmbed = (title: string, color: string) => {
  return new Discord.MessageEmbed().setTitle(title).setColor(color)
}

const invalidCommand = (embed: Discord.MessageEmbed, flag: string) => {
  const message: Array<string> = []

  message.push(':purple_circle: Comando inválido.')
  message.push(`:purple_circle: Use **${flag} ajuda** para ver a lista de comandos.`)

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
    embed.setDescription(`:purple_circle: O parâmetro não foi informado`)
  }
  else if (!existPreference(command[2])) {
    embed.setDescription(`:purple_circle: O parâmetro "${command[2]}" não existe`)
  }
  else {
    let newValue: string = command.join(' ').match(/('|")(.*)('|")/)
      ? command.join(' ').match(/('|")(.*)('|")/)[0]
      : command[3]

    newValue = replaceAll(newValue, ['\'', '\"'], '')

    updatePreference(command[2], newValue)
    embed.setDescription(`:purple_circle: Alterado: **${command[2]}** para "${newValue}"`)
  }

  return embed
}

export {
  createEmbed,
  ping,
  invalidCommand,
  changePreference
}
