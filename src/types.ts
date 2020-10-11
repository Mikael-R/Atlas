import { MessageEmbed, PermissionString, Message } from 'discord.js'

export interface CommandClass {
  new (CommandConfig: CommandConfig): Command
  commandName: string
  aliases: string[]
  description: string
  permissions?: {
    client?: PermissionString[]
    user?: PermissionString[]
  }
  cooldown?: number
  minArguments: number
  usage: string
  example?: string
}

export interface Command {
  validator?: () => Promise<string[] | []> | string[] | []
  run: () =>
    | Promise<MessageEmbed | MessageEmbed | void>
    | MessageEmbed
    | MessageEmbed
    | void
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
      client: PermissionString[]
      user: PermissionString[]
    }
  }): Promise<MessageEmbed> | MessageEmbed
}

export interface ErrorToRun {
  ({ embed, error }: { embed: MessageEmbed; error: Error }): MessageEmbed
}

export interface OnServer {
  (embed: MessageEmbed, ownerName: string, serverName: string): MessageEmbed
}
