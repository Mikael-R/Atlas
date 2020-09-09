import { Command, ServerInformation } from '../types'

const serverInformation: Command = {
  name: 'server-information',
  aliases: ['serverinfo', 'svinfo'],
  description: 'Show information about this server',
  minArguments: 0,
  usage: 'server-information',
  run: ({ message, embed }) => {
    const informations: ServerInformation = {
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
      .setFooter(`ID: ${informations.id}`)

    informations.premiumSubscriptionCount &&
      embed.addField(
        'Premium Subscription Count',
        informations.premiumSubscriptionCount
      )

    return embed
  },
}

export default serverInformation
