import { Command, CommandConfig } from '@src/types'
import { VoiceState } from 'discord.js'

import { TSongsQueueStateValue } from '../reducers'
import musicStore from '../store'

class Skip implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState
  private skipFunction?: Function
  private songsInQueue?: TSongsQueueStateValue[]

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice

    this.skipFunction = this.clientVoiceState?.connection?.dispatcher
      ?.listeners('skip-song')
      .shift()

    this.songsInQueue = musicStore
      .getState()
      .songsQueue.get(this.clientVoiceState?.channel.id)
  }

  static commandName = 'skip'
  static aliases = ['sk', 'skp']
  static description = 'Skip the current stream'
  static cooldown = 3
  static minArguments = 0
  static usage = 'skip'

  validator() {
    const dispatcher = this.clientVoiceState?.connection?.dispatcher

    switch (true) {
      case !this.memberVoiceState.channelID:
        return [':red_circle: You need to be on a voice channel to skip song']

      case !dispatcher:
        return [":red_circle: I'm not stream anything on your voice channel"]

      case !this.songsInQueue[1]:
        return [':red_circle: Not have next song in queue']

      case !this.skipFunction:
        return [':red_circle: Not found skip function']

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { embed },
      clientVoiceState: { channel },
      songsInQueue,
      skipFunction,
    } = this

    const songs = {
      current: songsInQueue[0],
      previous: songsInQueue[1],
    }

    skipFunction()

    embed.setDescription(
      `:nazar_amulet: Skipped **[${songs.current.title}](${songs.current.url})** to **[${songs.previous.title}](${songs.previous.url})** in \`\`${channel.name}\`\``
    )

    return embed
  }
}

export default Skip
