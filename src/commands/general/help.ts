import { EmbedFieldData } from 'discord.js'

import { findCommand, commands } from '../../commands'
import { flag } from '../../preferences.json'
import { Command, CommandConfig, CommandClass } from '../../types'
import listItems from '../../utils/listItems'

class Help implements Command {
  constructor(protected commandConfig: CommandConfig) {}

  static commandName = 'help'
  static aliases = ['h', 'hp']
  static description = 'Show commands or more information about  command'
  static minArguments = 0
  static usage = 'help [command, page]'
  static example = 'help 2'

  async run() {
    const { embed, messageArgs } = this.commandConfig

    const description: string[] = []
    const fields: EmbedFieldData[] = []

    const maxCommandsInPage = 5

    const pageIndex = Number(messageArgs[1])
    const Command = findCommand(messageArgs[1])

    const commandsToPage: CommandClass[] = listItems(
      Array.from(commands.values()),
      pageIndex || 1,
      maxCommandsInPage
    )

    switch (true) {
      case !!pageIndex:
        commandsToPage.forEach(({ commandName, description }) =>
          fields.push({ name: commandName, value: description })
        )
        break

      case !!Command:
        fields.push({
          name: 'Command Name',
          value: `**${Command.commandName}**`,
        })
        Command.aliases &&
          fields.push({
            name: 'Aliases',
            value: Command.aliases?.join(', '),
          })
        fields.push({
          name: 'Description',
          value: Command.description,
        })
        Command.permissions &&
          fields.push({
            name: 'Permissions',
            value: Command.permissions
              .join(', ')
              .split('_')
              .join(' ')
              .toLowerCase(),
          })
        fields.push({
          name: 'Usage',
          value: `\`\`${flag}${Command.usage}\`\``,
        })
        Command.example &&
          fields.push({
            name: 'Example',
            value: `\`\`${flag}${Command.example}\`\``,
          })
        break

      default:
        commandsToPage.forEach(({ commandName, description }) =>
          fields.push({ name: commandName, value: description })
        )
    }

    embed.setDescription(description.join('\n\n'))
    embed.addFields(fields)

    return embed
  }
}

export default Help
