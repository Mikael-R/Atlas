import { PermissionString, EmbedFieldData } from 'discord.js'

import commands from '.'
import { flag } from '../preferences.json'
import { Command, RunConfig } from '../types'
import listItems from '../utils/listItems'

class Help implements Command {
  name = 'help'
  aliases = ['h']
  description = 'Show commands or more information about specific command'
  minArguments = 0
  permissions: PermissionString[]
  usage = 'help [command, page number]'
  example = 'help 2'
  run({ embed, messageArgs }: RunConfig) {
    const description: string[] = []
    const fields: EmbedFieldData[] = []

    const maxCommandsInPage = 5

    const pageIndex = Number(messageArgs[1] || 1)
    const command: Command = commands.filter(
      cmd => cmd.name === messageArgs[1] || cmd.aliases.includes(messageArgs[1])
    )[0]

    if (pageIndex) {
      const commandsToPage: Command[] = listItems(
        commands,
        pageIndex,
        maxCommandsInPage
      )

      commandsToPage.forEach(({ name, description }) =>
        fields.push({ name, value: description })
      )
    } else if (command) {
      fields.push({ name: 'Name', value: `**${command.name}**` })
      fields.push({
        name: 'Aliases',
        value: command.aliases.toString().replace(',', ', '),
      })
      fields.push({
        name: 'Description',
        value: command.description,
      })
      command.permissions &&
        fields.push({
          name: 'Permissions',
          value: command.permissions
            .toString()
            .toLowerCase()
            .replace('_', ' ')
            .replace(',', ', '),
        })
      fields.push({
        name: 'Usage',
        value: `\`\`${flag}${command.usage}\`\``,
      })
      command.example &&
        fields.push({
          name: 'Example',
          value: `\`\`${flag}${command.example}\`\``,
        })
    } else {
      description.push(':nazar_amulet: You not informed a valid value')
      description.push(`:nazar_amulet: \`\`${flag}${this.usage}\`\``)
    }

    embed.setDescription(description.join('\n\n'))
    embed.addFields(fields)

    return embed
  }
}

export default Help
