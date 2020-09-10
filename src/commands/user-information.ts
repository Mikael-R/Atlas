import { Command, UserInformation } from '../types'

const userInformation: Command = {
  name: 'user-information',
  aliases: ['userinfo', 'usinfo'],
  description: 'Show information about you or user mentioned',
  minArguments: 0,
  usage: 'user-information [mention, id or empty]',
  example: 'user-information 736626386009194676',
  run: ({ message, embed, messageArgs }) => {
    const user =
      message.mentions.users.first() ||
      message.guild.members.resolve(messageArgs[1])?.user ||
      message.author

    const informations: UserInformation = {
      tag: user.tag,
      avatar: user.displayAvatarURL(),
      status: user.presence.status,
      isBot: user.bot,
      createAccount: user.createdAt.toUTCString(),
      joined: message.guild.members.resolve(user.id).joinedAt.toUTCString(),
      roles: (() => {
        const ignoreRoles = ['@everyone']
        return message.guild.members
          .resolve(user.id)
          .roles.cache.filter(
            role => !role.deleted && !ignoreRoles.includes(role.name)
          )
      })(),
      id: user.id,
    }

    embed
      .setTitle('')
      .setDescription(user)
      .setAuthor(informations.tag, informations.avatar)
      .setThumbnail(informations.avatar)
      .addField('Create Account', informations.createAccount)
      .addField('Joined', informations.joined)
      .addField('Status', informations.status, true)
      .addField('Bot', informations.isBot ? 'Yes' : 'No', true)
    informations.roles.size > 0 &&
      embed.addField(
        `Roles [${informations.roles.size}]`,
        informations.roles.map(role => `<@&${role.id}>`).join(' ')
      )
    embed.addField('ID', informations.id)

    return embed
  },
}

export default userInformation
