import Discord from 'discord.js'
import dotev from 'dotenv'

import * as serviceCommands from '@service/commands'
import {
  getPreferences,
  updatePreference,
  existPreference
} from '@service/preferences'

dotev.config()

const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity('amor e alegria pro pessoal da taverna!')

  console.log(`Started: ${client.user.tag}`)
})

client.on('message', msg => {
  const command: Array<string> = msg.content.toLocaleLowerCase().replace(/\s{2,}/g, ' ').split(' ')

  const preferences = getPreferences()
  const embed: Discord.MessageEmbed = serviceCommands.createEmbed(preferences.title, preferences.color)

  console.log(command.join(' '), command)

  if (command[0] !== preferences.flag) {
    return null
  }

  if (!command[1]) {
    embed.setDescription(`:purple_circle: Nenhum parâmetro informado.\n\n:purple_circle: Use **${preferences.flag} ajuda** para ver a lista de comandos.`)
    msg.channel.send(embed)
  } else {
    switch (command.join(' ')) {
      case `${preferences.flag} ping`:
        msg.channel.send(serviceCommands.ping(embed, msg, client))
        break

      case `${preferences.flag} altere ${command[2]} ${command[3]}`:
        if (!existPreference(command[2])) {
          embed.setDescription(`:purple_circle: O parâmetro "${command[2]}" é inválido`)
          msg.channel.send(embed)
          break
        }

        updatePreference(command[2], command[3])
        embed.setDescription(`:purple_circle: Alterado: "${command[2]}" para "${command[3]}"`)
        msg.channel.send(embed)
        break
    }
  }
})

client.login(process.env.TOKEN)
