import { Command, CommandConfig } from '../../types'

class UserInformation implements Command {
  constructor(private commandConfig: CommandConfig) {}

  static commandName = 'user-information'
  static aliases = ['usinfo', 'userinfo']
  static description = 'Show information about you or user mentioned'
  static minArguments = 0
  static usage = 'user-information [mention, id, empty]'
  static example = 'user-information 736626386009194676'

  async run() {
    const { embed, message, messageArgs } = this.commandConfig

    const user =
      message.mentions.users.first() ||
      message.guild.members.resolve(messageArgs[1])?.user ||
      message.author

    const infos = {
      username: user.username,
      tag: user.tag,
      avatar: user.displayAvatarURL(),
      status: user.presence.status,
      createAccount: user.createdAt.toUTCString(),
      joined: message.guild.members.resolve(user.id).joinedAt.toUTCString(),
      roles: message.guild.members
        .resolve(user.id)
        .roles.cache.filter(role => !role.deleted && role.name !== '@everyone')
        .map(role => `<@&${role.id}>`),
      id: user.id,
    }

    embed
      .setThumbnail(infos.avatar)
      .addField('Username', user.username, true)
      .addField('Tag', user.tag, true)
      .addField('Status', infos.status, true)
      .addField('Create Account', infos.createAccount)
      .addField('Joined', infos.joined)
    infos.roles.length > 0 &&
      embed.addField(`Roles [${infos.roles.length}]`, infos.roles.join(' '))
    embed.addField('ID', infos.id)

    return embed
  }
}

export default UserInformation
