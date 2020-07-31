import { Command, UserInformation, ServerInformation } from 'src/types'

// const help: Command = {
//   name: 'help',
//   aliases: ['h'],
//   description: 'Show commands or more information about specific command',
//   usage: '$help [command or empty to view list]',
//   example: '$help ping',
//   run: (msg, embed, msgCommand) => {
//     const message: string[] = []

//     message.push(':nazar_amulet: Use ``$help [command]`` to view more information about specific command')

//     embed.addField('', '')

//     embed.setDescription(message.join('\n\n'))

//     msg.channel.send(embed)
//   }
// }

const clear: Command = {
  name: 'clear',
  aliases: ['c'],
  description: 'Delete specified previous messages',
  usage: '$clear [limit]',
  example: '$clear 7',
  run: (msg, embed, msgCommands) => {
    const message: string[] = []
    const limit = msgCommands[1]

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

    msg.channel.send(embed)
  }
}

const ping: Command = {
  name: 'ping',
  aliases: ['p'],
  description: 'Show bot ping in milliseconds on send message',
  usage: '$ping',
  run: (msg, embed, msgCommands) => {
    const message: string[] = []

    message.push(':ping_pong: Pong!')
    message.push(`:nazar_amulet: **${Date.now() - msg.createdTimestamp}ms**`)

    embed.setDescription(message.join('\n\n'))

    msg.channel.send(embed)
  }
}

const userinformation: Command = {
  name: 'userinformation',
  aliases: ['userinfo', 'usinfo'],
  description: 'Show information about you or user mentioned',
  usage: '$userinfo [user mention or empty for you]',
  example: '$userinfo @Atlas',
  run: (msg, embed, msgCommands) => {
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

    msg.channel.send(embed)
  }
}

const serverinformation: Command = {
  name: 'serverinformation',
  aliases: ['serverinfo', 'svinfo'],
  description: 'Show information about this server',
  usage: '$serverinformation',
  run: (msg, embed, msgCommands) => {
    const serverInformation: ServerInformation = {
      name: msg.guild.name,
      icon: msg.guild.iconURL(),
      ownerNickname: msg.guild.owner.user.tag,
      created: msg.guild.createdAt.toUTCString(),
      region: msg.guild.region,
      members: msg.guild.memberCount,
      channels: msg.guild.channels.cache.size,
      premiumSubscriptionCount: msg.guild.premiumSubscriptionCount,
      id: msg.guild.id
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

    msg.channel.send(embed)
  }
}

const serviceCommands = [
  clear,
  ping,
  userinformation,
  serverinformation
]

export default serviceCommands
