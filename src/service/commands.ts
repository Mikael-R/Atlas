import Discord from 'discord.js'

import * as Types from '@service/types'

export const randomizeStatus: Types.RandomizeStatus = (client) => {
  const status: Types.Status = [
    { type: 'LISTENING', name: '$ help' },
    { type: 'PLAYING', name: 'stone on the moon' },
    { type: 'STREAMING', name: 'love and happy' },
    { type: 'WATCHING', name: `${client.channels.cache.size} channels` }
  ]

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max + 1)

    return Math.floor(Math.random() * (max - min)) + min
  }

  const index = getRandomInt(0, status.length)

  client.user.setActivity(status[index])
}

export const createEmbed: Types.CreateEmbed = (title) => {
  return new Discord.MessageEmbed().setTitle(title).setColor('#3B3B98')
}

export const invalidCommand: Types.InvalidCommand = (embed, command) => {
  const message: string[] = []

  message.push(`:blue_circle: Invalid command ${command ? `**${command}**` : ''}`)
  message.push(':blue_circle: Use **$ help** to view command list')

  embed.setDescription(message.join('\n\n'))

  return embed
}

export const help: Types.Help = (embed) => {
  const message: string[] = []

  message.push(':blue_circle: To view more information about command or all commands access: https://mikael-r.github.io/Atlas')

  embed.addField('$ ping', 'Show bot and API ping in milliseconds')
  embed.addField('$ userinfo', 'Show information about you or user mentioned')
  embed.addField('$ serverinfo', 'Show information about this server')
  embed.addField('$ clear', 'Delete specified previous messages')

  embed.setDescription(message.join('\n\n'))

  return embed
}

export const deleteMessages: Types.DeleteMessages = (embed, msg, limit) => {
  const message: string[] = []

  if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
    message.push(':blue_circle: You not have permission to run this command')
  } else if (!limit || Number(limit) < 2 || isNaN(Number(limit))) {
    message.push(':blue_circle: You not informed a limit or is invalid value')
    message.push(':blue_circle: Use ***** to clear all messages')
  } else {
    msg.channel.messages.fetch({ limit: limit === '*' ? undefined : Number(limit) })
      .then(message => msg.channel.bulkDelete(message))

    message.push(`:blue_circle: <@${msg.author.id}> has deleted ${limit === '*' ? 'all' : limit} messages`)
  }

  embed.setDescription(message.join('\n\n'))

  return embed
}

export const ping: Types.Ping = (embed, ws, msg) => {
  const message: string[] = []

  message.push(':ping_pong: Pong!')
  message.push(`:blue_circle: Server: ${Date.now() - msg.createdTimestamp}ms`)
  message.push(`:blue_circle: Api: ${ws.ping}ms`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

export const getUserInformation: Types.GetUserInformation = (embed, msg) => {
  const user = msg.mentions.users.first() || msg.author

  const userInformation: Types.UserInformation = {
    tag: user.tag,
    avatar: user.displayAvatarURL(),
    name: user.username,
    discriminator: `#${user.discriminator}`,
    status: user.presence.status,
    isBot: user.bot ? 'Yes' : 'No',
    createAccount: user.createdAt.toLocaleDateString('en-US'),
    joined: msg.guild.members.resolve(user.id).joinedAt.toLocaleDateString('en-US'),
    id: user.id
  }

  embed
    .setAuthor(userInformation.tag, userInformation.avatar)
    .setThumbnail(userInformation.avatar)
    .addField('Name', userInformation.name)
    .addField('Discriminator', userInformation.discriminator)
    .addField('Status', userInformation.status)
    .addField('Bot', userInformation.isBot)
    .addField('Create Account', userInformation.createAccount)
    .addField('Joined', userInformation.joined)
    .addField('ID', userInformation.id, false)

  return embed
}

export const getServerInformation: Types.GetServerInformation = (embed, guild) => {
  const serverInformation: Types.ServerInformation = {
    name: guild.name,
    icon: guild.iconURL(),
    ownerNickname: guild.owner.user.tag,
    created: guild.createdAt.toLocaleDateString('en-US'),
    region: guild.region,
    members: guild.memberCount,
    premiumSubscriptionCount: guild.premiumSubscriptionCount,
    id: guild.id
  }

  embed
    .setTitle('')
    .setAuthor(serverInformation.name)
    .setThumbnail(serverInformation.icon)
    .addField('Owner', serverInformation.ownerNickname)
    .addField('Created', serverInformation.created)
    .addField('Region', serverInformation.region)
    .addField('Members', serverInformation.members)
    .addField('Premium Subscription Count', serverInformation.premiumSubscriptionCount)
    .addField('ID', serverInformation.id, false)

  return embed
}

export const addedOnServer: Types.AddedOnServer = (ownerNickname, serverName) => {
  const embed = createEmbed('')
  const message: string[] = []

  message.push(`:robot: Hello **${ownerNickname}**`)
  message.push(`:blue_heart: Thanks for add me on **${serverName}**`)
  message.push(':wrench: Access https://mikael-r.github.io/Atlas to view my commands')

  embed.setDescription(message.join('\n\n'))

  return embed
}

export const removedOnServer: Types.RemovedOnServer = (ownerNickname, serverName) => {
  const embed = createEmbed('')
  const message: string[] = []

  message.push(`:robot: Hello **${ownerNickname}**`)
  message.push(`:broken_heart: I was removed from server **${serverName}** and I expect helped you`)
  message.push(':leaves: Information about you server will be saved for 7 days, in case you add me again')
  message.push(':wrench: Access https://mikael-r.github.io/Atlas to view my commands')

  embed.setDescription(message.join('\n\n'))

  return embed
}
