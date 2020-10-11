import { ICommandCooldownAction } from './reducers'

const setUserInCooldown: ICommandCooldownAction = (key, value) => ({
  type: 'SET',
  value: { key, value },
})

const removeCommandFromCooldown: ICommandCooldownAction = (key, value) => ({
  type: 'REMOVE-VALUE',
  value: { key, value },
})

const deleteUserFromCooldown: ICommandCooldownAction<{}> = key => ({
  type: 'DELETE',
  value: { key },
})

export default {
  setUserInCooldown,
  removeCommandFromCooldown,
  deleteUserFromCooldown,
}
