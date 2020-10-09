import { Command, CommandConfig } from '@src/types'
import { PermissionString, StreamOptions, VoiceState } from 'discord.js'
import { search, VideoSearchResult } from 'yt-search'
import ytdl from 'ytdl-core-discord'

import songsActions from '../actions'
import songsStore from '../store'

class Play implements Command {
  private memberVoiceState: VoiceState
  private clientVoiceState?: VoiceState
  private searchValue?: string
  private songSearchResult?: Promise<VideoSearchResult | null>
  private streamOptions: StreamOptions

  constructor(private commandConfig: CommandConfig) {
    const { message, messageArgs } = commandConfig

    this.memberVoiceState = message.member.voice

    this.clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice

    this.searchValue = messageArgs.slice(1).join(' ')

    this.songSearchResult = search(this.searchValue)
      .then(result => result.videos[0])
      .catch(() => null)

    this.streamOptions = {
      type: 'opus',
      highWaterMark: 1024,
      volume: 0.4,
    }
  }

  static commandName = 'play'
  static aliases = ['p', 'pl']
  static description = 'Plays audio from YouTube videos on voice channels'
  static minArguments = 1
  static permissions: PermissionString[] = ['SPEAK']
  static usage = 'play [name, url, id]'
  static example = 'play Sub Urban - Cradles'

  async validator() {
    const songSearchResult = await this.songSearchResult

    switch (true) {
      case !this.memberVoiceState.channelID:
        return [':red_circle: You need to be on a voice channel to play a song']

      case !this.clientVoiceState?.connection:
        return [":red_circle: I'm not connected in any channel"]

      case !this.searchValue:
        return [':red_circle: Inform search value: video name, url or id']

      case !songSearchResult:
        return [':red_circle: No video found, check the search value provided']

      case songSearchResult.duration.seconds > 900: // 900 seconds = 15 minutes
        return [
          ':red_circle: Sorry, in this moment not is possible play musics more than 15 minutes',
        ]

      default:
        return []
    }
  }

  private startMusics = async () => {
    const {
      clientVoiceState: { connection },
      streamOptions,
      startMusics,
    } = this

    const song = songsStore.getState().songsQueue.get(connection.channel.id)[0]

    const stream = await ytdl(song.url, { filter: 'audioonly' })

    const dispatcher = connection.play(stream, streamOptions)

    const onHandleDisconnect = (error?: Error) => {
      dispatcher?.destroy(error)
      stream?.destroy(error)
      songsStore.dispatch(
        songsActions.deleteChannelFromQueue(connection.channel.id)
      )
    }

    const onError = (error: Error) => {
      console.error(error)
      onHandleDisconnect(error)
      connection.channel.leave()
    }

    connection.on('error', onError)
    connection.on('failed', onError)
    dispatcher.on('error', onError)
    stream.on('error', onError)

    connection.on('closing', onHandleDisconnect)
    connection.on('disconnect', onHandleDisconnect)

    stream.on('end', () => {
      songsStore.dispatch(
        songsActions.removeSongFromQueue(connection.channel.id, song.url)
      )

      const nextSongInQueue = songsStore
        .getState()
        .songsQueue.get(connection.channel.id)[0]

      if (!nextSongInQueue) {
        songsStore.dispatch(
          songsActions.deleteChannelFromQueue(connection.channel.id)
        )
        connection.channel.leave()
      } else {
        startMusics()
      }
    })

    dispatcher.addListener('pause-stream-and-dispatcher', () => {
      stream.pause()
      dispatcher.pause()
    })

    dispatcher.addListener('resume-stream-and-dispatcher', () => {
      stream.resume()
      dispatcher.resume()
    })
  }

  async run() {
    const {
      commandConfig: { embed },
      memberVoiceState: { member },
      clientVoiceState: {
        connection: { dispatcher, channel },
      },
      songSearchResult,
      startMusics,
    } = this

    const song = await songSearchResult

    songsStore.dispatch(
      songsActions.setSongToQueue({
        channelID: channel.id,
        songInformation: {
          url: song.url,
          title: song.title,
          duration: song.duration.timestamp,
          userTagThatsRequest: member.user.tag,
        },
      })
    )

    embed.setDescription(`:nazar_amulet: **[${song.title}](${song.url})**`)
    embed.setThumbnail(song.image)
    embed.addField('Channel', channel.name, true)
    embed.addField('Duration', song.duration.timestamp, true)

    const queueLength = songsStore.getState().songsQueue.get(channel.id).length

    if (queueLength > 1) {
      embed.addField('Position in queue', queueLength, true)
    } else {
      if (!dispatcher?.paused) startMusics()
    }

    return embed
  }
}

export default Play
