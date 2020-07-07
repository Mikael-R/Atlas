import Discord from 'discord.js'
import dotev from 'dotenv'

import * as serviceCommands from '@service/commands'
import { getPreferences } from '@service/preferences'

dotev.config()

const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity('amor e alegria!')

  console.log(`Started: ${client.user.tag}`)
})

client.on('message', msg => {
  const command: Array<string> = msg.content
    .toLocaleLowerCase()
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  const { flag, title, color } = getPreferences()
  const embed: Discord.MessageEmbed = serviceCommands.createEmbed(title, color)

  if (command[0] !== flag) {
    return null
  }

  switch (command.join(' ')) {
    case `${flag} ping`:
      msg.channel.send(serviceCommands.ping(embed, msg, client))
      break

    case `${flag} altere ${command[2]} ${command[3]}`:
      msg.channel.send(serviceCommands.changePreference(embed, command))
      break

    default:
      msg.channel.send(serviceCommands.invalidCommand(embed, flag))
  }
})

client.login(process.env.TOKEN)
