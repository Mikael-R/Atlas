import { Command } from '../types'

const kick: Command = {
  name: 'kick',
  aliases: ['k', 'kck'],
  description: 'Kick user from server',
  minArguments: 1,
  permissions: ['KICK_MEMBERS'],
  usage: '$kick [user mention]',
  example: '$kick @atlas',
  run: ({ message, embed }) => {
    const description: string[] = []

    const user = message.mentions.users.first()
    const userGuild = message.guild.member(user)

    if (userGuild.kickable) {
      userGuild.kick().then(() => {
        description.push(
          `:nazar_amulet: <@${message.author.id}> has kicked <@${user.id}>`
        )
      })
    } else {
      description.push(':red_circle: User not is kickable')

      embed.setColor('#E81010')
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  },
}

export default kick
