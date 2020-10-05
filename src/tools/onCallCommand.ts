import { flag } from '../preferences.json'
import { IsCall, InvalidCall, ErrorToRun } from '../types'

const isCall: IsCall = (message, messageArgs) => {
  return !(
    !messageArgs[0].startsWith(flag) ||
    messageArgs[0] === flag ||
    message.channel.type === 'dm' ||
    message.author.bot
  )
}

const invalidCall: InvalidCall = async ({
  embed,
  message,
  Command,
  messageArgs,
  permissions,
}) => {
  const description: string[] = []

  const commandPermissions = Command.permissions || []
  const needPermissions = {
    user: commandPermissions.filter(perm => !permissions.user.includes(perm)),
    bot: commandPermissions.filter(perm => !permissions.bot.includes(perm)),
  }

  const commandInitialized = new Command({ message, embed, messageArgs })
  const validation = commandInitialized.validator
    ? await commandInitialized.validator()
    : []

  switch (true) {
    case messageArgs.length < Command.minArguments:
      description.push(`:red_circle: Need arguments: \`\`${Command.usage}\`\``)
      break

    case !!needPermissions.bot.length:
      description.push(
        `:red_circle: I need permissions: \`\`${needPermissions.bot.join(
          ', '
        )}\`\``
      )
      break

    case !!needPermissions.user.length:
      description.push(
        `:red_circle: You need permissions: \`\`${needPermissions.user.join(
          ', '
        )}\`\``
      )
      description.push(
        `:red_circle: Try run: \`\`${flag}request-permission ${messageArgs.join(
          ' '
        )}\`\``
      )
      break

    case !!validation.length:
      validation.forEach(desc => description.push(desc))
      break

    default:
      return null
  }

  description.push(
    `:red_circle: Use **${flag}help ${Command.commandName}** for more information's`
  )

  embed.setColor('#E81010')
  embed.setDescription(description.join('\n\n'))

  return embed
}

const errorToRun: ErrorToRun = ({ embed, error }) => {
  const description: string[] = []

  description.push(':red_circle: Sorry, something went wrong')
  description.push(`:interrobang: ${error.name}: \`\`${error.message}\`\``)

  embed.setColor('#E81010')
  embed.setDescription(description.join('\n\n'))

  console.error(error)

  return embed
}

export default { isCall, invalidCall, errorToRun }
