import Discord from 'discord.js'

const createEmbed = (title: string, color: string) => {
  return new Discord.MessageEmbed().setTitle(title).setColor(color)
}

const ping = (
  embed: Discord.MessageEmbed,
  msg: Discord.Message,
  client: Discord.Client
) => {
  const message = []

  message.push(':ping_pong: Pong!')
  message.push(`:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms`)
  message.push(`:purple_circle: Api: ${client.ws.ping}ms`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

export  {
  createEmbed,
  ping
}
