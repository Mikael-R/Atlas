import Discord from 'discord.js'
import 'dotenv/config'

import serviceCommands from '@service/commands/__index__'
import * as serviceComplements from '@service/complements'

const client = new Discord.Client()

// serviceCommands.map(command => console.log(`"${command.name}" not have erros`))

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

  guild.owner.send(serviceComplements.addedOnServer(embed, guild.owner.displayName, guild.name))

  console.log(`> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`)
})

client.on('message', message => {
  const messageArgs = message.content
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  if (!serviceComplements.callingCommand(message, messageArgs)) return

  messageArgs[0] = messageArgs[0].slice(1) // remove flag $ (one character)

  const embed = serviceComplements.createEmbed({ title: message.guild.name, color: '#1213BD' })

  const command = serviceCommands.filter(cmd => cmd.name === messageArgs[0] || cmd.aliases.indexOf(messageArgs[0]) !== -1)[0]
  const testCallingCommand = serviceComplements.testCallingCommand(embed, command, messageArgs, message.guild.members.resolve(message.author.id).permissions.toArray())

  if (testCallingCommand.passed) {
    message.channel.send(command.run(message, embed, messageArgs))
  } else {
    message.channel.send(testCallingCommand.embed)
  }
})

client.login(process.env.TOKEN)
