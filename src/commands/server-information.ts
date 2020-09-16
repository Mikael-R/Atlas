import {
  Command,
  ServerInformation as ServerInformationType,
  CommandConfig,
} from '../types'

class ServerInformation implements Command {
  constructor(private commandConfig: CommandConfig) {}

  static named = 'server-information'
  static aliases = ['serverinfo', 'svinfo']
  static description = 'Show information about this server'
  static minArguments = 0
  static usage = 'server-information'

  async run() {
    const { embed, message } = this.commandConfig

    const infos: ServerInformationType = {
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
      .setAuthor(infos.name)
      .setThumbnail(infos.icon)
      .addField('Owner', infos.ownerNickname)
      .addField('Created', infos.created)
      .addField('Region', infos.region, true)
      .addField('Members', infos.members, true)
      .addField('Channels', infos.channels, true)
    infos.premiumSubscriptionCount &&
      embed.addField(
        'Premium Subscription Count',
        infos.premiumSubscriptionCount
      )
    embed.addField('ID', infos.id)

    return embed
  }
}

export default ServerInformation
