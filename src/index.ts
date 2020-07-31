import Discord from 'discord.js'
import 'dotenv/config'

import serviceCommands from '@service/commands'
import * as serviceComplements from '@service/complements'

const client = new Discord.Client()

client.on('ready', () => {
  setInterval(() => serviceComplements.randomizeStatus(client), 12000)

  console.log(`> Started: ${client.user.tag}`)
})

client.on('guildCreate', guild => {
  const embed = serviceComplements.createEmbed({ color: '#1213BD' })

  guild.owner.send(serviceComplements.addedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Added: | Name: ${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('guildDelete', guild => {
  const embed = serviceComplements.createEmbed({ color: '#1213BD' })

  guild.owner.send(serviceComplements.removedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('message', msg => {
  const msgCommands = msg.content
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  if (msgCommands[0][0] !== '$' || msgCommands[0] === '$' || msg.channel.type === 'dm' || msg.author.bot) {
    return
  }

  msgCommands[0] = msgCommands[0].slice(1) // remove flag (one character)

  const embed = serviceComplements.createEmbed({ title: msg.guild.name, color: '#1213BD' })

  const command = serviceCommands.filter(cmd => cmd.name === msgCommands[0] || cmd.aliases.indexOf(msgCommands[0]) !== -1)[0]

  if (command) {
    command.run(msg, embed, msgCommands)
  } else {
    serviceComplements.invalidCommand(msg, embed, msgCommands)
  }
})

client.login(process.env.TOKEN)
