import 'dotenv/config'

import { Client } from 'discord.js'

import commands from './commands/index'
import { flag } from './prefererences.json'
import createEmbed from './tools/createEmbed'
import onCallCommand from './tools/onCallCommand'
import onServer from './tools/onServer'
import randomizeStatus from './tools/randomizeStatus'

const client = new Client()

client.on('ready', () => {
  setInterval(() => randomizeStatus(client), 12000)

  console.log(`> Started: ${client.user.tag}`)
})

client.on('guildCreate', guild => {
  let embed = createEmbed({ color: '#1213BD' })

  embed = onServer.added(embed, guild.owner.displayName, guild.name)

  guild.owner.send(embed)

  console.log(
    `> Added: | Name: ${guild.name} | ID ${guild.id} | Members: ${guild.memberCount}`
  )
})

client.on('guildDelete', guild => {
  let embed = createEmbed({ color: '#1213BD' })

  embed = onServer.removed(embed, guild.owner.displayName, guild.name)

  guild.owner.send(embed)

  console.log(
    `> Removed: | Name: ${guild.name} | ID: ${guild.id} | Members: ${guild.memberCount}`
  )
})

client.on('message', async message => {
  const messageArgs = message.content.replace(/\s{2,}/g, ' ').split(' ')

  if (!onCallCommand.isCall(message, messageArgs)) return null

  messageArgs[0] = messageArgs[0].replace(flag, '')

  let embed = createEmbed({
    title: message.guild.name,
    color: '#1213BD',
  })

  const command = commands.filter(
    cmd => cmd.name === messageArgs[0] || cmd.aliases.includes(messageArgs[0])
  )[0]

  if (!command) return null

  const invalidCallCommand = onCallCommand.invalidCall({
    embed,
    command,
    messageArgs,
    permissions: {
      user: message.guild.members
        .resolve(message.author.id)
        .permissions.toArray(),
      bot: message.guild.me.permissions.toArray(),
    },
  })

  embed =
    invalidCallCommand || (await command.run({ message, embed, messageArgs }))

  message.channel.send(embed)
})

client.login(process.env.TOKEN)
