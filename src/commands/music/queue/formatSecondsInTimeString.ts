const formatSecondsInTimeString = (seconds: number): string | null => {
  seconds = Number(seconds)

  if (isNaN(seconds)) return null

  const timeString = new Date(seconds * 1000).toISOString().substr(11, 8) // 'HH:MM:SS'

  if (timeString.substr(0, 2) === '00') return timeString.slice(3)

  return timeString
}

export default formatSecondsInTimeString
