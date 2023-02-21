import { axiosInstance } from '../index'
import { User } from '../../types/user'

export function search(query: string) {
  return axiosInstance
    .get<{data: User[]}>(`/users/find?username=${query}`)
    .then((res) => res.data.data)
}
