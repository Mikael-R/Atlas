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

  const needPermissions = (command.permissions && {
    user: command.permissions.filter(perm => !permissions.user.includes(perm)),
    bot: command.permissions.filter(perm => !permissions.bot.includes(perm)),
  }) || { user: [], bot: [] }

  if (command) {
    if (messageArgs.length - 1 < command.minArguments) {
      description.push(':red_circle: Need arguments')
      description.push(`:red_circle: **${command.usage}**`)
    }

    if (needPermissions.user.length) {
      description.push(
        `:red_circle: You need permissions: ${needPermissions.user
          .toString()
          .toLowerCase()
          .replace('_', ' ')
          .replace(',', ', ')}`
      )
    }

    if (needPermissions.bot.length) {
      description.push(
        `:red_circle: You need permissions: ${needPermissions.bot
          .toString()
          .toLowerCase()
          .replace('_', ' ')
          .replace(',', ', ')}`
      )
    }
  } else {
    description.push(
      `:red_circle: Command not exists: ${
        messageArgs[0] ? `**${messageArgs[0]}**` : ''
      }`
    )
  }

  const passed = !description.length

  if (!passed) {
    description.push(':red_circle: Use **$help** to view command list')

    embed.setColor('#E81010')
  }

  embed.setDescription(description.join('\n\n'))

  return { passed, embed }
}

export default { isCall, isValidCall }
