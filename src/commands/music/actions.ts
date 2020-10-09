const setSongToQueue = ({
  channelID,
  songInformation,
}: {
  channelID: string
  songInformation: {
    url: string
    title: string
    duration: string
    userTagThatsRequest: string
  }
}) => ({
  type: 'SET' as 'SET',
  value: {
    key: channelID,
    value: songInformation,
  },
})

const removeSongFromQueue = (channelID: string, songURL: string) => ({
  type: 'REMOVE-VALUE' as 'REMOVE-VALUE',
  value: {
    key: channelID,
    value: {
      url: songURL,
    },
  },
})

const deleteChannelFromQueue = (channelID: string) => ({
  type: 'DELETE' as 'DELETE',
  value: {
    key: channelID,
  },
})

export default {
  setSongToQueue,
  removeSongFromQueue,
  deleteChannelFromQueue,
}
