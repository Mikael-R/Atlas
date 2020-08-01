import * as Commands from '@service/commands/__index__'

import { Command } from 'src/types'

const help: Command = {
  name: 'help',
  aliases: ['h'],
  description: 'Show commands or more information about specific command',
  minArguments: 0,
  usage: '$help [command or empty to view list]',
  example: '$help ping',
  run: (message, embed, messageArgs) => {
    const description: string[] = []

    const command: Command = Commands.default.filter(cmd => cmd.name === messageArgs[1] || cmd.aliases.indexOf(messageArgs[1]) !== -1)[0]

    if (!command) {
      description.push(':nazar_amulet: Use ``$help [command]`` to view more information about specific command')

      Commands.default.map(cmd => embed.addField(cmd.name, cmd.description))
    } else {
      embed.addField('Name', command.name)
      embed.addField('Aliases', command.aliases.toString())
      embed.addField('Description', command.description)
      if (command.permissions) embed.addField('Permissions', command.permissions.toString())
      embed.addField('Usage', command.usage)
      if (command.example) embed.addField('Example', command.example)
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  }
}

export default help
