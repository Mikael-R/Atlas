import randInt from '@utils/randInt'
import { Client, ActivityOptions } from 'discord.js'

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

  const index = randInt(0, status.length + 1)

  client.user.setActivity(status[index])
}

export default randomizeStatus
