import { PermissionString, User } from 'discord.js'

import {
  Command,
  UserInformation as UserInformationType,
  CommandConfig,
} from '../types'

class UserInformation implements Command {
  private user: User
  constructor(private commandConfig: CommandConfig) {
    const { message, messageArgs } = this.commandConfig
    this.user =
      message.mentions.users.first() ||
      message.guild.members.resolve(messageArgs[1])?.user ||
      message.author
  }

  static named = 'user-information'
  static aliases = ['userinfo', 'usinfo']
  static description = 'Show information about you or user mentioned'
  static minArguments = 0
  static permissions?: PermissionString[]
  static usage = 'user-information [mention, id or empty]'
  static example = 'user-information 736626386009194676'

  async run() {
    const { embed, message } = this.commandConfig

    const infos: UserInformationType = {
      tag: this.user.tag,
      avatar: this.user.displayAvatarURL(),
      status: this.user.presence.status,
      isBot: this.user.bot,
      createAccount: this.user.createdAt.toUTCString(),
      joined: message.guild.members
        .resolve(this.user.id)
        .joinedAt.toUTCString(),
      roles: (() => {
        const ignoreRoles = ['@everyone']
        return message.guild.members
          .resolve(this.user.id)
          .roles.cache.filter(
            role => !role.deleted && !ignoreRoles.includes(role.name)
          )
      })(),
      id: this.user.id,
    }

    embed
      .setTitle('')
      .setDescription(this.user)
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
