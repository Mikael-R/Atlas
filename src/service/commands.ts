import Discord from 'discord.js'

import * as Types from '@service/types'

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
    .addField('Name', userInformation.name, true)
    .addField('Discriminator', userInformation.discriminator, true)
    .addField('Status', userInformation.status, true)
    .addField('Bot', userInformation.isBot, true)
    .addField('Create Account', userInformation.createAccount, true)
    .addField('Joined', userInformation.joined, true)
    .addField('ID', userInformation.id, false)

  return embed
}

export const getServerInformation: Types.GetServerInformation = (embed, guild) => {
  const serverInformation: Types.ServerInformation = {
    name: guild.name,
    icon: guild.iconURL(),
    ownerNickname: guild.owner.displayName,
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
    .addField('Created', serverInformation.created, true)
    .addField('Region', serverInformation.region, true)
    .addField('Members', serverInformation.members, true)
    .addField('Premium Subscription Count', serverInformation.premiumSubscriptionCount, true)
    .addField('ID', serverInformation.id, false)

  return embed
}

export const addedOnServer: Types.AddedOnServer = (ownerNickname, serverName) => {
  const message: string[] = []

  message.push(`:robot: Hello ${ownerNickname}`)
  message.push(`:blue_heart: Thanks for add me on **${serverName}**`)
  message.push(':wrench: Entry on https://mikael-r.github.io/Atlas to view my commands')

  const embed = createEmbed('Atlas').setDescription(message.join('\n\n'))

  return embed
}

export const removedOnServer: Types.RemovedOnServer = (ownerNickname, serverName) => {
  const message: string[] = []

  message.push(`:robot: Hello ${ownerNickname}`)
  message.push(`:broken_heart: I was removed from server **${serverName}** and I expect helped you`)
  message.push(':leaves: Information about you server will be saved for 7 days, in case you add me again')
  message.push(':wrench: Entry on https://mikael-r.github.io/Atlas to view my commands')

  const embed = createEmbed('Atlas').setDescription(message.join('\n\n'))

  return embed
}
