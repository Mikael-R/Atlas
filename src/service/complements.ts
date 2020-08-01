import { MessageEmbed } from 'discord.js'

import randInt from '@utils/randInt'

import { RandomizeStatus, Status, CreateEmbed, OnServer, CallingCommand, TestCallingCommand } from 'src/types'

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

export const callingCommand: CallingCommand = (message, messageArgs) => {
  if (!messageArgs[0].startsWith('$') || messageArgs[0] === '$' || message.channel.type === 'dm' || message.author.bot) {
    return false
  }

  return true
}

export const testCallingCommand: TestCallingCommand = (embed, command, messageArgs, userPermissions) => {
  const description: string[] = []

  if (command) {
    if ((messageArgs.length - 1) < command.minArguments) { // (messageArgs.length - 1) because first value its call command ;-;)
      description.push(':red_circle: Need arguments')
      description.push(`:red_circle: **${command.usage}**`)
    }

    const needPermissions = command.permissions.filter(perm => userPermissions.indexOf(perm) === -1)

    if (needPermissions.length) {
      description.push(`:red_circle: Need permissions: ${needPermissions.toString().split('_').join(' ')}`)
    }
  } else {
    description.push(`:red_circle: Command not exists: ${messageArgs[0] ? `**${messageArgs[0]}**` : ''}`)
  }

  const passed = description.length === 0

  if (!passed) {
    description.push(':red_circle: Use **$help** to view command list')

    embed.setColor('#E81010')
  }

  embed.setDescription(description.join('\n\n'))

  return { embed, passed }
}

export const addedOnServer: OnServer = (embed, ownerName, serverName) => {
  const description: string[] = []

  description.push(`:robot: Hello **${ownerName}**`)
  description.push(`:blue_heart: Thanks for add me on **${serverName}**`)
  description.push(':nazar_amulet: Use $help on server to view my commands')
  description.push(':mag_right: Access https://mikael-r.github.io/Atlas to more information about me')

  embed.setDescription(description.join('\n\n'))

  return embed
}

export const removedOnServer: OnServer = (embed, ownerName, serverName) => {
  const description: string[] = []

  description.push(`:robot: Hello **${ownerName}**`)
  description.push(`:broken_heart: I was removed from server **${serverName}** and I expect helped you`)
  description.push(':leaves: I will remember your server for 7 days, in case you add me again')
  description.push(':nazar_amulet: Use $help on server to view my commands')
  description.push(':mag_left: Access https://mikael-r.github.io/Atlas to more information about me')

  embed.setDescription(description.join('\n\n'))

  return embed
}
