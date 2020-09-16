import { PermissionString, EmbedFieldData } from 'discord.js'

import commands from '.'
import { flag } from '../preferences.json'
import { Command, CommandConfig, CommandClass } from '../types'
import listItems from '../utils/listItems'

class Help implements Command {
  constructor(protected commandConfig: CommandConfig) {}

  static named = 'help'
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
        cmd.named === messageArgs[1] || cmd.aliases.includes(messageArgs[1])
    )[0]

    const commandsToPage: CommandClass[] = listItems(
      commands,
      pageIndex || 1,
      maxCommandsInPage
    )

    switch (true) {
      case !!pageIndex:
        commandsToPage.forEach(({ named, description }) =>
          fields.push({ name: named, value: description })
        )
        break

      case !!Command:
        fields.push({ name: 'Name', value: `**${Command.name}**` })
        fields.push({
          name: 'Aliases',
          value: Command.aliases.toString().replace(',', ', '),
        })
        fields.push({
          name: 'Description',
          value: Command.description,
        })
        Command.permissions &&
          fields.push({
            name: 'Permissions',
            value: Command.permissions
              .toString()
              .toLowerCase()
              .replace('_', ' ')
              .replace(',', ', '),
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
        commandsToPage.forEach(({ named, description }) =>
          fields.push({ name: named, value: description })
        )
    }

    embed.setDescription(description.join('\n\n'))
    embed.addFields(fields)

    return embed
  }
}

export default Help
