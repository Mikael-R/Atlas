import Discord from 'discord.js'

export type RandomizeStatus = (client: Discord.Client) => void

export type Status = Discord.ActivityOptions[]

export type CreateEmbed = (
  { title, color }:
  { title?: string, color?: string }
) => Discord.MessageEmbed

export type InvalidCommand = (msg: Discord.Message, embed: Discord.MessageEmbed, msgCommands: string[]) => void

export type Command = {
  name: string
  aliases: string[]
  description: string
  usage: string
  example?: string
  run: (
    msg: Discord.Message,
    embed: Discord.MessageEmbed,
    msgCommands: string[]
    ) => void
}

export type UserInformation = {
  tag: string
  avatar: string
  status: string
  isBot: string
  createAccount: string
  joined: string
  roles: Discord.Collection<string, Discord.Role>
  id: string
}

export type ServerInformation = {
  name: string
  icon: string
  members: number
  ownerNickname: string
  created: string
  region: string
  channels: number
  premiumSubscriptionCount: number
  id: string
}

export type AddedOnServer = (embed: Discord.MessageEmbed, ownerNickname: string, serverName: string) => Discord.MessageEmbed

export type RemovedOnServer = (embed: Discord.MessageEmbed, ownerNickname: string, serverName: string) => Discord.MessageEmbed
