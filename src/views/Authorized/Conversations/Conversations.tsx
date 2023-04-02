import React, { useCallback } from 'react'
import { useStore } from 'effector-react'
import { FlashList } from '@shopify/flash-list'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { $chats, $user } from '../../../effector/user/store'
import SafeArea from '../../../components/SafeArea'
import { Chat } from './Chat'
import { NavigationProps } from '../../../types/navigation'
import { Chat as ChatDTO } from '../../../types/chat'

export function Conversations() {
  const chats = useStore($chats)
  const user = useStore($user)!

  const { navigate } = useNavigation<NavigationProps>()
  const navigateToChat = useCallback(
    (chat: ChatDTO) => {
      navigate('Conversation', chat.user)
    },
    [navigate],
  )

  return (
    <SafeArea style={{ flex: 1 }}>
      <Text style={styles.title}>Чаты</Text>

      {chats.length > 0 ? (
        <FlashList
          estimatedItemSize={100}
          data={chats.filter((chat) => !chat.newChat)}
          renderItem={({ item }) => (
            <Chat
              chat={item}
              navigate={navigateToChat}
              userId={user.id}
            />
          )}
        />
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>\(o_o)/</Text>
          <Text style={styles.notFoundText}>У вас пока нет чатов</Text>
        </View>
      )}
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  notFound: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 240,
  },

  notFoundIcon: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    marginRight: 8,
    textAlign: 'center',
  },

  notFoundText: {
    color: 'white',
    fontSize: 18,
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginHorizontal: 32,
    marginTop: 16,
  },
})
