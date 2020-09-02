import { OnServer } from '../types'

const added: OnServer = (embed, ownerName, serverName) => {
  const description: string[] = []

  description.push(`:robot: Hello **${ownerName}**`)
  description.push(`:blue_heart: Thanks for add me on **${serverName}**`)
  description.push(':nazar_amulet: Use $help on server to view my commands')
  description.push(
    ':mag_right: Access https://mikael-r.github.io/atlas to more information about me'
  )

  embed.setDescription(description.join('\n\n'))

  return embed
}

const removed: OnServer = (embed, ownerName, serverName) => {
  const description: string[] = []

  description.push(`:robot: Hello **${ownerName}**`)
  description.push(
    `:broken_heart: I was removed from server **${serverName}** and I expect helped you`
  )
  description.push(
    ':leaves: I will remember your server for 7 days, in case you add me again'
  )
  description.push(':nazar_amulet: Use $help on server to view my commands')
  description.push(
    ':mag_left: Access https://mikael-r.github.io/atlas to more information about me'
  )

  embed.setDescription(description.join('\n\n'))

  return embed
}

export default {
  added,
  removed,
}
