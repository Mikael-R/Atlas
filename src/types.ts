import {
  MessageEmbedOptions,
  MessageEmbed,
  PermissionString,
  Message,
  Collection,
  Role,
} from 'discord.js'

export interface CreateEmbed {
  (options: MessageEmbedOptions): MessageEmbed
}

export interface Command {
  name: string
  aliases: string[]
  description: string
  permissions?: PermissionString[]
  minArguments: number
  usage: string
  example?: string
  run: ({
    message,
    embed,
    messageArgs,
  }: {
    message: Message
    embed: MessageEmbed
    messageArgs: string[]
  }) => MessageEmbed
}

export interface IsCall {
  (message: Message, messageArgs: string[]): boolean
}

export interface IsValidCall {
  ({
    embed,
    command,
    messageArgs,
    permissions,
  }: {
    embed: MessageEmbed
    command: Command
    messageArgs: string[]
    permissions: {
      user: PermissionString[]
      bot: PermissionString[]
    }
  }): { embed: MessageEmbed; passed: boolean }
}

export interface UserInformation {
  tag: string
  avatar: string
  status: string
  isBot: boolean
  createAccount: string
  joined: string
  roles: Collection<string, Role>
  id: string
}

export interface ServerInformation {
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

export interface OnServer {
  (embed: MessageEmbed, ownerName: string, serverName: string): MessageEmbed
}
