import { Collection } from 'discord.js'

import { CommandClass } from '../types'
import listDir from '../utils/listDir'

const commands: Collection<string[], CommandClass> = new Collection()

const excludeFiles = /index\.[jt]s$/
const includeFiles = /.+\.[jt]s$/

const findCommand = (nameOrAliasse: string) =>
  commands.find((v, k) => k.includes(nameOrAliasse))

const addCommand = (filePath: string) => {
  const Command: CommandClass | undefined = require(filePath)?.default

  if (Command) {
    const key = [Command.commandName]
    Command?.aliases?.forEach(v => key.push(v))
    commands.set(key, Command)
  }
}

const run = (dirname: string) => {
  let { dirs, files } = listDir(dirname)

  files = files.filter(
    file => includeFiles.test(file) && !excludeFiles.test(file)
  )

  files.forEach(filePath => addCommand(filePath))
  dirs.forEach(dirPath => run(dirPath))
}

run(__dirname)

export { commands, findCommand }
