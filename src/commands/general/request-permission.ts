import {
  User,
  MessageReaction,
  GuildMember,
  PermissionString,
  MessageEmbed,
} from 'discord.js'

import { findCommand } from '..'

import onCallCommand from '../../tools/onCallCommand'
import { Command, CommandConfig, CommandClass } from '../../types'

interface NeedPermissions {
  ({
    member,
    permissions,
  }: {
    member: GuildMember
    permissions: PermissionString[]
  }): PermissionString[]
}

interface CustomCollectorFilter {
  (reaction: MessageReaction, user: User): boolean
}

class RequestPermission implements Command {
  private Command?: CommandClass
  private requestRun: string

  constructor(private commandConfig: CommandConfig) {
    const { messageArgs } = commandConfig

    this.Command = findCommand(messageArgs[1])
    this.requestRun = this.commandConfig.messageArgs.join(' ')
  }

  static commandName = 'request-permission'
  static aliases = ['req-perm', 'reqp']
  static description = 'Request to run command thats need permissions'
  static minArguments = 1
  static usage = 'request-permission [command]'
  static example = 'request-permission clear 10'

  private needPermissions: NeedPermissions = ({ member, permissions }) =>
    permissions.filter(perm => !member.hasPermission(perm))

  async validator() {
    const {
      commandConfig: { message, embed, messageArgs },
      needPermissions,
      requestRun,
      Command,
    } = this

    if (!Command)
      return [`:red_circle: Not found the command **${messageArgs[1]}**`]

    const userNeedPermissions = needPermissions({
      member: message.guild.members.resolve(message.author.id),
      permissions: Command.permissions || [],
    })

    const invalidCallCommandDescription = (
      await onCallCommand.invalidCall({
        embed,
        message,
        Command,
        messageArgs: messageArgs.slice(1, messageArgs.length),
        permissions: {
          user: message.guild.me.permissions.toArray(),
          bot: message.guild.me.permissions.toArray(),
        },
      })
    )?.description?.split('\n\n')

    invalidCallCommandDescription?.pop()

    switch (true) {
      case !Command.permissions?.length:
        return [
          `:red_circle: Not is required permission to run: \`\`${requestRun}\`\``,
        ]

      case !userNeedPermissions.length:
        return [
          `:red_circle: You already have permission to run: \`\`${requestRun}\`\``,
        ]

      case !!invalidCallCommandDescription:
        return invalidCallCommandDescription

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { messageArgs, embed, message },
      Command,
      needPermissions,
    } = this

    const description: string[] = []

    const returnEmbed = new MessageEmbed({
      color: '#1213BD',
      author: { name: message.guild.name, iconURL: message.guild.iconURL() },
      footer: {
        text: `Command requested by: ${message.author.tag}`,
        iconURL: message.author.avatarURL(),
      },
    })

    const filter: CustomCollectorFilter = (reaction, user) => {
      const havePermission = !needPermissions({
        member: reaction.message.guild.members.resolve(user.id),
        permissions: Command?.permissions || [],
      }).length

      const isValidEmojiReaction = ['👍', '👎'].includes(reaction.emoji.name)

      const notIsMessageAuthor = user.id !== reaction.message.author.id

      return isValidEmojiReaction && notIsMessageAuthor && havePermission
    }

    embed.setDescription(
      `:nazar_amulet: <@${message.author.id}> request run: \`\`${this.requestRun}\`\``
    )

    const confirmMessage = await message.channel.send(embed)

    const commandInitialized = new Command({
      embed: returnEmbed,
      message: confirmMessage,
      messageArgs,
    })

    await confirmMessage.react('👍')
    await confirmMessage.react('👎')

    await confirmMessage
      .awaitReactions(filter, {
        max: 1,
        time: 60000, // milliseconds
        errors: ['time'],
      })
      .then(async collected => {
        const { emoji, users } = collected.first()

        const accepted = emoji.name === '👍'
        const userThatsAccepted = users.cache.last()

        if (accepted) {
          const commandEmbed = await commandInitialized.run()

          description.push(
            `:white_check_mark: <@${userThatsAccepted.id}> accepted <@${message.author.id}> run: \`\`${this.requestRun}\`\``
          )

          commandEmbed &&
            commandEmbed.description
              .split('\n\n')
              .forEach(desc => description.push(desc))
        } else {
          description.push(
            `:x: <@${userThatsAccepted.id}> recused <@${message.author.id}> run: \`\`${this.requestRun}\`\``
          )
          returnEmbed.setColor('#E81010')
        }
      })
      .catch(() => {
        description.push(':red_circle: Time is over')
        returnEmbed.setColor('#E81010')
      })
      .finally(async () => {
        if (confirmMessage.editable) {
          returnEmbed.setDescription(description.join('\n\n'))
          returnEmbed.setFooter(
            `Command requested by: ${message.author.tag}`,
            message.author.avatarURL()
          )
          await confirmMessage.reactions.removeAll()
          await confirmMessage.edit(returnEmbed)
        }
      })
  }
}

export default RequestPermission
