import { Command, CommandConfig } from '@src/types'
import { PermissionString, GuildMember } from 'discord.js'

class Kick implements Command {
  private userGuild: GuildMember

  constructor(private commandConfig: CommandConfig) {
    const {
      message: { guild, mentions },
      messageArgs,
    } = commandConfig

    this.userGuild =
      guild.member(mentions.users.first()) ||
      guild.members.resolve(messageArgs[1])
  }

  static commandName = 'kick'
  static aliases = ['k', 'kck']
  static description = 'Kick user from server'
  static minArguments = 1
  static permissions = {
    user: ['KICK_MEMBERS'] as PermissionString[],
    client: ['KICK_MEMBERS'] as PermissionString[],
  }

  static usage = 'kick [mention, id]'
  static example = 'kick 736626386009194676'

  validator() {
    return !this.userGuild || !this.userGuild.kickable
      ? [':red_circle: User not is kickable or not found']
      : []
  }

  async run() {
    const {
      commandConfig: {
        embed,
        message: { author },
      },
      userGuild,
    } = this

    await userGuild.kick()

    embed.setDescription(
      `:nazar_amulet: <@${author.id}> has kicked <@${userGuild.id}>`
    )

    return embed
  }
}

export default Kick
