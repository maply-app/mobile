import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import {
  ActivityIndicator,
  StyleSheet, Text, TextInput, View,
} from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useStore } from 'effector-react'
import { FlashList } from '@shopify/flash-list'
import SafeArea from '../../../../components/SafeArea'
import { getMessages, sendMessage } from '../../../../effector/user/events'
import { themes } from '../../../../const/theme'
import { Avatar } from '../../../../components/Avatar'
import { useCurrentChat } from './useCurrentChat'
import { $user } from '../../../../effector/user/store'
import { Message } from './Message'
import { getMessagesFx } from '../../../../effector/user/effects/chat'

function BackIcon({ color }: { color: string }) {
  return <Icon name="chevron-left" size={26} color={color} />
}

export function Conversation() {
  const user = useStore($user)!
  const chat = useCurrentChat()

  const isLoading = useStore(getMessagesFx.pending)

  const navigation = useNavigation()
  const { bottom } = useSafeAreaInsets()

  const [message, setMessage] = useState('')
  const messages = useMemo(() => (chat ? chat.messages : []), [chat?.messages])

  useEffect(() => {
    if (chat && !chat.newChat) {
      getMessages({ offset: 0, chat })
    }
  }, [])

  const send = useCallback(() => {
    if (chat) {
      sendMessage({ user, message, chat })
    }

    setMessage('')
  }, [message])

  if (!chat) {
    return null
  }

  return (
    <SafeArea forceInset={{ bottom: 'never' }} style={{ flex: 1, flexDirection: 'column' }}>
      <View style={styles.header}>
        <View style={styles.button}>
          <Button
            labelStyle={styles.buttonLabel}
            icon={BackIcon}
            onPress={() => navigation.goBack()}
          >
            Назад
          </Button>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{chat.user.name}</Text>
          <Text style={styles.username}>
            @
            {chat.user.username}
          </Text>
        </View>

        <View style={styles.avatar}>
          <Avatar user={chat.user} />
        </View>
      </View>

      {messages.length > 0 && !isLoading && (
        <View style={{ flex: 1 }}>
          <FlashList
            inverted
            estimatedItemSize={70}
            data={messages}
            renderItem={({ item }) => <Message userId={user.id} message={item} />}
          />
        </View>
      )}

      {messages.length === 0 && !isLoading && (
        <View style={{ flex: 1, marginTop: 260, alignItems: 'center' }}>
          <Text style={styles.nothing}>Здесь ничего нет...</Text>
        </View>
      )}

      {isLoading && (
        <View style={{ flex: 1, marginTop: 260, alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: bottom }]}>
        <TextInput
          style={styles.input}
          multiline
          value={message}
          autoCapitalize="none"
          onChangeText={setMessage}
          placeholder="Сообщение..."
          placeholderTextColor="#444444"
        />

        <IconButton icon="send" disabled={message.length === 0} onPress={send} />
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    bottom: 0,

    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: 0,
    zIndex: 3,
  },

  button: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',

    left: 0,
    position: 'absolute',

    top: 0,
    zIndex: 3,
  },

  buttonLabel: {
    color: themes.dark.primaryColor,
    fontSize: 16,
    marginLeft: 6,
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
  },

  info: {
    alignItems: 'center',

    bottom: 0,
    justifyContent: 'center',
    left: 0,

    position: 'absolute',
    right: 0,
    top: 6,
    zIndex: 2,
  },

  input: {
    backgroundColor: themes.dark.backgroundColor,
    borderRadius: 16,
    color: themes.dark.primaryColor,
    flex: 1,
    fontSize: 16,

    maxHeight: 120,
    paddingTop: 16,

    padding: 16,
  },

  inputContainer: {
    backgroundColor: '#171717',
    display: 'flex',

    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 6,

    paddingTop: 12,
  },

  name: {
    color: 'white',
    fontSize: 18,
  },

  nothing: {
    color: 'white',
  },

  username: {
    color: 'rgba(255, 255, 255, .4)',
    marginTop: 4,
  },
})
