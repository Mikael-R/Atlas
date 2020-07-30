import Discord from 'discord.js'

import {
  Command, RandomizeStatus, Status, CreateEmbed, InvalidCommand, Ping, Clear,
  GetUserInformation, GetServerInformation, UserInformation, ServerInformation,
  Help, AddedOnServer, RemovedOnServer
} from 'src/types'

import randInt from '@utils/randInt'

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
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)

  return embed
}

export const invalidCommand: InvalidCommand = (embed, command) => {
  const message: string[] = []

  message.push(`:red_circle: Invalid command ${command ? `**${command}**` : ''}`)
  message.push(':red_circle: Use **$help** to view command list')

  embed.setColor('#E81010')
  embed.setDescription(message.join('\n\n'))

  return embed
}

export const help: Command<Help> = {
  aliases: ['help', 'h'],
  description: 'Show commands or more information about specific command',
  usage: '$help [command or empty to view list]',
  example: '$help ping',
  run: (embed, command) => {
    const message: string[] = []

    if (!command) {
      message.push(':nazar_amulet: Use ``$help [command]`` to view more information about specific command')

      embed.addField('$ping', 'Show bot and API ping in milliseconds')
      embed.addField('$clear', 'Delete specified previous messages')
      embed.addField('$userinformation', 'Show information about you or user mentioned')
      embed.addField('$serverinformation', 'Show information about this server')
    } else {
      embed.addField('Command', command.aliases[0])
      embed.addField('Aliases', command.aliases.toString())
      embed.addField('Description', command.description)
      embed.addField('Usage', command.usage)
      if (command.example) embed.addField('Example', command.example)
    }

    embed.setDescription(message.join('\n\n'))

    return embed
  }
}

export const clear: Command<Clear> = {
  aliases: ['clear', 'c'],
  description: 'Delete specified previous messages',
  usage: '$clear [limit]',
  example: '$clear 7',
  run: (embed, msg, limit) => {
    const message: string[] = []

    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      message.push(':red_circle: You not have permission to run this command')
      embed.setColor('#E81010')
    } else if (!limit || Number(limit) < 2 || isNaN(Number(limit))) {
      message.push(':nazar_amulet: You not informed a valid value')
      message.push(':nazar_amulet: Use ***** to clear all messages')
    } else {
      msg.channel.messages.fetch({ limit: limit === '*' ? undefined : Number(limit) })
        .then(message => msg.channel.bulkDelete(message))

      message.push(`:nazar_amulet: <@${msg.author.id}> has deleted ${limit === '*' ? 'all' : limit} messages`)
    }

    embed.setDescription(message.join('\n\n'))

    return embed
  }
}

export const ping: Command<Ping> = {
  aliases: ['ping', 'p'],
  description: 'Delete specified previous messages',
  usage: '$ping',
  run: (embed, ws, msg) => {
    const message: string[] = []

    message.push(':ping_pong: Pong!')
    message.push(`:nazar_amulet: Server: ${Date.now() - msg.createdTimestamp}ms`)
    message.push(`:nazar_amulet: Api: ${ws.ping}ms`)

    embed.setDescription(message.join('\n\n'))

    return embed
  }
}

export const getUserInformation: Command<GetUserInformation> = {
  aliases: ['userinformation', 'userinfo', 'usinfo'],
  description: 'Show information about you or user mentioned',
  usage: '$userinfo [user mention or empty for you]',
  example: '$userinfo @Atlas',
  run: (embed, msg) => {
    const user = msg.mentions.users.first() || msg.author

    const userInformation: UserInformation = {
      tag: user.tag,
      avatar: user.displayAvatarURL(),
      status: user.presence.status,
      isBot: user.bot ? 'Yes' : 'No',
      createAccount: user.createdAt.toUTCString(),
      joined: msg.guild.members.resolve(user.id).joinedAt.toUTCString(),
      roles: msg.guild.members.resolve(user.id).roles.cache,
      id: user.id
    }

    embed
      .setTitle('')
      .setDescription(user)
      .setAuthor(userInformation.tag, userInformation.avatar)
      .setThumbnail(userInformation.avatar)
      .addField('Create Account', userInformation.createAccount)
      .addField('Joined', userInformation.joined)
      .addField('Status', userInformation.status, true)
      .addField('Bot', userInformation.isBot, true)
      .addField(`Roles [${userInformation.roles.size}]`, (() => {
        const format = ['']
        userInformation.roles.map(role => format.push(`<@&${role.id}>`))
        return format.join('  ')
      })())
      .setFooter(`ID: ${userInformation.id}`)

    return embed
  }
}

export const getServerInformation: Command<GetServerInformation> = {
  aliases: ['serverinformation', 'serverinfo', 'svinfo'],
  description: 'Show information about this server',
  usage: '$serverinformation',
  run: (embed, guild) => {
    const serverInformation: ServerInformation = {
      name: guild.name,
      icon: guild.iconURL(),
      ownerNickname: guild.owner.user.tag,
      created: guild.createdAt.toUTCString(),
      region: guild.region,
      members: guild.memberCount,
      channels: guild.channels.cache.size,
      premiumSubscriptionCount: guild.premiumSubscriptionCount,
      id: guild.id
    }
    embed
      .setTitle('')
      .setAuthor(serverInformation.name)
      .setThumbnail(serverInformation.icon)
      .addField('Owner', serverInformation.ownerNickname)
      .addField('Created', serverInformation.created)
      .addField('Region', serverInformation.region, true)
      .addField('Members', serverInformation.members, true)
      .addField('Channels', serverInformation.channels, true)
      .addField('Premium Subscription Count', serverInformation.premiumSubscriptionCount)
      .setFooter(`ID: ${serverInformation.id}`)

    return embed
  }
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
