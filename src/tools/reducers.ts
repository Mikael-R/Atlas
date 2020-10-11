import { Moment } from 'moment'
import { Reducer } from 'redux'

type TCommandCooldownActionTypes = 'SET' | 'REMOVE-VALUE' | 'DELETE'
type TCommandCooldownStateKey = string
interface ICommandCooldownStateValue {
  commandName: string
  dateNow?: Moment
}

type TCommandCooldownState = Map<
  TCommandCooldownStateKey,
  ICommandCooldownStateValue[]
>

interface ICommandCooldownActionReturn {
  type: TCommandCooldownActionTypes
  value: {
    key: TCommandCooldownStateKey
    value?: ICommandCooldownStateValue
  }
}

export interface ICommandCooldownAction<V = ICommandCooldownStateValue> {
  (key: TCommandCooldownStateKey, value: V): ICommandCooldownActionReturn
}

const CommandCooldown: Reducer<
  TCommandCooldownState,
  ICommandCooldownActionReturn
> = (state = new Map(), action) => {
  switch (action.type) {
    case 'SET':
      state.set(
        action.value.key,
        state.has(action.value.key)
          ? [...state.get(action.value.key), action.value.value]
          : [action.value.value]
      )
      return state

    case 'REMOVE-VALUE':
      if (state.has(action.value.key)) {
        state.set(
          action.value.key,
          state
            .get(action.value.key)
            .filter(
              ({ commandName }) =>
                commandName !== action.value.value.commandName
            )
        )
      }
      return state

    case 'DELETE':
      state.delete(action.value.key)
      return state

    default:
      return state
  }
}

export default { CommandCooldown }
