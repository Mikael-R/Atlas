import { IsCall, IsValidCall } from '../types'

const isCall: IsCall = (message, messageArgs) => {
  return !(
    !messageArgs[0].startsWith('$') ||
    messageArgs[0] === '$' ||
    message.channel.type === 'dm' ||
    message.author.bot
  )
}

const isValidCall: IsValidCall = (
  embed,
  command,
  messageArgs,
  userPermissions
) => {
  const description: string[] = []

  if (command) {
    if (messageArgs.length - 1 < command.minArguments) {
      description.push(':red_circle: Need arguments')
      description.push(`:red_circle: **${command.usage}**`)
    }

    const needPermissions = command.permissions
      ? command.permissions.filter(perm => {
          console.log(userPermissions.includes(perm), perm)
        })
      : []

    if (needPermissions.length) {
      description.push(
        `:red_circle: Need permissions: ${needPermissions
          .toString()
          .split('_')
          .join(' ')}`
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
