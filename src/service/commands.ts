import Discord from 'discord.js'

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
  if (!existPreference(command[2])) {
    embed.setDescription(`:purple_circle: O parâmetro "${command[2]}" não existe`)
  }
  else {
    updatePreference(command[2], command[3])
    embed.setDescription(`:purple_circle: Alterado: **${command[2]}** para "${command[3]}"`)
  }

  return embed
}

export {
  createEmbed,
  ping,
  invalidCommand,
  changePreference
}
