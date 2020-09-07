import { IsCall, IsValidCall } from '../types'

const isCall: IsCall = (message, messageArgs) => {
  return !(
    !messageArgs[0].startsWith('$') ||
    messageArgs[0] === '$' ||
    message.channel.type === 'dm' ||
    message.author.bot
  )
}

const isValidCall: IsValidCall = ({
  embed,
  command,
  messageArgs,
  permissions,
}) => {
  const description: string[] = []
  const passed: boolean[] = []

  const needPermissions =
    command && command.permissions
      ? {
          user: command.permissions.filter(
            perm => !permissions.user.includes(perm)
          ),
          bot: command.permissions.filter(
            perm => !permissions.bot.includes(perm)
          ),
        }
      : { user: [], bot: [] }

  switch (true) {
    case !command:
      description.push(
        `:red_circle: Command not exists: ${
          messageArgs[0] ? `**${messageArgs[0]}**` : ''
        }`
      )
      break

    case !!needPermissions.bot.length:
      description.push(
        `:red_circle: I need permissions: ${needPermissions.user
          .toString()
          .toLowerCase()
          .replace('_', ' ')
          .replace(',', ', ')}`
      )
      break

    case !!needPermissions.user.length:
      description.push(
        `:red_circle: You need permissions: \`\`${needPermissions.user
          .toString()
          .toLowerCase()
          .replace('_', ' ')
          .replace(',', ', ')}\`\``
      )
      break

    case messageArgs.length - 1 < command.minArguments:
      description.push(':red_circle: Need arguments')
      description.push(`:red_circle: **${command.usage}**`)
      break

    default:
      passed.push(true)
  }

  if (!passed[0]) {
    description.push(':red_circle: Use **$help** to view command list')

    embed.setColor('#E81010')
  }

  embed.setDescription(description.join('\n\n'))

  return { passed: passed[0], embed }
}

export default { isCall, isValidCall }
