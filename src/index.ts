import Discord from 'discord.js'
import 'dotenv/config'

import * as serviceCommands from '@service/commands'

const client = new Discord.Client()

client.on('ready', () => {
  setInterval(() => serviceCommands.randomizeStatus(client), 12000)

  console.log(`> Started: "${client.user.tag}"`)
})

client.on('guildCreate', guild => {
  guild.owner.send(serviceCommands.addedOnServer(guild.owner.displayName, guild.name))

  console.log(`> Added: | Name: ${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('guildDelete', guild => {
  guild.owner.send(serviceCommands.removedOnServer(guild.owner.displayName, guild.name))

  console.log(`> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('message', msg => {
  const commands = msg.content
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  if (commands[0] !== '$' || msg.channel.type === 'dm' || msg.author.bot) {
    return
  }

  const embed = serviceCommands.createEmbed(msg.guild.name)

  switch (commands[1]) {
    case 'ping':
      msg.channel.send(serviceCommands.ping(embed, client.ws, msg))
      break

    case 'userinfo':
      msg.channel.send(serviceCommands.getUserInformation(embed, msg))
      break

    case 'serverinfo':
      msg.channel.send(serviceCommands.getServerInformation(embed, msg.guild))
      break

    case 'clear':
      msg.channel.send(serviceCommands.deleteMessages(embed, msg, commands[2]))
      break

    default:
      msg.channel.send(serviceCommands.invalidCommand(embed, commands[1]))
  }
})

client.login(process.env.TOKEN)
