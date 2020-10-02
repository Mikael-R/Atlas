import { PermissionString, EmbedFieldData } from 'discord.js'

import { findCommand, commands } from '../../commands'
import { flag } from '../../preferences.json'
import { Command, CommandConfig, CommandClass } from '../../types'
import listItems from '../../utils/listItems'
import replaceAll from '../../utils/replaceAll'

class Help implements Command {
  constructor(protected commandConfig: CommandConfig) {}

  static commandName = 'help'
  static aliases = ['h']
  static description = 'Show commands or more information about  command'
  static minArguments = 0
  static permissions: PermissionString[]
  static usage = 'help [command, page number]'
  static example = 'help 2'

  async run() {
    const { embed, messageArgs } = this.commandConfig

    const description: string[] = []
    const fields: EmbedFieldData[] = []

    const maxCommandsInPage = 5

    const pageIndex = Number(messageArgs[1])
    const Command = findCommand(messageArgs[1])

    const commandsToPage: CommandClass[] = listItems(
      commands.array(),
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
        fields.push({ name: 'Name', value: `**${Command.commandName}**` })
        Command.aliases &&
          fields.push({
            name: 'Aliases',
            value: replaceAll(Command.aliases?.toString() || '', ',', ', '),
          })
        fields.push({
          name: 'Description',
          value: Command.description,
        })
        Command.permissions &&
          fields.push({
            name: 'Permissions',
            value: replaceAll(
              replaceAll(Command.permissions.toString(), '_', ' '),
              ',',
              ', '
            ).toLowerCase(),
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
