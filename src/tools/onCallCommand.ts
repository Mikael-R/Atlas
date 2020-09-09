import { flag } from '../prefererences.json'
import { IsCall, InvalidCall } from '../types'

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
  command,
  messageArgs,
  permissions,
}) => {
  const description: string[] = []

  const needPermissions = {
    user:
      command?.permissions?.filter(perm => !permissions.user.includes(perm)) ||
      [],
    bot:
      command?.permissions?.filter(perm => !permissions.bot.includes(perm)) ||
      [],
  }

  switch (true) {
    case !command:
      description.push(`:red_circle: Not found command: **${messageArgs[0]}**`)
      break

    case messageArgs.length - 1 < command.minArguments:
      description.push(`:red_circle: Need arguments: \`\`${command.usage}\`\``)
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
      description.push(
        `:red_circle: Try run \`\`${flag}request-permission ${messageArgs.join(
          ' '
        )}\`\``
      )
      break
  }

  if (!description.length) return null

  description.push(
    `:red_circle: Use **${flag}help ${
      command?.name || ''
    }** for more informations`
  )

  embed.setColor('#E81010')
  embed.setDescription(description.join('\n\n'))

  return embed
}

export default { isCall, invalidCall }
