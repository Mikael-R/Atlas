/* eslint-disable no-eval */
import { readdirSync } from 'fs'

import { Command } from 'src/types'

const commands: Command[] = []
const dir: string[] = readdirSync(__dirname)

dir.map(commandFile => {
  if (commandFile === '__index__.ts' || commandFile === '__index__.js') return
  eval(`const command = require('${__dirname}/${commandFile}');commands.push(command.default)`)
})

export default commands
