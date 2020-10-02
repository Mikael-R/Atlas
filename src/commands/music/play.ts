import { PermissionString, StreamOptions, VoiceChannel } from 'discord.js'
import ytSearch from 'yt-search'
import ytdl from 'ytdl-core'

import { Command, CommandConfig, PlayMusic } from '../../types'

class Play implements Command {
  private voiceChannel: VoiceChannel
  constructor(private commandConfig: CommandConfig) {
    this.voiceChannel = commandConfig.message.member.voice.channel
  }

  static commandName = 'play'
  static description = 'Plays audio from YouTube videos on voice channels'
  static permissions: PermissionString[] = ['MANAGE_CHANNELS']
  static minArguments = 1
  static usage = 'play [name]'
  static example = 'play Sub Urban - Cradles'

  validator() {
    return !this.voiceChannel
      ? [':red_circle: You need to be on a voice channel to play a song']
      : []
  }

  private playMusic: PlayMusic = (connection, stream, streamOptions) => {
    const dispatcher = connection.play(stream, streamOptions)

    dispatcher.on('close', () => connection.channel.leave())
  }

  async run() {
    const {
      commandConfig: { messageArgs, embed },
      voiceChannel,
    } = this

    const video = (await ytSearch(messageArgs[1])).videos[0]

    const stream = ytdl(video.url, { filter: 'audioonly' })

    const streamOptions: StreamOptions = {
      volume: 1,
    }

    await voiceChannel
      .join()
      .then(connection => {
        embed.setThumbnail(video.image)
        embed.addField(':nazar_amulet: Playing', `**${video.title}**`)
        embed.addField('On Channel', voiceChannel.name)
        embed.addField('Duration', video.duration.timestamp)

        this.playMusic(connection, stream, streamOptions)
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

export default Play
