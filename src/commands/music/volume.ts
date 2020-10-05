import { PermissionString, VoiceConnection } from 'discord.js'

import { Command, CommandConfig } from '../../types'

class Volume implements Command {
  private voiceConnection: Promise<VoiceConnection | null>
  private volume: number | null

  constructor(private commandConfig: CommandConfig) {
    const {
      message: {
        member: {
          voice: { channel },
        },
      },
      messageArgs,
    } = commandConfig

    this.voiceConnection = channel?.join().catch(() => null)
    this.volume = Number(messageArgs[1]) || null
  }

  static commandName = 'volume'
  static aliases = ['vol', 'vl']
  static description = 'Change or show the current stream volume'
  static minArguments = 0
  static permissions: PermissionString[] = ['CONNECT', 'SPEAK']
  static usage = 'volume [number, empty]'
  static example = 'volume 7'

  async validator() {
    const voiceConnection = await this.voiceConnection

    switch (true) {
      case !voiceConnection:
        return [
          ':red_circle: You need to be on a voice channel to change volume',
        ]

      case this.volume && (this.volume > 10 || this.volume < 0):
        return [':red_circle: Use value greater than 0 and less than 10']

      case !voiceConnection.dispatcher:
        voiceConnection.disconnect()
        return [":red_circle: I'm not stream anything on your voice channel"]

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { embed },
      voiceConnection,
      volume,
    } = this

    await voiceConnection
      .then(({ dispatcher, channel }) => {
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

export default Volume
