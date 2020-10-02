import {
  CollectorFilter,
  User,
  MessageReaction,
  GuildMember,
  PermissionString,
} from 'discord.js'

import { findCommand } from '..'

import onCallCommand from '../../tools/onCallCommand'
import { Command, CommandConfig, CommandClass } from '../../types'

interface NeedPermissions {
  ({ member, Command }: { member: GuildMember; Command: CommandClass }):
    | []
    | PermissionString[]
}

class RequestPermission implements Command {
  private commandConfig: CommandConfig
  private Command: CommandClass
  private requestRun: string

  constructor({ embed, message, messageArgs }: CommandConfig) {
    this.commandConfig = {
      embed,
      message,
      messageArgs: messageArgs.slice(1, messageArgs.length),
    }
    this.Command = findCommand(messageArgs[0])
    this.requestRun = this.commandConfig.messageArgs.join(' ')
  }

  static commandName = 'request-permission'
  static aliases = ['req-perm', 'reqp']
  static description = 'Request permission to perform certain command.'
  static minArguments = 1
  static usage = 'request-permission [command]'
  static example = 'request-permission clear 10'

  private needPermissions: NeedPermissions = ({ member, Command }) =>
    Command.permissions?.filter(perm => !member.hasPermission(perm)) || []

  validator() {
    const {
      commandConfig: {
        message: { guild, author },
      },
      needPermissions,
      Command,
      requestRun,
    } = this

    const userNeedPermissions = needPermissions({
      member: guild.members.resolve(author.id),
      Command,
    })

    switch (true) {
      case !Command?.permissions.length:
        return [
          `:red_circle: Not is required permission to run: \`\`${requestRun}\`\``,
        ]

      case !userNeedPermissions.length:
        return [
          `:red_circle: You already have permission to run: \`\`${requestRun}\`\``,
        ]

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { messageArgs, embed, message },
      Command,
    } = this

    const description: string[] = []

    const invalidCallCommand = await onCallCommand.invalidCall({
      embed,
      message,
      Command,
      messageArgs,
      permissions: {
        user: message.guild.me.permissions.toArray(),
        bot: message.guild.me.permissions.toArray(),
      },
    })

    if (invalidCallCommand) return invalidCallCommand

    const filter: CollectorFilter = (reaction: MessageReaction, user: User) => {
      const member = message.guild.members.resolve(user.id)

      const havePermission = !this.needPermissions({ member, Command })

      return (
        ['👍', '👎'].includes(reaction.emoji.name) &&
        user.id !== reaction.message.author.id &&
        havePermission
      )
    }

    embed.setDescription(
      `:nazar_amulet: <@${message.author.id}> request run: \`\`${this.requestRun}\`\``
    )

    const confirmMessage = await message.channel.send(embed)

    await confirmMessage.react('👍')
    await confirmMessage.react('👎')

    const commandInitialized = new this.Command({
      embed,
      message: confirmMessage,
      messageArgs,
    })

    await confirmMessage
      .awaitReactions(filter, {
        max: 1,
        time: 60000, // milliseconds
        errors: ['time'],
      })
      .then(async collected => {
        const reaction = collected.first()

        const userAccepted = reaction.users.cache.last()

        if (reaction.emoji.name === '👍') {
          const returnEmbed = await commandInitialized.run()

          if (returnEmbed) {
            const returnEmbedDescription = returnEmbed.description.split('\n\n')

            returnEmbedDescription.forEach(desc => description.push(desc))
          }
          description.push(
            `:white_check_mark: <@${userAccepted.id}> accepted <@${message.author.id}> run: \`\`${this.requestRun}\`\``
          )
        } else {
          description.push(
            `:x: <@${userAccepted.id}> recused <@${message.author.id}> run: \`\`${this.requestRun}\`\``
          )
          embed.setColor('#E81010')
        }
      })
      .catch(() => {
        description.push(':red_circle: Time is over')
        embed.setColor('#E81010')
      })
      .finally(async () => {
        if (confirmMessage.editable) {
          embed.setDescription(description.join('\n\n'))
          embed.setFooter(
            `Command requested by: ${message.author.tag}`,
            message.author.avatarURL()
          )
          await confirmMessage.reactions.removeAll()
          await confirmMessage.edit(embed)
        }
      })
  }
}

export default RequestPermission
