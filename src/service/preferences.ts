interface Preferences {
  flag: string,
  title: string,
  color: string
}

const preferences: Preferences = {
  flag: '$',
  title: 'bot-admin-discord',
  color: '#4e4784'
}

const getPreferences = () => {
  return preferences
}

const existPreference = (parameter: string) => {
  return preferences[parameter] ? true : false
}

const updatePreference = (parameter: string, value: string) => {
  preferences[parameter] = value
}

export {
  getPreferences,
  updatePreference,
  existPreference
}
