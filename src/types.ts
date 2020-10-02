import {
  MessageEmbed,
  PermissionString,
  Message,
  Collection,
  Role,
  VoiceConnection,
  StreamOptions,
  VoiceBroadcast,
} from 'discord.js'
import internal from 'stream'

export interface CommandClass {
  new (CommandConfig: CommandConfig): Command
  commandName: string
  aliases: string[]
  description: string
  permissions?: PermissionString[]
  minArguments: number
  usage: string
  example?: string
}

export interface Command {
  validator?: () => Promise<string[] | []> | string[] | []
  run: () => void | MessageEmbed | Promise<MessageEmbed>
}

export interface CommandConfig {
  message: Message
  embed: MessageEmbed
  messageArgs: string[]
}

export interface IsCall {
  (message: Message, messageArgs: string[]): boolean
}

export interface InvalidCall {
  ({
    embed,
    message,
    Command,
    messageArgs,
    permissions,
  }: {
    embed: MessageEmbed
    message: Message
    Command: CommandClass
    messageArgs: string[]
    permissions: {
      user: PermissionString[]
      bot: PermissionString[]
    }
  }): Promise<MessageEmbed> | MessageEmbed
}

export interface ErrorToRun {
  ({ embed, error }: { embed: MessageEmbed; error: Error }): MessageEmbed
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

export interface PlayMusic {
  (
    connection: VoiceConnection,
    stream: string | internal.Readable | VoiceBroadcast,
    streamOptions?: StreamOptions
  ): void
}
