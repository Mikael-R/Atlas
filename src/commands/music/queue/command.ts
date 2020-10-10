import { Command, CommandConfig } from '@src/types'
import listItems from '@src/utils/listItems'
import { VoiceState } from 'discord.js'

import { TSongsQueueStateValue } from '../reducers'
import musicStore from '../store'
import formatSecondsInTimeString from './formatSecondsInTimeString'

class Queue implements Command {
  private memberVoiceState: VoiceState
  private songsInQueue?: TSongsQueueStateValue[]

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.memberVoiceState = message.member.voice

    const clientVoiceState = this.memberVoiceState.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice

    this.songsInQueue = musicStore
      .getState()
      .songsQueue.get(clientVoiceState?.channel.id)
  }

  static commandName = 'queue'
  static aliases = ['qu']
  static description = 'Show musics in queue'
  static minArguments = 0
  static usage = 'queue [page]'
  static example = 'queue 2'

  validator() {
    switch (true) {
      case !this.memberVoiceState.channelID:
        return [':red_circle: You need to be on a voice channel to view queue']

      case !this.songsInQueue:
        return [':red_circle: Not have any song in queue']

      default:
        return []
    }
  }

  async run() {
    const {
      commandConfig: { embed, messageArgs },
      songsInQueue,
    } = this

    const upNextSongs = songsInQueue.slice(1)

    const nowSong = songsInQueue[0]

    const streamTimeInSeconds = songsInQueue
      .map(({ duration }) => duration)
      .reduce((duration, total) => duration + total)

    const pagination = {
      items: upNextSongs,
      pageActual: Number(messageArgs[1]) || 1,
      maxItemsInPage: 5,
    }

    const upNextContent = (listItems(
      pagination.items,
      pagination.pageActual,
      pagination.maxItemsInPage
    ) as TSongsQueueStateValue[])
      .map(
        (song, index) =>
          `\`\`${index + 1}.\`\` [${song.title}](${
            song.url
          }) | \`\`${formatSecondsInTimeString(song.duration)} Requested by: ${
            song.userTagThatsRequest
          }\`\``
      )
      .join('\n\n')

    const nowPlayingContent = `[${nowSong.title}](${
      nowSong.url
    }) | \`\`${formatSecondsInTimeString(nowSong.duration)} Requested by: ${
      nowSong.userTagThatsRequest
    }\`\``

    embed.setTitle(
      `Page ${pagination.pageActual}/${
        Math.ceil(pagination.items.length / pagination.maxItemsInPage) || 1
      }`
    )

    embed.setDescription(
      `${upNextSongs.length} songs in queue | ${formatSecondsInTimeString(
        streamTimeInSeconds
      )} total length`
    )

    embed.addField('__Now Playing:__', nowPlayingContent)

    if (upNextContent) embed.addField('__Up Next:__', upNextContent)

    return embed
  }
}

export default Queue
