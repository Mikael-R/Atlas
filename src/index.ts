import 'dotenv/config'

import commands from '@commands/index'
import createEmbed from '@tools/createEmbed'
import onCallCommand from '@tools/onCallCommand'
import onServer from '@tools/onServer'
import randomizeStatus from '@tools/randomizeStatus'
import { Client } from 'discord.js'

const client = new Client()

client.on('ready', () => {
  setInterval(() => randomizeStatus(client), 12000)

  console.log(`> Started: ${client.user.tag}`)
})

client.on('guildCreate', guild => {
  const embed = createEmbed({ color: '#1213BD' })

  guild.owner.send(onServer.added(embed, guild.owner.displayName, guild.name))

  console.log(
    `> Added: | Name: ${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`
  )
})

client.on('guildDelete', guild => {
  const embed = createEmbed({ color: '#1213BD' })

  guild.owner.send(onServer.removed(embed, guild.owner.displayName, guild.name))

  console.log(
    `> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`
  )
})

client.on('message', message => {
  const messageArgs = message.content.replace(/\s{2,}/g, ' ').split(' ')

  if (!onCallCommand.isCall(message, messageArgs)) return

  messageArgs[0] = messageArgs[0].replace('$', '')

  const embed = createEmbed({
    title: message.guild.name,
    color: '#1213BD',
  })

  const command = commands.filter(
    cmd => cmd.name === messageArgs[0] || cmd.aliases.includes(messageArgs[0])
  )[0]

  const isValidCallCommand = onCallCommand.isValidCall(
    embed,
    command,
    messageArgs,
    message.guild.members.resolve(message.author.id).permissions.toArray()
  )

  if (isValidCallCommand.passed) {
    message.channel.send(command.run(message, embed, messageArgs))
  } else {
    message.channel.send(isValidCallCommand.embed)
  }
})

client.login(process.env.TOKEN)
