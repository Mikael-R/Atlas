import {
  Command,
  ServerInformation as ServerInformationType,
  CommandConfig,
} from '../../types'

class ServerInformation implements Command {
  constructor(private commandConfig: CommandConfig) {}

  static commandName = 'server-information'
  static aliases = ['serverinfo', 'svinfo']
  static description = 'Show information about this server'
  static minArguments = 0
  static usage = 'server-information'

  async run() {
    const {
      embed,
      message: { guild },
    } = this.commandConfig

    const infos: ServerInformationType = {
      name: guild.name,
      icon: guild.iconURL(),
      ownerNickname: guild.owner.user.tag,
      created: guild.createdAt.toUTCString(),
      region: guild.region,
      members: guild.memberCount,
      channels: guild.channels.cache.filter(
        channel => channel.deleted === false && channel.type !== 'category'
      ).size,
      premiumSubscriptionCount: guild.premiumSubscriptionCount,
      id: guild.id,
    }

    embed
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
