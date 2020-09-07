import { CollectorFilter, User, MessageReaction } from 'discord.js'

import commands from '.'
import onCallCommand from '../tools/onCallCommand'
import { Command } from '../types'

const requestPermission: Command = {
  name: 'request-permission',
  aliases: ['req-perm', 'rp'],
  description: 'Request permission to perform certain command.',
  minArguments: 1,
  usage: '$request-permission [command]',
  example: '$request-permission clear 10',
  run: async ({ message, embed, messageArgs }) => {
    const description: string[] = []
    messageArgs = messageArgs.slice(1, messageArgs.length)

    const command = commands.filter(
      cmd => cmd.name === messageArgs[0] || cmd.aliases.includes(messageArgs[0])
    )[0]

    const isValidCallCommand = onCallCommand.isValidCall({
      embed,
      command,
      messageArgs,
      permissions: {
        user: message.guild.me.permissions.toArray(),
        bot: message.guild.me.permissions.toArray(),
      },
    })

    if (!isValidCallCommand.passed) {
      return isValidCallCommand.embed
    }

    if (!command.permissions) {
      embed.setDescription(
        `:nazar_amulet: \`\`${command.name}\`\` command don't need permission to run`
      )

      return embed
    }

    embed.setDescription(
      `:nazar_amulet: <@${
        message.author.id
      }> request run command: \`\`${messageArgs.join(' ')}\`\``
    )

    const filter: CollectorFilter = (reaction: MessageReaction, user: User) => {
      const member = message.guild.members.resolve(user.id)
      const needPermission = command.permissions.filter(
        perm => !member.hasPermission(perm)
      )

      return (
        ['👍', '👎'].includes(reaction.emoji.name) &&
        user.id === message.author.id &&
        !needPermission
      )
    }

    const confirmMessage = await message.channel.send(embed)

    confirmMessage.react('👍')
    confirmMessage.react('👎')

    confirmMessage
      .awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first()

        const userAccepted: User = reaction.users.cache.toJSON()[1]

        if (reaction.emoji.name === '👍') {
          description.push(
            `:white_check_mark: <@${userAccepted.id}> accepted <@${
              message.author.id
            }> \`\`run ${messageArgs.join(' ')}\`\``
          )

          return command.run({ message, embed, messageArgs })
        } else {
          description.push(
            `:x: <@${userAccepted.id}> recused <@${
              message.author.id
            }> \`\`run ${messageArgs.join(' ')}\`\``
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
