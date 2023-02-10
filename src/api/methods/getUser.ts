import { AxiosError } from 'axios'
import { axiosInstance } from '../index'
import { User } from '../../types/user'
import { isUnauthorized } from '../utils/isUnauthorized'

export function getUser(id?: string): Promise<User | null> {
  return axiosInstance
    .get<{data: User}>(
      id !== undefined ? `/users/get-by-id?userId=${id}` : '/users/get',
    )
    .then((result) => result.data.data)
    .catch((reason: AxiosError) => {
      isUnauthorized(reason)
      return null
    })
}
