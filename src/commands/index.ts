import { readdirSync } from 'fs'

import { Command, CommandClass } from '../types'

const commands: Command[] = []
const exclude = ['index.ts', 'index.js']
const dir = readdirSync(__dirname).filter(file => !exclude.includes(file))

for (const file of dir) {
  const Command: CommandClass | undefined = require(`${__dirname}/${file}`)
    .default

  if (!Command) console.log(`Command ${__dirname}/${file} need default export`)
  else commands.push(new Command())
}

export default commands
