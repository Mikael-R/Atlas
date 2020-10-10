import 'dotenv/config'

import { Client, MessageEmbed } from 'discord.js'

import { findCommand } from './commands/index'
import { flag } from './preferences.json'
import onCallCommand from './tools/onCallCommand'
import onServer from './tools/onServer'
import randomizeStatus from './tools/randomizeStatus'
import { CommandClass, CommandConfig } from './types'

const client = new Client()

client.on('ready', () => {
  setInterval(() => randomizeStatus(client), 12000)

  console.log(`> Started: ${client.user.tag}`)
})

client.on('guildCreate', guild => {
  const embed = new MessageEmbed({ color: '#1213BD' })

  guild.owner.send(onServer.added(embed, guild.owner.displayName, guild.name))

  console.log(`> Added On Guild: ${guild.name}\n> ID: ${guild.id}`)
})

client.on('guildDelete', guild => {
  const embed = new MessageEmbed({ color: '#1213BD' })

  guild.owner.send(onServer.removed(embed, guild.owner.displayName, guild.name))

  console.log(`> Removed On Guild: ${guild.name}\n> ID: ${guild.id}`)
})

client.on('message', async message => {
  const messageArgs = message.content.replace(/\s{2,}/g, ' ').split(' ')

  if (!onCallCommand.isCall(message, messageArgs)) return null

  messageArgs[0] = messageArgs[0].replace(flag, '')

  const Command = findCommand(messageArgs[0])

  if (!Command) return null

  const embed = new MessageEmbed({
    color: '#1213BD',
    author: { name: message.guild.name, iconURL: message.guild.iconURL() },
    footer: {
      text: `Command requested by: ${message.author.tag}`,
      iconURL: message.author.avatarURL(),
    },
    timestamp: Date.now(),
  })

  const invalidCallCommand = await onCallCommand.invalidCall({
    embed,
    message,
    Command,
    messageArgs,
    permissions: {
      client: message.guild.me.permissions.toArray(),
      user: message.guild.members
        .resolve(message.author.id)
        .permissions.toArray(),
    },
  })

  const execCommand = (Command: CommandClass, commandConfig: CommandConfig) => {
    try {
      return new Command(commandConfig).run()
    } catch (error) {
      return onCallCommand.errorToRun({ embed, error })
    }
  }

  const returnEmbed =
    invalidCallCommand ||
    (await execCommand(Command, {
      message,
      embed,
      messageArgs,
    }))

  returnEmbed && (await message.reply(returnEmbed))
})

client.login(process.env.TOKEN)
