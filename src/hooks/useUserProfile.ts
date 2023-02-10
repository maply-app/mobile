import { useEffect, useState } from 'react'
import { User } from '../types/user'
import { getUser } from '../api/methods/getUser'

type Result =
  | {
  status: 'loading' | 'error';
  data: null;
}
  | {
  status: 'success' | 'friend';
  data: User;
};

export function useUserProfile(id: string, friends: User[]): Result {
  const [result, setResult] = useState<Result>({
    status: 'loading',
    data: null,
  })

  useEffect(() => {
    const res = friends.find((friend) => friend.id === id)

    if (res) {
      setResult({
        status: 'friend',
        data: res,
      })
    } else {
      getUser(id).then((unknownUser) => {
        setResult(
          unknownUser
            ? {
              status: 'success',
              data: unknownUser,
            }
            : {
              status: 'error',
              data: null,
            },
        )
      })
    }
  }, [friends, id])

  return result
}
