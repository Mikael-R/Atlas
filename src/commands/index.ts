import requireDirectory, { RequireDirectoryOptions } from 'require-directory'

import { CommandClass } from '../types'

interface CommandEntries {
  '0': string
  '1': CommandClass
}

const options: RequireDirectoryOptions<any, any> = {
  extensions: ['ts', 'js'],
  visit: obj => obj?.default,
  exclude: /^index\.[jt]s$/,
  recurse: false,
}

const commandsInDirectory = requireDirectory(module, '.', options)

const commands = Object.entries(commandsInDirectory).map(
  (cmd: CommandEntries) => {
    cmd['0'] = [cmd['1'].commandName, ...cmd['1'].aliases].toString()
    return cmd
  }
)

const findCommand = (commandNameOrAliasse: string): null | CommandClass => {
  const foundCommand = commands.filter(cmd =>
    cmd[0].includes(commandNameOrAliasse)
  )
  const Command = foundCommand[0] ? foundCommand[0][1] : null
  return Command
}

export { commands, findCommand }
