import { Command, CommandConfig } from '@src/types'
import { VoiceState } from 'discord.js'

import musicStore from '../store'

class Resume implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice
  }

  static commandName = 'resume'
  static aliases = ['rs', 'continue']
  static description = 'Resume the current stream'
  static minArguments = 0
  static usage = 'resume'

  validator() {
    const dispatcher = this.clientVoiceState?.connection?.dispatcher

    switch (true) {
      case !this.memberVoiceState.channelID:
        return [
          ':red_circle: You need to be on a voice channel to continue stream',
        ]

      case !dispatcher:
        return [":red_circle: I'm not stream anything on your voice channel"]

      case !dispatcher?.paused:
        return [':red_circle: Stream not is paused']

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { embed },
      clientVoiceState: { connection, channel },
    } = this

    const resumeFunction =
      connection.dispatcher.listeners('resume-stream-and-dispatcher')[0] ||
      connection.dispatcher.resume

    resumeFunction()

    const nextSongInQueue = musicStore
      .getState()
      .songsQueue.get(connection.channel.id)[0]

    embed.setDescription(
      `:nazar_amulet: Resume **[${nextSongInQueue.title}](${nextSongInQueue.url})** in \`\`${channel.name}\`\``
    )

    return embed
  }
}

export default Resume
