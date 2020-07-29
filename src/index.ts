import Discord from 'discord.js'
import 'dotenv/config'

import * as serviceCommands from '@service/commands'

const client = new Discord.Client()

client.on('ready', () => {
  setInterval(() => serviceCommands.randomizeStatus(client), 12000)

  console.log(`> Started: ${client.user.tag}`)
})

client.on('guildCreate', guild => {
  const embed = serviceCommands.createEmbed({ color: '#1213BD' })

  guild.owner.send(serviceCommands.addedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Added: | Name: ${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('guildDelete', guild => {
  const embed = serviceCommands.createEmbed({ color: '#1213BD' })

  guild.owner.send(serviceCommands.removedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('message', msg => {
  const commands = msg.content
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  if (commands[0][0] !== '$' || commands[0] === '$' || msg.channel.type === 'dm' || msg.author.bot) {
    return
  }

  const embed = serviceCommands.createEmbed({ title: msg.guild.name, color: '#1213BD' })
  commands[0] = commands[0].slice(1)

  switch (true) {
    case serviceCommands.help.aliases.indexOf(commands[0]) !== -1:
      msg.channel.send(serviceCommands.help.run(embed))
      break

    case serviceCommands.clear.aliases.indexOf(commands[0]) !== -1:
      msg.channel.send(serviceCommands.clear.run(embed, msg, commands[1]))
      break

    case serviceCommands.ping.aliases.indexOf(commands[0]) !== -1:
      msg.channel.send(serviceCommands.ping.run(embed, client.ws, msg))
      break

    case serviceCommands.getUserInformation.aliases.indexOf(commands[0]) !== -1:
      msg.channel.send(serviceCommands.getUserInformation.run(embed, msg))
      break

    case serviceCommands.getServerInformation.aliases.indexOf(commands[0]) !== -1:
      msg.channel.send(serviceCommands.getServerInformation.run(embed, msg.guild))
      break

    default:
      msg.channel.send(serviceCommands.invalidCommand(embed, commands[0]))
  }
})

client.login(process.env.TOKEN)
