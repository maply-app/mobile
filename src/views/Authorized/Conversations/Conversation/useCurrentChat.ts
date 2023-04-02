import { useStore } from 'effector-react'
import { useMemo } from 'react'
import { Chat } from '../../../../types/chat'
import { $chats } from '../../../../effector/user/store'
import { User } from '../../../../types/user'
import { addChat } from '../../../../effector/user/events'

export function useCurrentChat(user: User): Chat {
  const chats = useStore($chats)
  const chat = useMemo(() => chats.find((chat) => chat.user.id === user.id), [chats])

  if (chat) {
    return chat
  }

  const newChat = {
    messages: [],
    unreadMessages: 0,
    user,
    newChat: true,
  }

  addChat(newChat)
  return newChat
}
