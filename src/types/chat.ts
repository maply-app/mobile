import { User } from './user'

export interface Message {
  id: string;
  text: string;
  isRead: boolean;

  time: Date;
  sender: User;
}

export interface Chat {
  lastMessage?: {
    senderId: string;
    text: string;
  };

  messages: Message[];

  user: User;
  unreadMessages: number;
}

export interface ApiChat {
  senderID: string;
  receiverID: string;
  text: string;

  sender: User;
  receiver: User;

  unreadMessages: number;
}

export interface ApiMessage {
  id: string
  senderID: string
  text: string
  isRead: boolean,
  createdAt: string
}
