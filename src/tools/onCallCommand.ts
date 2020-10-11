import moment from 'moment'

import { flag } from '../preferences.json'
import { IsCall, InvalidCall, ErrorToRun } from '../types'
import commandActions from './actions'
import commandStore from './store'

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

  const needPermissions = {
    client:
      Command.permissions?.client?.filter(
        perm => !permissions.client.includes(perm)
      ) || [],
    user:
      Command.permissions?.user?.filter(
        perm => !permissions.user.includes(perm)
      ) || [],
  }

  const commandInitialized = new Command({ message, embed, messageArgs })
  const validation = commandInitialized.validator
    ? await commandInitialized.validator()
    : []

  const userID = message.author.id
  const { commandName } = Command

  const userCooldown = commandStore
    .getState()
    .CommandCooldown.get(userID)
    ?.find(value => value.commandName === commandName)

  if (Command.cooldown) {
    if (!userCooldown) {
      commandStore.dispatch(
        commandActions.setUserInCooldown(userID, {
          commandName,
          dateNow: moment(new Date()),
        })
      )

      const timer = setTimeout(() => {
        commandStore.dispatch(
          commandActions.removeCommandFromCooldown(userID, { commandName })
        )

        const userHasCommandsInCooldown = !!commandStore
          .getState()
          .CommandCooldown.get(userID)?.length

        if (!userHasCommandsInCooldown) {
          commandStore.dispatch(
            commandActions.deleteUserFromCooldown(userID, {})
          )
        }

        clearTimeout(timer)
      }, Command.cooldown * 1000)
    }
  }

  const diferenceAsMilliseconds = userCooldown
    ? Command.cooldown * 1000 -
      Number(
        moment
          .duration(moment(new Date()).diff(userCooldown.dateNow))
          .asMilliseconds()
      )
    : null

  switch (true) {
    case !!userCooldown?.commandName:
      description.push(
        `:red_circle: Wait ${diferenceAsMilliseconds} milliseconds to use this command again`
      )
      break

    case messageArgs.length < Command.minArguments:
      description.push(`:red_circle: Need arguments: \`\`${Command.usage}\`\``)
      break

    case !!needPermissions.client.length:
      description.push(
        `:red_circle: I need permissions: \`\`${needPermissions.client.join(
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
