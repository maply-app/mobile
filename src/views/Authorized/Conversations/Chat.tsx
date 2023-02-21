import React from 'react'
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import { Badge } from 'react-native-paper'
import { Chat as ChatDTO } from '../../../types/chat'
import { Avatar } from '../../../components/Avatar'

interface Props {
  chat: ChatDTO;
  userId: string;
  navigate: (chat: ChatDTO) => void;
}

export function Chat({ chat, userId, navigate }: Props) {
  const lastMessage = chat.lastMessage?.senderId === userId
    ? `Вы: ${chat.lastMessage.text}` : chat.lastMessage?.text

  return (
    <TouchableOpacity style={styles.chat} onPress={() => navigate(chat)}>
      <Avatar user={chat.user} />
      <View style={styles.info}>
        <Text style={styles.userName}>{chat.user.name}</Text>
        <Text style={styles.messageText}>
          {chat.lastMessage ? lastMessage : ''}
        </Text>
      </View>

      {chat.unreadMessages > 0 && (
        <Badge size={24} style={styles.badge}>{chat.unreadMessages}</Badge>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  badge: {
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
  },

  chat: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 8,
  },

  info: {
    alignSelf: 'center',
    flexDirection: 'column',

    marginLeft: 12,
  },

  messageText: {
    color: 'rgba(255, 255, 255, .6)',
  },

  userName: {
    color: 'white',
    fontSize: 16,
  },
})
