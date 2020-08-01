import Discord from 'discord.js'
import 'dotenv/config'

import commands from '@commands/__index__'
import * as complements from '@service/complements'

const client = new Discord.Client()

client.on('ready', () => {
  setInterval(() => complements.randomizeStatus(client), 12000)

  console.log(`> Started: ${client.user.tag}`)
})

client.on('guildCreate', guild => {
  const embed = complements.createEmbed({ color: '#1213BD' })

  guild.owner.send(complements.addedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Added: | Name: ${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('guildDelete', guild => {
  const embed = complements.createEmbed({ color: '#1213BD' })

  guild.owner.send(complements.addedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('message', message => {
  const messageArgs = message.content
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  if (!complements.callingCommand(message, messageArgs)) return

  messageArgs[0] = messageArgs[0].slice(1) // remove flag $ (one character)

  const embed = complements.createEmbed({ title: message.guild.name, color: '#1213BD' })

  const command = commands.filter(cmd => cmd.name === messageArgs[0] || cmd.aliases.indexOf(messageArgs[0]) !== -1)[0]
  const testCallingCommand = complements.testCallingCommand(embed, command, messageArgs, message.guild.members.resolve(message.author.id).permissions.toArray())

  if (testCallingCommand.passed) {
    message.channel.send(command.run(message, embed, messageArgs))
  } else {
    message.channel.send(testCallingCommand.embed)
  }
})

client.login(process.env.TOKEN)
