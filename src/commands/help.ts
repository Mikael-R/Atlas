import { PermissionString, EmbedFieldData } from 'discord.js'

import commands from '.'
import { flag } from '../preferences.json'
import replaceAll from '../tools/replaceAll'
import { Command, CommandConfig, CommandClass } from '../types'
import listItems from '../utils/listItems'

class Help implements Command {
  constructor(protected commandConfig: CommandConfig) {}

  static commandName = 'help'
  static aliases = ['h']
  static description =
    'Show commands or more information about specific command'

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
    const Command = commands.filter(
      cmd =>
        cmd.commandName === messageArgs[1] ||
        cmd.aliases.includes(messageArgs[1])
    )[0]

    const commandsToPage: CommandClass[] = listItems(
      commands,
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
        fields.push({
          name: 'Aliases',
          value: replaceAll(Command.aliases, ',', ', '),
        })
        fields.push({
          name: 'Description',
          value: Command.description,
        })
        Command.permissions &&
          fields.push({
            name: 'Permissions',
            value: replaceAll(
              replaceAll(Command.permissions, '_', ' '),
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
