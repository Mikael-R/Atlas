import { Command, CommandConfig } from '@src/types'
import { VoiceState } from 'discord.js'

import musicStore from '../store'

class Pause implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice
  }

  static commandName = 'pause'
  static aliases = ['ps', 'stop']
  static description = 'Pause the current stream'
  static minArguments = 0
  static usage = 'pause'

  validator() {
    const dispatcher = this.clientVoiceState?.connection?.dispatcher

    switch (true) {
      case !this.memberVoiceState.channelID:
        return [
          ':red_circle: You need to be on a voice channel to continue stream',
        ]

      case !dispatcher:
        return [":red_circle: I'm not stream anything on your voice channel"]

      case dispatcher?.paused:
        return [':red_circle: Stream already paused']

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { embed },
      clientVoiceState: { connection, channel },
    } = this

    const pauseFunction =
      connection.dispatcher.listeners('pause-stream-and-dispatcher')[0] ||
      connection.dispatcher.pause

    pauseFunction()

    const nextSongInQueue = musicStore
      .getState()
      .songsQueue.get(connection.channel.id)[0]

    embed.setDescription(
      `:nazar_amulet: Paused **[${nextSongInQueue.title}](${nextSongInQueue.url})** in \`\`${channel.name}\`\``
    )

    return embed
  }
}

export default Pause
