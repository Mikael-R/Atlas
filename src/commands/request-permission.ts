import {
  CollectorFilter,
  User,
  MessageReaction,
  GuildMember,
  PermissionString,
} from 'discord.js'

import commands from '.'
import onCallCommand from '../tools/onCallCommand'
import { Command, CommandConfig, CommandClass } from '../types'

interface NeedPermissions {
  ({ member, Command }: { member: GuildMember; Command: Command }):
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

    this.Command = commands.filter(
      cmd =>
        cmd.commandName === this.commandConfig.messageArgs[0] ||
        cmd.aliases.includes(this.commandConfig.messageArgs[0])
    )[0]

    this.requestRun = this.commandConfig.messageArgs.join(' ')
  }

  static commandName = 'request-permission'
  static aliases = ['req-perm', 'reqp']
  static description = 'Request permission to perform certain command.'
  static minArguments = 1
  static usage = 'request-permission [command]'
  static example = 'request-permission clear 10'

  needPermissions({ member, Command }): NeedPermissions {
    return (
      Command.permissions?.filter(perm => !member.hasPermission(perm)) || []
    )
  }

  validator() {
    const { message } = this.commandConfig

    const description: string[] = []

    const userHavePermission = !this.needPermissions({
      member: message.guild.members.resolve(message.author.id),
      Command: this.Command,
    }).length

    switch (true) {
      case !!this.Command?.permissions?.length:
        description.push(
          `:red_circle: Not is required permission to run: \`\`${this.requestRun}\`\``
        )
        break

      case userHavePermission:
        description.push(
          `:red_circle: You already have permission to run: \`\`${this.requestRun}\`\``
        )
        break
    }
    return description
  }

  async run() {
    const { messageArgs, embed, message } = this.commandConfig

    const description: string[] = []

    const invalidCallCommand = onCallCommand.invalidCall({
      embed,
      message,
      Command: this.Command,
      messageArgs,
      permissions: {
        user: message.guild.me.permissions.toArray(),
        bot: message.guild.me.permissions.toArray(),
      },
    })

    if (invalidCallCommand) return invalidCallCommand

    const filter: CollectorFilter = (reaction: MessageReaction, user: User) => {
      const member = message.guild.members.resolve(user.id)

      const havePermission = !this.needPermissions({
        member,
        Command: this.Command,
      }).length

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

    await confirmMessage
      .awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(async collected => {
        const reaction = collected.first()

        const userAccepted = reaction.users.cache.last()

        if (reaction.emoji.name === '👍') {
          description.push(
            `:white_check_mark: <@${userAccepted.id}> accepted <@${message.author.id}> run: \`\`${this.requestRun}\`\``
          )

          const returnEmbed = await new this.Command({
            embed,
            message,
            messageArgs,
          }).run()

          returnEmbed && (await message.channel.send(returnEmbed))
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
      .finally(() => {
        if (confirmMessage.editable) {
          embed.setDescription(description.join('\n\n'))
          confirmMessage.edit(embed)
          confirmMessage.reactions.removeAll()
        }
      })
  }
}

export default RequestPermission
