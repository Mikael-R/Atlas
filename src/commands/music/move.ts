import { PermissionString, VoiceConnection, VoiceState } from 'discord.js'

import { Command, CommandConfig } from '../../types'

class Move implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice
  }

  static commandName = 'move'
  static aliases = ['mv']
  static description = 'Move to voice channel'
  static permissions: PermissionString[] = ['CONNECT', 'MOVE_MEMBERS']
  static minArguments = 0
  static usage = 'move'

  validator() {
    switch (true) {
      case !this.memberVoiceState.channel:
        return [':red_circle: You need to be on a voice channel to move me']

      case !this.clientVoiceState.channel:
        return [":red_circle: I'm not connected in any channel"]

      case this.memberVoiceState?.channelID ===
        this.clientVoiceState?.channelID:
        return [
          `:red_circle: I'm already connected in \`\`${this.memberVoiceState.channel.name}\`\` channel`,
        ]

      default:
        return []
    }
  }

  private disconnectIfNotStreaming = (connection: VoiceConnection) => {
    const timer = setTimeout(() => {
      if (!connection.dispatcher) connection.channel.leave()

      clearTimeout(timer)
    }, 30000)
  }

  run() {
    const {
      commandConfig: { embed },
      memberVoiceState,
      clientVoiceState,
      disconnectIfNotStreaming,
    } = this

    clientVoiceState?.connection?.dispatcher?.destroy()

    memberVoiceState.channel
      .join()
      .then(connection => {
        disconnectIfNotStreaming(connection)

        embed.setDescription(
          `:nazar_amulet: Moved from \`\`${clientVoiceState.channel.name}\`\` to \`\`${connection.channel.name}\`\` channel`
        )
      })
      .catch(error => {
        console.error(error)
        embed.setDescription(
          ':red_circle: An error occurred while entering the voice channel'
        )
        embed.setColor('#E81010')
      })

    return embed
  }
}

export default Move
