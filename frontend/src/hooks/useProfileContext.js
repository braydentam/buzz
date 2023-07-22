import { ProfileContext } from '../context/profileContext'
import { useContext } from 'react'

export const useProfileContext = () => {
  const context = useContext(ProfileContext)

  if (!context) {
    throw Error('Need ProfileContextProvider')
  }

  return context
}