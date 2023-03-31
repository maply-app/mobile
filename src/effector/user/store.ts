import { createStore, guard, sample } from 'effector'
import { ReceivedRequest, SentRequest, User } from '../../types/user'
import {
  acceptRequest, declineRequest,
  friendAdded,
  friendRemoved, getToken, getProfile, removeFriend,
  requestAccepted,
  requestDeclined,
  requestReceived,
  requestSent, sendRequest, signIn,
  signOut, signUp, updateInfo, wsRequestAccepted,
  wsUpdateFriendsLocation, wsMessageReceived, wsMessagesRead, getMessages, addChat, sendMessage,
} from './events'
import {
  getProfileFx,
  getTokenFromStoreFx,
  getUserRequestsFx,
  signInFx,
  signUpFx,
  updateInfoFx,
  updateTokenFx,
} from './effects/user'
import {
  acceptRequestFx, declineRequestFx, removeFriendFx, sendRequestFx, wsRequestAcceptedFx,
} from './effects/friends'
import { Chat } from '../../types/chat'
import {
  getChatsFx, getMessagesFx, messageReceivedFx, sendMessageFx,
} from './effects/chat'

export const $token = createStore<string | null>(null)
  .on(getTokenFromStoreFx.doneData, (_, payload) => payload)
  .on(signInFx.doneData, (_, payload) => payload)
  .on(getProfileFx.failData, () => null)
  .on(signOut, () => null)

export const $friends = createStore<User[]>([])
  .on(getProfileFx.doneData, (_, payload) => payload.friends ?? [])
  .on(friendAdded, (state, payload) => [...state, payload])
  .on(friendRemoved, (state, payload) => state.filter((friend) => friend.id !== payload))
  .on(wsUpdateFriendsLocation, (state, payload) => {
    const newFriends = [...state]
    const entries = Object.entries(payload)

    for (const [userId, userInfo] of entries) {
      const friend = newFriends.find((user) => user.id === userId)

      if (friend) {
        friend.info = userInfo
      }
    }

    return newFriends
  })
  .on(signOut, () => [])

export const $user = createStore<User | null>(null)
  .on(getProfileFx.doneData, (_, payload) => payload)
  .on(updateInfoFx.doneData, (state, payload) => {
    if (!state) return state

    return {
      ...state,
      info: payload,
    }
  })
  .on(signOut, () => null)

type RequestsStore = { sent: SentRequest[]; received: ReceivedRequest[] }

export const $requests = createStore<RequestsStore>({ sent: [], received: [] })
  .on(getUserRequestsFx.doneData, (_, payload) => payload)
  .on(requestSent, (state, payload) => ({
    sent: [...state.sent, payload],
    received: state.received,
  }))
  .on(requestReceived, (state, payload) => ({
    sent: state.sent,
    received: [...state.received, payload],
  }))
  .on(requestAccepted, (state, payload) => ({
    sent: state.sent,
    received: state.received.filter((request) => request.id !== payload),
  }))
  .on(requestDeclined, (state, payload) => ({
    sent: state.sent.filter((request) => request.id !== payload),
    received: state.received.filter((request) => request.id !== payload),
  }))
  .on(signOut, () => ({ sent: [], received: [] }))

export const $chats = createStore<Chat[]>([])
  .on(addChat, (chats, payload) => [...chats, payload])
  .on(getChatsFx.doneData, (_, payload) => payload)
  .on(getMessagesFx.doneData, (chats, payload) => {
    for (const chat of chats) {
      if (chat.user.id === payload.chat.user.id) {
        chat.messages.push(...payload.messages)
      }
    }

    return [...chats]
  })
  .on(wsMessagesRead, (chats, userId) => {
    for (const chat of chats) {
      if (chat.user.id === userId) {
        for (const message of chat.messages) {
          message.isRead = true
        }
      }
    }

    return [...chats]
  })
  .on(messageReceivedFx.doneData, (chats, payload) => {
    if (!payload) return chats

    for (const chat of chats) {
      if (chat.user.id === payload.chat.user.id) {
        chat.messages.unshift(payload.message)
      }
    }

    return [...chats]
  })
  .on(sendMessageFx.doneData, (chats, payload) => {
    const target = chats.find((chat) => chat.user.id === payload.for.user.id)

    if (!target) {
      payload.for.messages.unshift(payload.message)
      return [...chats, payload.for]
    }

    target.messages.unshift(payload.message)
    return [...chats]
  })
  .on(signOut, () => [])

sample({
  clock: getToken,
  target: getTokenFromStoreFx,
})

sample({
  clock: updateTokenFx.doneData,
  source: $token,

  filter: (token) => Boolean(token),
  target: getProfileFx,
})

sample({
  clock: signIn,
  target: signInFx,
})

sample({
  clock: $token,
  target: updateTokenFx,
})

sample({
  clock: signUp,
  target: signUpFx,
})

sample({
  clock: updateInfo,
  source: $user,
  fn: (user, infoToUpdate) => ({ user, infoToUpdate }),
  target: updateInfoFx,
})

guard({
  clock: [updateTokenFx.doneData, getProfile],
  source: $token,
  target: getProfileFx,
  filter: (token) => !!token,
})

guard({
  clock: getProfileFx.doneData,
  target: [$user, getUserRequestsFx],
  filter: (user) => !!user,
})

// send request
sample({
  clock: sendRequestFx.doneData,
  target: requestSent,
})

// decline request
sample({
  clock: declineRequestFx.doneData,
  target: requestDeclined,
})

// accept request
sample({
  clock: acceptRequestFx.doneData,
  fn: ({ user }) => user,
  target: friendAdded,
})

sample({
  clock: acceptRequestFx.doneData,
  fn: ({ requestId }) => requestId,
  target: requestAccepted,
})
// end

// request accepted
sample({
  clock: wsRequestAcceptedFx.doneData,
  fn: ({ user }) => user,
  target: friendAdded,
})

sample({
  clock: wsRequestAcceptedFx.doneData,
  fn: ({ requestId }) => requestId,
  target: requestAccepted,
})
// end

sample({
  clock: sendRequest,
  target: sendRequestFx,
})

sample({
  clock: acceptRequest,
  target: acceptRequestFx,
})

sample({
  clock: declineRequest,
  target: declineRequestFx,
})

sample({
  clock: removeFriend,
  target: removeFriendFx,
})

sample({
  clock: removeFriendFx.doneData,
  target: friendRemoved,
})

sample({
  clock: wsRequestAccepted,
  target: wsRequestAcceptedFx,
})

sample({
  clock: wsMessageReceived,
  source: $chats,
  target: messageReceivedFx,

  fn: (chats, message) => ({ chats, message }),
})

sample({
  clock: getMessages,
  source: $user,
  target: getMessagesFx,

  filter: (user) => user !== null,
  fn: (user, payload) => ({ user: user as User, chat: payload.chat, offset: payload.offset }),
})

sample({
  clock: sendMessage,
  target: sendMessageFx,
})

sample({
  clock: getProfileFx.doneData,

  fn: (user) => ({ user, count: 25, offset: 0 }),
  target: getChatsFx,
})
