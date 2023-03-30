import { ImagePickerResult } from 'expo-image-picker'
import { createEvent } from 'effector'
import {
  FriendRequestUser,
  ReceivedRequest, SentRequest, User, UserInfo,
} from '../../types/user'
import { ApiMessage, Chat } from '../../types/chat'

export type SignUpEventProps = { name: string; username: string; email: string; password: string }
export type UpdateSettingsEventProps = { name?: string; username?: string; image?: ImagePickerResult }

export interface UpdateUserInfoProps {
  lat?: number | null;
  lon?: number | null;
  speed?: number | null;
  direction?: number | null;
  battery?: number | null
}

export const getToken = createEvent()
export const getProfile = createEvent()

export const signIn = createEvent<{ email: string; password: string }>()
export const signOut = createEvent()
export const signUp = createEvent<SignUpEventProps>()

export const updateInfo = createEvent<UpdateUserInfoProps | undefined>()

export const sendRequest = createEvent<User | FriendRequestUser>()
export const declineRequest = createEvent<SentRequest | ReceivedRequest>()
export const acceptRequest = createEvent<ReceivedRequest>()
export const removeFriend = createEvent<string>()

export const requestSent = createEvent<SentRequest>()
export const requestReceived = createEvent<ReceivedRequest>()
export const requestDeclined = createEvent<string>() // request id
export const requestAccepted = createEvent<string>() // request id

export const wsUpdateFriendsLocation = createEvent<{ [key: string]: UserInfo }>()
export const wsRequestAccepted = createEvent<SentRequest>()

export const friendAdded = createEvent<User>()
export const friendRemoved = createEvent<string>() // user id

export const addChat = createEvent<Chat>()
export const getMessages = createEvent<{ chat: Chat; offset: number }>()
export const wsMessageReceived = createEvent<ApiMessage>()
export const wsMessagesRead = createEvent<string>() // user id
export const sendMessage = createEvent<{ chat: Chat; user: User; message: string }>()
