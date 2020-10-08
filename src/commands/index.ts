import { CommandClass } from '@src/types'
import listDirSync from '@src/utils/listDirSync'

const commands: Map<string[], CommandClass> = new Map()

const includeFiles = /.+\/(command)\.[jt]s$/

const findCommand = (nameOrAliasse: string) =>
  commands.get(
    Array.from(commands.keys()).find(key => key.includes(nameOrAliasse))
  )

const addCommand = (filePath: string) => {
  const Command: CommandClass = require(filePath)?.default

  if (Command) {
    const key = [Command.commandName, ...(Command.aliases || [])]
    commands.set(key, Command)
  }
}

const run = (dirname: string) => {
  let { dirs, files } = listDirSync(dirname)

  files = files.filter(file => includeFiles.test(file))

  dirs.forEach(dirPath => run(dirPath))
  files.forEach(filePath => addCommand(filePath))
}

run(__dirname)

export { commands, findCommand }
