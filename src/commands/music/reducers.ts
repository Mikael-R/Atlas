import { Reducer } from 'redux'

type TSongsQueueActionTypes = 'SET' | 'REMOVE-VALUE' | 'DELETE'
type TSongsQueueStateKey = string
type TSongsQueueStateValue = {
  url: string
  title: string
  duration: string
  userTagThatsRequest: string
}

type TSongsQueueState = Map<TSongsQueueStateKey, TSongsQueueStateValue[]>
interface ISongsQueueAction {
  type: TSongsQueueActionTypes
  value: {
    key: TSongsQueueStateKey
    value?: TSongsQueueStateValue
  }
}

const songsQueue: Reducer<TSongsQueueState, ISongsQueueAction> = (
  state = new Map(),
  action
) => {
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
            .filter(({ url }) => url !== action.value.value.url)
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

export default { songsQueue }
