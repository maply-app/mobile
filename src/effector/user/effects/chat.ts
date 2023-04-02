import { createEffect } from 'effector'
import { axiosInstance } from '../../../api'
import { ApiAnswer } from '../../../types/web'
import {
  ApiChat, ApiMessage, Chat, Message,
} from '../../../types/chat'
import { User } from '../../../types/user'

interface ReadChatsProps {
  offset: number;
  count: number;
  user: User;
}

export const getChatsFx = createEffect(
  async ({ user, count, offset }: ReadChatsProps): Promise<Chat[]> => {
    const result = axiosInstance.get<ApiAnswer<ApiChat[]>>(`/chats/get?count=${count}&offset=${offset}`)
      .then((result) => result.data.data)
      .catch(() => [])

    return (await result).map((chat) => ({
      lastMessage: {
        senderId: chat.senderID,
        text: chat.text,
      },

      messages: [],
      user: chat.senderID === user.id ? chat.receiver : chat.sender,
      unreadMessages: chat.unreadMessages,
    }))
  },
)

interface GetMessagesProps {
  user: User;
  chat: Chat;
  offset: number;
}

export const getMessagesFx = createEffect(
  async ({ chat, offset, user }: GetMessagesProps): Promise<{ chat: Chat, messages: Message[], isEnd: boolean }> => {
    const result = axiosInstance.get<ApiAnswer<ApiMessage[]>>(`/chats/messages/get?offset=${offset}&receiverId=${chat.user.id}`)
      .then((res) => res.data.data)
      .catch(() => [])

    const messages = await result

    return {
      chat,
      isEnd: messages.length < 25,
      messages: messages.map((message) => ({
        id: message.id,
        text: message.text,

        isRead: message.isRead,
        time: new Date(message.createdAt),
        sender: message.senderID === user.id ? user : chat.user,
      })),
    }
  },
)

interface ReceivedMessageProps {
  chats: Chat[];
  message: ApiMessage;
}

export const messageReceivedFx = createEffect(async ({ chats, message }: ReceivedMessageProps) => {
  const chatToChange = chats.find((chat) => chat.user.id === message.senderID)

  if (!chatToChange) {
    return undefined
  }

  return {
    chat: chatToChange,
    message: {
      id: message.id,
      isRead: message.isRead,
      text: message.text,

      sender: chatToChange.user,
      time: new Date(message.createdAt),
    } as Message,
  }
})

export const sendMessageFx = createEffect(
  async (props: { chat: Chat; user: User; message: string }) => {
    await axiosInstance.post('/chats/messages/send', {
      receiverID: props.chat.user.id,
      text: props.message,
    })

    // workaround, awaiting info from backend
    return {
      message: {
        id: Math.random().toString(),
        sender: props.user,
        text: props.message,
        isRead: false,
        time: new Date(),
      } as Message,

      for: props.chat,
    }
  },
)
