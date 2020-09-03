import { Client, ActivityOptions } from 'discord.js'

import randInt from '../utils/randInt'

const randomizeStatus = (client: Client) => {
  const status: ActivityOptions[] = [
    { type: 'LISTENING', name: '$help' },
    { type: 'PLAYING', name: 'stone on the moon' },
    { type: 'STREAMING', name: 'love and happy' },
    {
      type: 'WATCHING',
      name: `${client.channels.cache.size} channels`,
    },
  ]

  const index = randInt(0, status.length)

  client.user.setActivity(status[index])
}

export default randomizeStatus
