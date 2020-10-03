import { User } from 'discord.js'

import {
  Command,
  UserInformation as UserInformationType,
  CommandConfig,
} from '../../types'

class UserInformation implements Command {
  private user: User

  constructor(private commandConfig: CommandConfig) {
    const { message, messageArgs } = this.commandConfig

    this.user =
      message.mentions.users.first() ||
      message.guild.members.resolve(messageArgs[1])?.user ||
      message.author
  }

  static commandName = 'user-information'
  static aliases = ['userinfo', 'usinfo']
  static description = 'Show information about you or user mentioned'
  static minArguments = 0
  static usage = 'user-information [mention, id or empty]'
  static example = 'user-information 736626386009194676'

  async run() {
    const {
      commandConfig: {
        embed,
        message: { guild },
      },
      user,
    } = this

    const infos: UserInformationType = {
      tag: user.tag,
      avatar: user.displayAvatarURL(),
      status: user.presence.status,
      isBot: user.bot,
      createAccount: user.createdAt.toUTCString(),
      joined: guild.members.resolve(user.id).joinedAt.toUTCString(),
      roles: guild.members
        .resolve(user.id)
        .roles.cache.filter(role => !role.deleted && role.name !== '@everyone'),
      id: user.id,
    }

    embed
      .setDescription(user)
      .setAuthor(infos.tag, infos.avatar)
      .setThumbnail(infos.avatar)
      .addField('Create Account', infos.createAccount)
      .addField('Joined', infos.joined)
      .addField('Status', infos.status, true)
      .addField('Bot', infos.isBot ? 'Yes' : 'No', true)
    infos.roles.size > 0 &&
      embed.addField(
        `Roles [${infos.roles.size}]`,
        infos.roles.map(role => `<@&${role.id}>`).join(' ')
      )
    embed.addField('ID', infos.id)

    return embed
  }
}

export default UserInformation
