import commands from '.'
import { flag } from '../prefererences.json'
import { Command } from '../types'

const help: Command = {
  name: 'help',
  aliases: ['h'],
  description: 'Show commands or more information about specific command',
  minArguments: 0,
  usage: 'help [command or empty to view list]',
  example: 'help ping',
  run: async ({ embed, messageArgs }) => {
    const description: string[] = []

    const command: Command = commands.filter(
      cmd => cmd.name === messageArgs[1] || cmd.aliases.includes(messageArgs[1])
    )[0]

    if (!command) {
      description.push(
        `:nazar_amulet: Use \`\`${flag}help [command]\`\` to view more information about specific command`
      )

      commands.forEach(cmd => embed.addField(cmd.name, cmd.description))
    } else {
      embed.addField('Name', `**${command.name}**`)
      embed.addField('Aliases', command.aliases.toString().replace(',', ', '))
      embed.addField('Description', command.description)
      command.permissions &&
        embed.addField(
          'Permissions',
          command.permissions
            .toString()
            .toLowerCase()
            .replace('_', ' ')
            .replace(',', ', ')
        )
      embed.addField('Usage', `\`\`${flag}${command.usage}\`\``)
      command.example &&
        embed.addField('Example', `\`\`${flag}${command.example}\`\``)
    }

    embed.setDescription(description.join('\n\n'))

    return embed
  },
}

export default help
