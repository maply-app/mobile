import { createEffect } from 'effector'
import { axiosInstance } from '../../../api'
import {
  FriendRequestUser, ReceivedRequest, SentRequest, User,
} from '../../../types/user'
import { ApiAnswer } from '../../../types/web'
import { getUser } from '../../../api/methods/getUser'

export const sendRequestFx = createEffect(
  async (user: User | FriendRequestUser): Promise<SentRequest> => {
    const result = await axiosInstance.post<ApiAnswer<{ id: string }>>('/friends/requests/send', { receiverID: user.id })
    const receiver = await getUser(user?.id)

    if (!receiver) {
      throw new Error('Broken friend request')
    }

    return {
      id: result.data.data.id,
      receiver,
      receiverID: receiver.id,
    }
  },
)

export const declineRequestFx = createEffect(
  async (request: SentRequest | ReceivedRequest) => {
    await axiosInstance.get(`/friends/requests/cancel?requestID=${request.id}`)
    return request.id
  },
)

export const acceptRequestFx = createEffect(
  async (request: ReceivedRequest) => {
    await axiosInstance.get(`/friends/requests/confirm?requestID=${request.id}`)
    const user = await getUser(request.senderID)

    if (!user) {
      throw new Error('Broken friend request.')
    }

    return { user, requestId: request.id }
  },
)

export const removeFriendFx = createEffect(async (userId: string) => {
  await axiosInstance.delete(`/friends/delete?userId=${userId}`)
  return userId
})

export const wsRequestAcceptedFx = createEffect(async (request: SentRequest) => {
  const user = await getUser(request.receiverID)

  if (!user) {
    throw new Error('Broken friend request.')
  }

  return { requestId: request.id, user }
})
