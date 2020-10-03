import { PermissionString, VoiceChannel } from 'discord.js'
import ytSearch from 'yt-search'
import ytdl from 'ytdl-core'

import { Command, CommandConfig, PlayMusic } from '../../types'

class Play implements Command {
  private voiceChannel: VoiceChannel
  private searchValue: string
  private videoSearchResult: Promise<ytSearch.VideoSearchResult>

  constructor(private commandConfig: CommandConfig) {
    const { message, messageArgs } = commandConfig

    this.voiceChannel = message.member.voice.channel

    this.searchValue = messageArgs.slice(1, messageArgs.length).join(' ')

    this.videoSearchResult = ytSearch(this.searchValue)
      .then(result => result.videos[0])
      .catch(() => null)
  }

  static commandName = 'play'
  static description = 'Plays audio from YouTube videos on voice channels'
  static minArguments = 1
  static permissions: PermissionString[] = ['CONNECT', 'SPEAK']
  static usage = 'play [name, url, id]'
  static example = 'play Sub Urban - Cradles'

  async validator() {
    switch (true) {
      case !this.voiceChannel:
        return [':red_circle: You need to be on a voice channel to play a song']

      case !(await this.videoSearchResult):
        return [':red_circle: No video found, check the search value provided']

      default:
        return []
    }
  }

  private playMusic: PlayMusic = (connection, stream, streamOptions) => {
    const dispatcher = connection.play(stream, streamOptions)

    dispatcher.on('error', error => {
      console.log(error)
      dispatcher.destroy(error)
      connection.channel.leave()
    })
    dispatcher.on('finish', () => connection.channel.leave())
  }

  async run() {
    const {
      commandConfig: { embed },
      voiceChannel,
      videoSearchResult,
      playMusic,
    } = this

    const video = await videoSearchResult

    const stream = ytdl(video.url, { filter: 'audioonly' })

    await voiceChannel
      .join()
      .then(connection => {
        embed.setTitle(`:nazar_amulet: ${video.title}`)
        embed.setURL(video.url)
        embed.setThumbnail(video.image)
        embed.addField('On Channel', voiceChannel.name, true)
        embed.addField('Duration', video.duration.timestamp, true)

        playMusic(connection, stream)
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
