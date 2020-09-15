import {
  Command,
  RunConfig,
  ServerInformation as ServerInformationType,
} from '../types'

class ServerInformation implements Command {
  name = 'server-information'
  aliases = ['serverinfo', 'svinfo']
  description = 'Show information about this server'
  minArguments = 0
  usage = 'server-information'
  run({ message, embed }: RunConfig) {
    const informations: ServerInformationType = {
      name: message.guild.name,
      icon: message.guild.iconURL(),
      ownerNickname: message.guild.owner.user.tag,
      created: message.guild.createdAt.toUTCString(),
      region: message.guild.region,
      members: message.guild.memberCount,
      channels: (() => {
        const existingChannels = message.guild.channels.cache.filter(
          channel => channel.deleted === false && channel.type !== 'category'
        )
        return existingChannels.size
      })(),
      premiumSubscriptionCount: message.guild.premiumSubscriptionCount,
      id: message.guild.id,
    }

    embed
      .setTitle('')
      .setAuthor(informations.name)
      .setThumbnail(informations.icon)
      .addField('Owner', informations.ownerNickname)
      .addField('Created', informations.created)
      .addField('Region', informations.region, true)
      .addField('Members', informations.members, true)
      .addField('Channels', informations.channels, true)
    informations.premiumSubscriptionCount &&
      embed.addField(
        'Premium Subscription Count',
        informations.premiumSubscriptionCount
      )
    embed.addField('ID', informations.id)

    return embed
  }
}

export default ServerInformation