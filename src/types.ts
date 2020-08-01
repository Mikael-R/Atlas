import Discord from 'discord.js'

export type RandomizeStatus = (client: Discord.Client) => void

export type Status = Discord.ActivityOptions[]

export type CreateEmbed = (
  { title, color }:
  { title?: string, color?: string }
) => Discord.MessageEmbed

export type Command = {
  name: string
  aliases: string[]
  description: string
  permissions?: Discord.PermissionString[]
  minArguments: number
  usage: string
  example?: string
  run: (
    message: Discord.Message,
    embed: Discord.MessageEmbed,
    messageArgs: string[]
    ) => Discord.MessageEmbed
}

export type CallingCommand = (message: Discord.Message, messageArgs: string[]) => boolean

export type TestCallingCommand = (
  embed: Discord.MessageEmbed, command: Command, messageArgs: string[], userPermissions: Discord.PermissionString[]
  ) => { embed: Discord.MessageEmbed, passed: boolean }

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

export type OnServer = (embed: Discord.MessageEmbed, ownerName: string, serverName: string) => Discord.messageEmbed
