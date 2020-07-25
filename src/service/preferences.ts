import { Preferences } from '@service/types'

const preferences: Preferences = {
  flag: '$',
  title: 'Bot Admin Discord',
  color: '#7c66c6'
}

const getPreferences = () => {
  return preferences
}

const existPreference = (parameter: string) => {
  return !!preferences[parameter]
}

const updatePreference = (parameter: string, value: string) => {
  preferences[parameter] = value
}

export {
  getPreferences,
  updatePreference,
  existPreference
}
