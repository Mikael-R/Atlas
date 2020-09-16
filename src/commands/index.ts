import { readdirSync } from 'fs'

import { CommandClass } from '../types'

const commands: CommandClass[] = []
const exclude = ['index.ts', 'index.js']
const dir = readdirSync(__dirname).filter(file => !exclude.includes(file))

for (const file of dir) {
  const Command: CommandClass | undefined = require(`${__dirname}/${file}`)
    .default

  if (!Command) console.log(`Command ${__dirname}/${file} need default export`)
  else commands.push(Command)
}

export default commands
