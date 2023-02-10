import { AxiosError } from 'axios'
import { signOut } from '../../effector/user/events'

export function isUnauthorized(error: AxiosError) {
  if (error.response?.status === 401) {
    signOut()
  }
}
