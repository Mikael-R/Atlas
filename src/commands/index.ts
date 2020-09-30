import { Collection } from 'discord.js'
import { readdirSync } from 'fs'

import { CommandClass } from '../types'

const excludeRegex = /^index\.[jt]s$/
const includeRegex = /.+\.[jt]s$/

const commandFiles = readdirSync(__dirname).filter(
  filename => includeRegex.test(filename) && !excludeRegex.test(filename)
)

const commands: Collection<string[], CommandClass> = new Collection()

for (const filename of commandFiles) {
  const Command: CommandClass | undefined = require(`./${filename}`)?.default

  if (Command) {
    const key = [Command.commandName]
    Command?.aliases?.forEach(v => key.push(v))
    commands.set(key, Command)
  }
}

const findCommand = (nameOrAliasse: string) => {
  return commands.find((v, k) => k.includes(nameOrAliasse))
}

export { commands, findCommand }
