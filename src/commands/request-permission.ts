import { CollectorFilter, User, MessageReaction, GuildMember } from 'discord.js'

import commands from '.'
import onCallCommand from '../tools/onCallCommand'
import { Command } from '../types'

const requestPermission: Command = {
  name: 'request-permission',
  aliases: ['req-perm', 'reqp'],
  description: 'Request permission to perform certain command.',
  minArguments: 1,
  usage: 'request-permission [command]',
  example: 'request-permission clear 10',
  run: async ({ message, embed, messageArgs }) => {
    const description: string[] = []

    messageArgs = messageArgs.slice(1, messageArgs.length)
    const requestRun = messageArgs.join(' ')

    const command = commands.filter(
      cmd => cmd.name === messageArgs[0] || cmd.aliases.includes(messageArgs[0])
    )[0]

    const invalidCallCommand = onCallCommand.invalidCall({
      embed,
      command,
      messageArgs,
      permissions: {
        user: message.guild.me.permissions.toArray(),
        bot: message.guild.me.permissions.toArray(),
      },
    })

    if (invalidCallCommand) return invalidCallCommand

    const needPermissions = (member: GuildMember) =>
      command.permissions?.filter(perm => !member.hasPermission(perm)) || []

    const userHavePermission = !needPermissions(
      message.guild.members.resolve(message.author.id)
    ).length

    if (!command.permissions) {
      embed.setDescription(
        `:nazar_amulet: Not is required permission to run: \`\`${requestRun}\`\``
      )

      return embed
    }

    if (userHavePermission) {
      embed.setDescription(
        `:nazar_amulet: You already have permission to run: \`\`${requestRun}\`\``
      )

      return embed
    }

    const filter: CollectorFilter = (reaction: MessageReaction, user: User) => {
      const member = message.guild.members.resolve(user.id)

      const havePermission = !needPermissions(member).length

      return (
        ['👍', '👎'].includes(reaction.emoji.name) &&
        user.id !== reaction.message.author.id &&
        havePermission
      )
    }

    embed.setDescription(
      `:nazar_amulet: <@${message.author.id}> request run: \`\`${requestRun}\`\``
    )

    const confirmMessage = await message.channel.send(embed)

    await confirmMessage.react('👍')
    await confirmMessage.react('👎')

    await confirmMessage
      .awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(async collected => {
        const reaction = collected.first()

        const userAccepted = reaction.users.cache.last()

        if (reaction.emoji.name === '👍') {
          description.push(
            `:white_check_mark: <@${userAccepted.id}> accepted <@${message.author.id}> run: \`\`${requestRun}\`\``
          )

          const returnEmbed = await command.run({ message, embed, messageArgs })

          returnEmbed && message.channel.send(returnEmbed)
        } else {
          description.push(
            `:x: <@${userAccepted.id}> recused <@${message.author.id}> run: \`\`${requestRun}\`\``
          )
          embed.setColor('#E81010')
        }
      })
      .catch(() => {
        description.push(':red_circle: Time is over')
        embed.setColor('#E81010')
      })
      .finally(() => {
        if (confirmMessage.editable) {
          embed.setDescription(description.join('\n\n'))
          confirmMessage.edit(embed)
          confirmMessage.reactions.removeAll()
        }
      })
  },
}

export default requestPermission
