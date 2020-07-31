import { MessageEmbed } from 'discord.js'

import randInt from '@utils/randInt'

import { RandomizeStatus, Status, CreateEmbed, OnServer, InvalidCommand } from 'src/types'

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

export const invalidCommand: InvalidCommand = (message, embed, msgCommands) => {
  const description: string[] = []

  description.push(`:red_circle: Invalid command ${msgCommands[0] ? `**${msgCommands[0]}**` : ''}`)
  description.push(':red_circle: Use **$help** to view command list')

  embed.setColor('#E81010')
  embed.setDescription(description.join('\n\n'))

  message.channel.send(embed)
}

export const addedOnServer: OnServer = (guild, embed) => {
  const description: string[] = []

  description.push(`:robot: Hello **${guild.owner.displayName}**`)
  description.push(`:blue_heart: Thanks for add me on **${guild.name}**`)
  description.push(':nazar_amulet: Use $help on server to view my commands')
  description.push(':mag_right: Access https://mikael-r.github.io/Atlas to more information about me')

  embed.setDescription(description.join('\n\n'))

  guild.owner.send(embed)
}

export const removedOnServer: OnServer = (guild, embed) => {
  const description: string[] = []

  description.push(`:robot: Hello **${guild.owner.displayName}**`)
  description.push(`:broken_heart: I was removed from server **${guild.name}** and I expect helped you`)
  description.push(':leaves: I will remember your server for 7 days, in case you add me again')
  description.push(':nazar_amulet: Use $help on server to view my commands')
  description.push(':mag_left: Access https://mikael-r.github.io/Atlas to more information about me')

  embed.setDescription(description.join('\n\n'))

  guild.owner.send(embed)
}
