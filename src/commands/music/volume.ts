import { VoiceChannel, VoiceConnection } from 'discord.js'

import { Command, CommandConfig } from '../../types'

class Volume implements Command {
  private volume: number
  private voiceChannel: VoiceChannel
  private voiceConnection: Promise<VoiceConnection>

  constructor(private commandConfig: CommandConfig) {
    this.volume = Number(commandConfig.messageArgs[1])
    this.voiceChannel = commandConfig.message.member.voice.channel
    this.voiceConnection = this.voiceChannel?.join()
  }

  static commandName = 'volume'
  static aliases = ['vol', 'vl']
  static description = 'Change and show volume in voice channel'
  static minArguments = 0
  static usage = 'volume [number or empty to view current volume]'
  static example = 'volume 7'

  async validator() {
    const { voiceChannel, volume, commandConfig } = this
    const voiceConnection = await this.voiceConnection

    const permissions = voiceChannel.permissionsFor(
      commandConfig.message.client.user
    )

    switch (true) {
      case !voiceChannel:
        return [
          ':red_circle: You need to be on a voice channel to change volume',
        ]

      case !permissions.has('CONNECT') || !permissions.has('SPEAK'):
        return [
          ':red_circle: I need the permissions to join and speak in your voice channel',
        ]

      case volume > 10 || volume < 0:
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
      volume,
      voiceChannel,
      voiceConnection,
    } = this

    await voiceConnection
      .then(({ dispatcher }) => {
        const oldVolume = dispatcher.volume * 10

        if (volume) {
          dispatcher.setVolume(volume / 10)

          embed.setDescription(
            `:nazar_amulet: Changed volume in **${voiceChannel.name}**, **${oldVolume}** to **${volume}**`
          )
        } else {
          embed.setDescription(
            `:nazar_amulet: The current volume on **${voiceChannel.name}** is **${oldVolume}**`
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
