import Discord from 'discord.js'

// eslint-disable-next-line no-unused-vars
import * as Types from '@service/types'

import replaceAll from '@utils/replaceAll'
import { existPreference, updatePreference } from '@service/preferences'

const createEmbed: Types.CreateEmbed = (title, color) => {
  return new Discord.MessageEmbed().setTitle(title).setColor(color)
}

const invalidCommand: Types.InvalidCommand = (embed, flag) => {
  const message: Array<string> = []

  message.push(':purple_circle: Invalid command.')
  message.push(`:purple_circle: Use **${flag} help** to view command list.`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

const ping: Types.Ping = (embed, msg, client) => {
  const message: Array<string> = []

  message.push(':ping_pong: Pong!')
  message.push(`:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms`)
  message.push(`:purple_circle: Api: ${client.ws.ping}ms`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

const changePreference: Types.ChangePreference = (embed, command) => {
  if (!command[2] || !command[3]) {
    embed.setDescription(':purple_circle: Parameter not informed')
  } else if (!existPreference(command[2])) {
    embed.setDescription(`:purple_circle: Parameter "${command[2]}" not found`)
  } else {
    const newValue: string = command.join(' ').match(/('|")(.*)('|")/)
      ? replaceAll(command.join(' ').match(/('|")(.*)('|")/)[0], ['\'', '"'], '')
      : command[3]

    updatePreference(command[2], newValue)
    embed.setDescription(`:purple_circle: Changed: **${command[2]}** to **${newValue}**`)
  }

  return embed
}

const getUserInformation: Types.GetUserInformation = (embed, msg) => {
  const user = msg.mentions.users.first() || msg.author

  const userInformation: Types.UserInformation = {
    tag: user.tag,
    name: user.username,
    discriminator: `#${user.discriminator}`,
    avatar: user.displayAvatarURL(),
    isBot: user.bot ? 'Yes' : 'No',
    id: user.id,
    status: user.presence.status,
    createAccount: user.createdAt.toLocaleDateString('en-US'),
    joined: msg.guild.members.resolve(user.id).joinedAt.toLocaleDateString('en-US')
  }

  embed
    .setAuthor(userInformation.tag, userInformation.avatar)
    .setThumbnail(userInformation.avatar)
    .addField('Name', userInformation.name, true)
    .addField('Discriminator', userInformation.discriminator, true)
    .addField('Status', userInformation.status, true)
    .addField('Bot', userInformation.isBot, true)
    .addField('Create Account', userInformation.createAccount, true)
    .addField('Joined', userInformation.joined, true)
    .addField('ID', userInformation.id, false)

  return embed
}

export {
  createEmbed,
  ping,
  invalidCommand,
  changePreference,
  getUserInformation
}
