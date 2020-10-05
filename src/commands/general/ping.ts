import { Command, CommandConfig } from '../../types'

class Ping implements Command {
  constructor(private commandConfig: CommandConfig) {}

  static commandName = 'ping'
  static aliases = ['pg', 'pong', 'latency']
  static description = 'Show bot ping in milliseconds on send message'
  static minArguments = 0
  static usage = 'ping'

  async run() {
    const { embed, message } = this.commandConfig

    embed.setDescription(':ping_pong: Pong!')

    embed.addField('Latency', `${Date.now() - message.createdTimestamp}ms`)
    embed.addField('API', `${message.client.ws.ping}ms`)

    return embed
  }
}

export default Ping
