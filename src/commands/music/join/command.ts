import { Command, CommandConfig } from '@src/types'
import { PermissionString, VoiceConnection, VoiceState } from 'discord.js'

class Join implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice
  }

  static commandName = 'join'
  static aliases = ['jn', 'connect']
  static description = 'Connect in voice channel'
  static minArguments = 0
  static permissions = {
    client: ['CONNECT'] as PermissionString[],
  }

  static usage = 'join'

  validator() {
    switch (true) {
      case !this.memberVoiceState.channelID:
        return [':red_circle: You need to be on a voice channel to connect me']

      case !!this.clientVoiceState?.connection:
        return [
          `:red_circle: Im already connected in ${this.memberVoiceState.channel.name}`,
        ]

      default:
        return []
    }
  }

  private disconnectIfNotStreaming = (connection: VoiceConnection) => {
    const timer = setTimeout(() => {
      if (!connection.dispatcher) connection.channel.leave()

      clearTimeout(timer)
    }, 60000)
  }

  async run() {
    const {
      commandConfig: { embed },
      disconnectIfNotStreaming,
      memberVoiceState,
    } = this

    await memberVoiceState.channel
      .join()
      .then(connection => {
        disconnectIfNotStreaming(connection)

        embed.setDescription(
          `:nazar_amulet: Connected in the \`\`${connection.channel.name}\`\` channel`
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

export default Join
