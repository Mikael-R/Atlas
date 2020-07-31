import * as Commands from '@service/commands'

import { Command, UserInformation, ServerInformation } from 'src/types'

const help: Command = {
  name: 'help',
  aliases: ['h'],
  description: 'Show commands or more information about specific command',
  usage: '$help [command or empty to view list]',
  example: '$help ping',
  run: (message, embed, msgCommands) => {
    const description: string[] = []

    const command: Command = Commands.default.filter(cmd => cmd.name === msgCommands[1] || cmd.aliases.indexOf(msgCommands[1]) !== -1)[0]

    if (!command) {
      description.push(':nazar_amulet: Use ``$help [command]`` to view more information about specific command')

      Commands.default.map(cmd => embed.addField(cmd.name, cmd.description))
    } else {
      embed.addField('Name', command.name)
      embed.addField('Aliases', command.aliases.toString())
      embed.addField('Description', command.description)
      embed.addField('Usage', command.usage)
      if (command.example) embed.addField('Example', command.example)
    }

    embed.setDescription(description.join('\n\n'))

    message.channel.send(embed)
  }
}

const clear: Command = {
  name: 'clear',
  aliases: ['c'],
  description: 'Delete previous messages',
  usage: '$clear [limit]',
  example: '$clear 7',
  run: (message, embed, msgCommands) => {
    const description: string[] = []
    const limit = msgCommands[1]

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      description.push(':red_circle: You not have permission to run this command')
      embed.setColor('#E81010')
    } else if (!limit || Number(limit) < 2 || isNaN(Number(limit))) {
      description.push(':nazar_amulet: You not informed a valid value')
      description.push(':nazar_amulet: Use ***** to clear all messages')
    } else {
      message.channel.messages.fetch({ limit: limit === '*' ? undefined : Number(limit) })
        .then(messageToDelete => message.channel.bulkDelete(messageToDelete))

      description.push(`:nazar_amulet: <@${message.author.id}> has deleted ${limit === '*' ? 'all' : limit} descriptions`)
    }

    embed.setDescription(description.join('\n\n'))

    message.channel.send(embed)
  }
}

const ping: Command = {
  name: 'ping',
  aliases: ['p'],
  description: 'Show bot ping in milliseconds on send message',
  usage: '$ping',
  run: (message, embed, msgCommands) => {
    const description: string[] = []

    description.push(':ping_pong: Pong!')
    description.push(`:nazar_amulet: **${Date.now() - message.createdTimestamp}ms**`)

    embed.setDescription(description.join('\n\n'))

    message.channel.send(embed)
  }
}

const userinformation: Command = {
  name: 'userinformation',
  aliases: ['userinfo', 'usinfo'],
  description: 'Show information about you or user mentioned',
  usage: '$userinfo [user mention or empty for you]',
  example: '$userinfo @Atlas',
  run: (message, embed, msgCommands) => {
    const user = message.mentions.users.first() || message.author

    const userInformation: UserInformation = {
      tag: user.tag,
      avatar: user.displayAvatarURL(),
      status: user.presence.status,
      isBot: user.bot ? 'Yes' : 'No',
      createAccount: user.createdAt.toUTCString(),
      joined: message.guild.members.resolve(user.id).joinedAt.toUTCString(),
      roles: message.guild.members.resolve(user.id).roles.cache,
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

    message.channel.send(embed)
  }
}

const serverinformation: Command = {
  name: 'serverinformation',
  aliases: ['serverinfo', 'svinfo'],
  description: 'Show information about this server',
  usage: '$serverinformation',
  run: (message, embed, msgCommands) => {
    const serverInformation: ServerInformation = {
      name: message.guild.name,
      icon: message.guild.iconURL(),
      ownerNickname: message.guild.owner.user.tag,
      created: message.guild.createdAt.toUTCString(),
      region: message.guild.region,
      members: message.guild.memberCount,
      channels: (() => {
        const existingChannels = message.guild.channels.cache.filter(channel => channel.deleted === false && channel.type !== 'category')
        return existingChannels.size
      })(),
      premiumSubscriptionCount: message.guild.premiumSubscriptionCount,
      id: message.guild.id
    }

    embed
      .setTitle('')
      .setAuthor(serverInformation.name)
      .setThumbnail(serverInformation.icon)
      .addField('Owner', serverInformation.ownerNickname)
      .addField('Created', serverInformation.created)
      .addField('Region', serverInformation.region, true)
      .addField('Members', serverInformation.members, true)
      .addField('Channels', (serverInformation.channels), true)
      .addField('Premium Subscription Count', serverInformation.premiumSubscriptionCount)
      .setFooter(`ID: ${serverInformation.id}`)

    message.channel.send(embed)
  }
}

const serviceCommands = [
  help,
  clear,
  ping,
  userinformation,
  serverinformation
]

export default serviceCommands
