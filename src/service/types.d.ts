// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js'

interface Preferences {
  flag: string,
  title: string,
  color: string
}

export interface ChangePreference {
  (embed: Discord.MessageEmbed, command: Array<string>): Discord.MessageEmbed
}

export interface CreateEmbed {
  (title: string, color: string): Discord.MessageEmbed
}

export interface InvalidCommand {
  (embed: Discord.MessageEmbed, flag: string): Discord.MessageEmbed
}

export interface Ping {
  (
    embed: Discord.MessageEmbed,
    msg: Discord.Message,
    client: Discord.Client
  )
    : Discord.MessageEmbed
}

export interface UserInformation {
  tag: string
  name: string,
  discriminator: string,
  avatar: string,
  isBot: string,
  id: string,
  status: string,
  createAccount: string,
  joined: string
}

export interface GetUserInformation {
  (embed: Discord.MessageEmbed, msg: Discord.Message) : Discord.MessageEmbed
}
