import { PermissionString, GuildMember } from 'discord.js'

import { Command, CommandConfig } from '../types'

class Kick implements Command {
  private userGuild: GuildMember
  constructor(private commandConfig: CommandConfig) {
    const { guild, mentions } = commandConfig.message
    this.userGuild =
      guild.member(mentions.users.first()) ||
      guild.members.resolve(commandConfig.messageArgs[1])
  }

  static commandName = 'kick'
  static aliases = ['k', 'kck']
  static description = 'Kick user from server'
  static minArguments = 1
  static permissions: PermissionString[] = ['KICK_MEMBERS']
  static usage = 'kick [mention, id]'
  static example = 'kick 736626386009194676'

  validator() {
    return !this.userGuild || !this.userGuild.kickable
      ? [':red_circle: User not is kickable or not found']
      : []
  }

  async run() {
    const { embed, message } = this.commandConfig

    await this.userGuild.kick()

    embed.setDescription(
      `:nazar_amulet: <@${message.author.id}> has kicked <@${this.userGuild.id}>`
    )

    return embed
  }
}

export default Kick
