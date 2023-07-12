import { createContext, useReducer } from 'react'

export const BuzzContext = createContext()

export const buzzReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BUZZ': 
      return {
        buzz: action.payload
      }
    case 'CREATE_BUZZ':
      return {
        buzz: [action.payload, ...state.buzz]
      }
    case 'DELETE_BUZZ':
      return {
        buzz: state.buzz.filter((b) => b._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const BuzzContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(buzzReducer, {
    buzz: null
  })

  return (
    <BuzzContext.Provider value={{...state, dispatch}}>
      { children }
    </BuzzContext.Provider>
  )
}