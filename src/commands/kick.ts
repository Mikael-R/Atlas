import { PermissionString } from 'discord.js'

import { Command, RunConfig } from '../types'

class Kick implements Command {
  name = 'kick'
  aliases = ['k', 'kck']
  description = 'Kick user from server'
  minArguments = 1
  permissions: PermissionString[] = ['KICK_MEMBERS']
  usage = 'kick [mention, id]'
  example = 'kick 736626386009194676'
  async run({ message, embed, messageArgs }: RunConfig) {
    const description: string[] = []

    const userGuild =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.resolve(messageArgs[1])

    if (!userGuild || !userGuild.kickable) {
      description.push(':red_circle: User not is kickable or not found')

      embed.setColor('#E81010')
    } else {
      await userGuild.kick()

      description.push(
        `:nazar_amulet: <@${message.author.id}> has kicked <@${userGuild.id}>`
      )
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  }
}

export default Kick
