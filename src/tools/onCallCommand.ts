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

const invalidCall: InvalidCall = ({
  embed,
  message,
  Command,
  messageArgs,
  permissions,
}) => {
  const description: string[] = []

  const needPermissions = {
    user:
      Command?.permissions?.filter(perm => !permissions.user.includes(perm)) ||
      [],
    bot:
      Command?.permissions?.filter(perm => !permissions.bot.includes(perm)) ||
      [],
  }

  const commandInitialized = new Command({ message, embed, messageArgs })

  const validation = commandInitialized.validator
    ? commandInitialized?.validator()
    : []

  switch (true) {
    case !Command:
      description.push(`:red_circle: Not found Command: **${messageArgs[0]}**`)
      break

    case messageArgs.length - 1 < Command.minArguments:
      description.push(`:red_circle: Need arguments: \`\`${Command.usage}\`\``)
      break

    case !!needPermissions.bot.length:
      description.push(
        `:red_circle: I need permissions: \`\`${needPermissions.user
          .toString()
          .toLowerCase()
          .replace(',', ', ')}\`\``
      )
      break

    case !!needPermissions.user.length:
      description.push(
        `:red_circle: You need permissions: \`\`${needPermissions.user
          .toString()
          .toLowerCase()
          .replace(',', ', ')}\`\``
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
  }

  if (!description.length) return null

  description.push(
    `:red_circle: Use **${flag}help ${
      Command?.name || ''
    }** for more information's`
  )

  embed.setColor('#E81010')
  embed.setDescription(description.join('\n\n'))

  return embed
}

const errorToRun: ErrorToRun = ({ embed, error }) => {
  const description: string[] = []

  description.push(':red_circle: Sorry, something went wrong')
  description.push(`:interrobang: \`\`${error.message}\`\``)

  embed.setColor('#E81010')
  embed.setDescription(description.join('\n\n'))

  console.error(error)

  return embed
}

export default { isCall, invalidCall, errorToRun }
