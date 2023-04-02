import React, {
  useCallback, useEffect, useState,
} from 'react'
import {
  ActivityIndicator,
  StyleSheet, Text, TextInput, View,
} from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStore } from 'effector-react'
import { FlashList } from '@shopify/flash-list'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import SafeArea from '../../../../components/SafeArea'
import { sendMessage } from '../../../../effector/user/events'
import { themes } from '../../../../const/theme'
import { Avatar } from '../../../../components/Avatar'
import { useCurrentChat } from './useCurrentChat'
import { $user } from '../../../../effector/user/store'
import { Message } from './Message'
import { getMessagesFx } from '../../../../effector/user/effects/chat'
import { ScreenProps } from '../../../../types/navigation'
import { User } from '../../../../types/user'
import { Chat } from '../../../../types/chat'

function BackIcon({ color }: { color: string }) {
  return <Icon name="chevron-left" size={26} color={color} />
}

function getPosition(index: number, length: number) {
  if (index === 0) {
    return 'last'
  }

  if (index === length - 1) {
    return 'first'
  }

  return 'middle'
}

export function Conversation({ navigation, route }: NativeStackScreenProps<ScreenProps, 'Conversation'>) {
  const user = useStore($user)!
  const chat = useCurrentChat(route.params)

  const isLoading = useStore(getMessagesFx.pending)
  const getMore = useCallback(
    () => getMessagesFx({ user, offset: chat.messages.length, chat }),
    [user, chat, chat.messages],
  )

  const { bottom } = useSafeAreaInsets()

  const { height } = useAnimatedKeyboard()
  const keyboardBlockStyles = useAnimatedStyle(() => ({
    height: height.value,
  }), [height.value])

  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!chat.newChat && !chat.messages.length) {
      void getMore()
    }
  }, [])

  const send = useCallback(() => {
    sendMessage({ user, message, chat })
    setMessage('')
  }, [message])

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

      {chat.messages.length > 0 && (
        <View style={{ flex: 1 }}>
          <FlashList
            onEndReached={() => {
              if (!chat.isEnd) void getMore()
            }}
            inverted
            data={chat.messages.map((message, index) => ({
              message,
              userId: user.id,
              position: getPosition(index, chat.messages.length) as 'last' | 'first' | 'middle',
            }))}
            renderItem={Message}
          />
        </View>
      )}

      {chat.messages.length === 0 && !isLoading && (
        <View style={{ flex: 1, marginTop: 260, alignItems: 'center' }}>
          <Text style={styles.nothing}>Здесь ничего нет...</Text>
        </View>
      )}

      {isLoading && (
        <View style={{ flex: chat.messages.length === 0 ? 1 : 0, marginTop: 260, alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: bottom - 4 }]}>
        <TextInput
          style={styles.input}
          multiline
          maxLength={255}
          value={message}
          autoCapitalize="none"
          onChangeText={setMessage}
          placeholder="Сообщение..."
          placeholderTextColor="#444444"
        />

        <IconButton icon="send" disabled={message.length === 0} onPress={send} />
      </View>

      <Animated.View style={keyboardBlockStyles} />
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
