import { VoiceState } from 'discord.js'

import { Command, CommandConfig } from '../../types'

class Leave implements Command {
  private clientVoiceState?: VoiceState

  constructor(private commandConfig: CommandConfig) {
    const { message } = commandConfig

    this.clientVoiceState = message.member.voice.channel?.members.find(
      ({ id }) => id === message.guild.me.id
    )?.voice
  }

  static commandName = 'leave'
  static aliases = ['lv', 'disconnect']
  static description = 'Leave from the current stream channel'
  static minArguments = 0
  static usage = 'leave'

  validator() {
    return !this.clientVoiceState?.connection
      ? [`:red_circle: I'm not connected in any channel`]
      : []
  }

  run() {
    const {
      commandConfig: { embed },
      clientVoiceState: { connection },
    } = this

    connection.channel.leave()
    connection.dispatcher?.destroy()

    embed.setDescription(
      `:nazar_amulet: Disconnected from the \`\`${connection.channel.name}\`\` channel`
    )

    return embed
  }
}

export default Leave
