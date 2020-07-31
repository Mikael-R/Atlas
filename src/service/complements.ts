import { MessageEmbed } from 'discord.js'

import randInt from '@utils/randInt'

import {
  RandomizeStatus, Status, CreateEmbed, AddedOnServer, RemovedOnServer, InvalidCommand
} from 'src/types'

export const randomizeStatus: RandomizeStatus = (client) => {
  const status: Status = [
    { type: 'LISTENING', name: '$help' },
    { type: 'PLAYING', name: 'stone on the moon' },
    { type: 'STREAMING', name: 'love and happy' },
    { type: 'WATCHING', name: `${client.channels.cache.size} channels` }
  ]

  const index = randInt(0, status.length + 1)

  client.user.setActivity(status[index])
}

export const createEmbed: CreateEmbed = ({ title = '', color }) => {
  const embed = new MessageEmbed()
    .setTitle(title)
    .setColor(color)

  return embed
}

export const invalidCommand: InvalidCommand = (msg, embed, msgCommands) => {
  const message: string[] = []

  message.push(`:red_circle: Invalid command ${msgCommands[0] ? `**${msgCommands[0]}**` : ''}`)
  message.push(':red_circle: Use **$help** to view command list')

  embed.setColor('#E81010')
  embed.setDescription(message.join('\n\n'))

  msg.channel.send(embed)
}

export const addedOnServer: AddedOnServer = (embed, ownerNickname, serverName) => {
  const message: string[] = []

  message.push(`:robot: Hello **${ownerNickname}**`)
  message.push(`:blue_heart: Thanks for add me on **${serverName}**`)
  message.push(':wrench: Access https://mikael-r.github.io/Atlas to view my commands')

  embed.setDescription(message.join('\n\n'))

  return embed
}

export const removedOnServer: RemovedOnServer = (embed, ownerNickname, serverName) => {
  const message: string[] = []

  message.push(`:robot: Hello **${ownerNickname}**`)
  message.push(`:broken_heart: I was removed from server **${serverName}** and I expect helped you`)
  message.push(':leaves: Information about you server will be saved for 7 days, in case you add me again')
  message.push(':wrench: Access https://mikael-r.github.io/Atlas to view my commands')

  embed.setDescription(message.join('\n\n'))

  return embed
}
