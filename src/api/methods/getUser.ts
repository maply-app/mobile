import { axiosInstance } from '../index'
import { User } from '../../types/user'

export function getUser(id?: string): Promise<User | null> {
  return axiosInstance
    .get<{ data: User }>(
      id !== undefined ? `/users/get-by-id?userId=${id}` : '/users/get',
    )
    .then((result) => result.data.data)
    .catch(() => null)
}
