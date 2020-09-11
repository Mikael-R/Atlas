import { Command, RunConfig } from '../types'

class Ping implements Command {
  name = 'ping'
  aliases = ['p', 'pong', 'latency']
  description = 'Show bot ping in milliseconds on send message'
  minArguments = 0
  usage = 'ping'
  run({ message, embed }: RunConfig) {
    embed.setDescription(':ping_pong: Pong!')

    embed.addField('Latency', `${Date.now() - message.createdTimestamp}ms`)
    embed.addField('API', `${message.client.ws.ping}ms`)

    return embed
  }
}

export default Ping
