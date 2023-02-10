import { AxiosError } from 'axios'
import { axiosInstance } from '../index'
import { User } from '../../types/user'
import { isUnauthorized } from '../utils/isUnauthorized'

export function search(query: string) {
  return axiosInstance
    .get<{data: User[]}>(`/users/find?username=${query}`)
    .then((res) => res.data.data)
    .catch((res: AxiosError) => {
      isUnauthorized(res)
      return []
    })
}
