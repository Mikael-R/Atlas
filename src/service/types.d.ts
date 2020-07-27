import Discord from 'discord.js'

export type CreateEmbed = (title: string) => Discord.MessageEmbed

export type InvalidCommand = (embed: Discord.MessageEmbed, command: string) => Discord.MessageEmbed

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
  name: string,
  discriminator: string,
  avatar: string,
  isBot: string,
  id: string,
  status: string,
  createAccount: string,
  joined: string
}

export type GetServerInformation = (
  (embed: Discord.MessageEmbed, guild: Discord.Guild) => Discord.MessageEmbed
)

export type ServerInformation = {
  name: string,
  members: number,
  icon: string,
  premiumSubscriptionCount: number,
  region: string,
  ownerNickname: string,
  id: string,
  created: string
}

export type AddedOnServer = (ownerNickname: string, serverName: string) => Discord.MessageEmbed

export type RemovedOnServer = (ownerNickname: string, serverName: string) => Discord.MessageEmbed
