import Discord from 'discord.js'
import 'dotenv/config'

import * as serviceCommands from '@service/commands'
import { getPreferences } from '@service/preferences'

const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity('love and happy!')

  console.log(`> Started: "${client.user.tag}"`)
})

client.on('guildCreate', guild => {
  console.log(`> Added: | Name${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('guildDelete', guild => {
  console.log(`> Removed: |Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('message', msg => {
  const command: Array<string> = msg.content
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  const { flag, title, color } = getPreferences()
  const embed = serviceCommands.createEmbed(title, color)

  if (command[0] !== flag || msg.channel.type === 'dm' || msg.author.bot) {
    return
  }

  switch (command[1]) {
    case 'ping':
      msg.channel.send(serviceCommands.ping(embed, msg, client))
      break

    case 'change':
      msg.channel.send(serviceCommands.changePreference(embed, command))
      break

    case 'userinfo':
      msg.channel.send(serviceCommands.getUserInformation(embed, msg))
      break

    default:
      msg.channel.send(serviceCommands.invalidCommand(embed, command[0]))
  }
})

client.login(process.env.TOKEN)
