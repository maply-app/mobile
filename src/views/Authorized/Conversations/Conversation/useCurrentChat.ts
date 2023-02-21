import {
  createEffect, createEvent, createStore, sample,
} from 'effector'
import { useStore } from 'effector-react'
import { Chat } from '../../../../types/chat'
import { $chats } from '../../../../effector/user/store'
import { User } from '../../../../types/user'

type UniversalChat = Chat & { newChat?: boolean }

export const selectChat = createEvent<User>()
export const selectedChatChanged = createEvent<Chat[]>()

const selectChatFx = createEffect(
  ({ user, chats } : { user: User, chats: Chat[] }) => chats.find((chat) => chat.user.id === user.id) ?? {
    user,
    messages: [],
    unreadMessages: 0,
  },
)

sample({
  clock: selectChat,
  source: $chats,

  fn: (chats, payload) => ({ user: payload, chats }),
  target: selectChatFx,
})

const $currentChat = createStore<UniversalChat | null>(null)
  .on(selectChatFx.doneData, (_, payload) => payload)
  .on(selectedChatChanged, (chat, chats) => {
    if (chat) {
      for (const c of chats) {
        if (c.user.id === chat.user.id) {
          return c
        }
      }
    }

    return chat
  })

sample({
  source: $chats,
  target: selectedChatChanged,
})

export function useCurrentChat() {
  return useStore($currentChat)
}
