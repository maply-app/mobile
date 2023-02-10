import { axiosInstance } from '../index'
import { NetworkRequestAnswer } from '../../types/web'

interface SignUpProps {
  name: string;
  username: string;
  email: string;
  password: string;
}

export function signUp(props: SignUpProps) {
  return axiosInstance
    .post<NetworkRequestAnswer<string>>('/auth/register', props)
    .then(() => true)
    .catch(() => false)
}
