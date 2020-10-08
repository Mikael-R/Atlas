import { Command, CommandConfig } from '@src/types'
import { VoiceState } from 'discord.js'

class Volume implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState
  private volume?: number

  constructor(private commandConfig: CommandConfig) {
    const { message, messageArgs } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice

    this.volume = Number(messageArgs[1])
  }

  static commandName = 'volume'
  static aliases = ['vl', 'vol']
  static description = 'Change or show the current stream volume'
  static minArguments = 0
  static usage = 'volume [number, empty]'
  static example = 'volume 7'

  validator() {
    switch (true) {
      case !this.memberVoiceState.channelID:
        return [
          ':red_circle: You need to be on a voice channel to change volume',
        ]

      case this.volume && (this.volume > 16 || this.volume < 0):
        return [':red_circle: Use value greater than 0 and less than 16']

      case !this.clientVoiceState?.connection?.dispatcher:
        return [":red_circle: I'm not stream anything on your voice channel"]

      default:
        return []
    }
  }

  run() {
    const {
      commandConfig: { embed },
      clientVoiceState: {
        connection: { dispatcher, channel },
      },
      volume,
    } = this

    const oldVolume = dispatcher.volume * 10

    if (volume) {
      dispatcher.setVolume(volume / 10)

      embed.setDescription(
        `:nazar_amulet: Changed the volume on the \`\`${channel.name}\`\` channel, **${oldVolume}** to **${volume}**`
      )
    } else {
      embed.setDescription(
        `:nazar_amulet: The current volume in the \`\`${channel.name}\`\` channel is **${oldVolume}**`
      )
    }
    return embed
  }
}

export default Volume
