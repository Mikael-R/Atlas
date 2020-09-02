import { MessageEmbed } from 'discord.js'
import { CreateEmbed } from 'src/types'

const createEmbed: CreateEmbed = options => {
  const embed = new MessageEmbed(options)

  return embed
}

export default createEmbed
