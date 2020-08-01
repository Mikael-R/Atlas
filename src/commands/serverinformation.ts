import { Command, ServerInformation } from 'src/types'

const serverinformation: Command = {
  name: 'serverinformation',
  aliases: ['serverinfo', 'svinfo'],
  description: 'Show information about this server',
  minArguments: 0,
  usage: '$serverinformation',
  run: (message, embed, messageArgs) => {
    const serverInformation: ServerInformation = {
      name: message.guild.name,
      icon: message.guild.iconURL(),
      ownerNickname: message.guild.owner.user.tag,
      created: message.guild.createdAt.toUTCString(),
      region: message.guild.region,
      members: message.guild.memberCount,
      channels: (() => {
        const existingChannels = message.guild.channels.cache.filter(channel => channel.deleted === false && channel.type !== 'category')
        return existingChannels.size
      })(),
      premiumSubscriptionCount: message.guild.premiumSubscriptionCount,
      id: message.guild.id
    }

    embed
      .setTitle('')
      .setAuthor(serverInformation.name)
      .setThumbnail(serverInformation.icon)
      .addField('Owner', serverInformation.ownerNickname)
      .addField('Created', serverInformation.created)
      .addField('Region', serverInformation.region, true)
      .addField('Members', serverInformation.members, true)
      .addField('Channels', (serverInformation.channels), true)
      .addField('Premium Subscription Count', serverInformation.premiumSubscriptionCount)
      .setFooter(`ID: ${serverInformation.id}`)

    return embed
  }
}

export default serverinformation
