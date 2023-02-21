import React, { useEffect, useState } from 'react'
import {
  StyleSheet, Text, View, TextInput,
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { useStore } from 'effector-react'
import { useDebouncedValue } from '@mantine/hooks'
import { $user } from '../../../effector/user/store'
import SafeArea from '../../../components/SafeArea'
import { Avatar } from '../../../components/Avatar'
import { FriendButton } from '../../../components/FriendButton'
import { useSearch } from './useSearch'
import { themes } from '../../../const/theme'

export function Search() {
  const user = useStore($user)!
  const { search, data, isLoading } = useSearch()

  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 500)

  const filteredUsers = data.filter((foundUser) => foundUser.id !== user.id)

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery])

  return (
    <SafeArea>
      <View style={styles.content}>
        <Text style={styles.title}>Поиск пользователей</Text>

        <Text style={styles.label}>Имя пользователя</Text>
        <TextInput
          placeholder="Введите имя пользователя"
          onChangeText={setQuery}
          autoCapitalize="none"
          placeholderTextColor={themes.dark.primaryColor}
          style={styles.field}
        />

        {!isLoading && filteredUsers && (filteredUsers.length > 0 && (
          <View style={styles.usersContainer}>
            {filteredUsers.map((foundUser) => (
              <View key={foundUser.id} style={styles.userContainer}>
                <View style={styles.userContainer}>
                  <Avatar size={40} user={foundUser} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{foundUser.name}</Text>
                    <Text style={styles.userNick}>
                      @
                      {foundUser.username}
                    </Text>
                  </View>
                </View>

                <View style={styles.friendButton}>
                  <FriendButton foundUser={foundUser} />
                </View>
              </View>
            ))}
          </View>
        ))}

        {!isLoading && filteredUsers.length === 0 && debouncedQuery && (
          <Text style={styles.statusText}>
            По вашему запросу ничего не найдено.
          </Text>
        )}

        {isLoading && debouncedQuery && (
          <ActivityIndicator style={styles.indicator} size={32} />
        )}
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: themes.dark.backgroundColor,
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  field: {
    backgroundColor: themes.dark.secondaryBackgroundColor,
    borderRadius: 8,
    borderWidth: 0,

    color: 'white',
    marginBottom: 6,

    marginTop: 6,
    padding: 12,
  },

  friendButton: {
    marginLeft: 'auto',
  },

  indicator: {
    marginTop: '8%',
  },

  label: {
    color: themes.dark.primaryColor,
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },

  statusText: {
    color: '#fff',
    marginTop: '8%',
    textAlign: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  userContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 12,
  },

  userInfo: {
    marginLeft: 12,
  },

  userName: {
    color: 'white',
    fontSize: 14,
    marginBottom: 2,
  },

  userNick: {
    color: 'white',
    fontSize: 14,
    opacity: 0.4,
  },

  usersContainer: {
    marginTop: 24,
  },
})
