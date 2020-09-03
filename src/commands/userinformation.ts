import { Command, UserInformation } from '../types'

const userinformation: Command = {
  name: 'userinformation',
  aliases: ['userinfo', 'usinfo'],
  description: 'Show information about you or user mentioned',
  minArguments: 0,
  usage: '$userinformation [user mention or empty for you]',
  example: '$userinformation @atlas',
  run: ({ message, embed }) => {
    const user = message.mentions.users.first() || message.author

    const userInformation: UserInformation = {
      tag: user.tag,
      avatar: user.displayAvatarURL(),
      status: user.presence.status,
      isBot: user.bot,
      createAccount: user.createdAt.toUTCString(),
      joined: message.guild.members.resolve(user.id).joinedAt.toUTCString(),
      roles: message.guild.members
        .resolve(user.id)
        .roles.cache.filter(role => !role.deleted && role.name !== '@everyone'),
      id: user.id,
    }

    embed
      .setTitle('')
      .setDescription(user)
      .setAuthor(userInformation.tag, userInformation.avatar)
      .setThumbnail(userInformation.avatar)
      .addField('Create Account', userInformation.createAccount)
      .addField('Joined', userInformation.joined)
      .addField('Status', userInformation.status, true)
      .addField('Bot', userInformation.isBot ? 'Yes' : 'No', true)
      .addField(
        `Roles [${userInformation.roles.size}]`,
        (() => {
          const format = ['']
          userInformation.roles.forEach(role => format.push(`<@&${role.id}>`))
          return format.join('  ')
        })()
      )
      .setFooter(`ID: ${userInformation.id}`)

    return embed
  },
}

export default userinformation
