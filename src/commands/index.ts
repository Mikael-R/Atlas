import { readdirSync } from 'fs'
import { Command } from 'src/types'

const commands: Command[] = []
const exclude = ['index.ts', 'index.js']
const dir = readdirSync(__dirname).filter(file => !exclude.includes(file))

for (const file of dir) {
  const command: Command | undefined = require(`${__dirname}/${file}`).default

  if (!command) console.log(`Command ${__dirname}/${file} need default export`)
  else commands.push(command)
}

export default commands
