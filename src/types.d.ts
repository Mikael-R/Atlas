import Discord from 'discord.js'

export type RandomizeStatus = (client: Discord.Client) => void

export type Status = Discord.ActivityOptions[]

export type CreateEmbed = (
  { title, color }:
  { title?: string, color?: string }
) => Discord.MessageEmbed

export type InvalidCommand = (embed: Discord.MessageEmbed, command: string) => Discord.MessageEmbed

export type Command<Run extends Function> = {
  aliases: string[]
  description: string
  usage: string
  example?: string
  run: Run
}

export type Help = (embed: Discord.MessageEmbed, command: Command<Function>) => Discord.MessageEmbed

export type Clear = (
  (embed: DiscordMessageEmbed, msg: Discord.Message, limit: string) => Discord.MessageEmbed
)

export type Ping = (
  (
    embed: Discord.MessageEmbed,
    ws: Discord.WebSocketManager,
    msg: Discord.Message
  )
    => Discord.MessageEmbed
)

export type GetUserInformation = (
  (embed: Discord.MessageEmbed, msg: Discord.Message) => Discord.MessageEmbed
)

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

export type GetServerInformation = (
  (embed: Discord.MessageEmbed, guild: Discord.Guild) => Discord.MessageEmbed
)

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
