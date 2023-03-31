import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { IconButton } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { createEvent, createStore, sample } from 'effector'
import { createEffect } from 'effector/effector.cjs'
import { useStore } from 'effector-react'
import { Avatar } from '../../../../../components/Avatar'
import { useBottomSheetNavigation } from '../../../../../hooks/useBottomSheetNavigation'
import { FriendButton, getUserStatus } from '../../../../../components/FriendButton'
import { themes } from '../../../../../const/theme'
import { NavigationProps } from '../../../../../types/navigation'
import { selectChat } from '../../../Conversations/Conversation/useCurrentChat'
import { User } from '../../../../../types/user'
import { getUser } from '../../../../../api/methods/getUser'
import { $friends, $requests } from '../../../../../effector/user/store'

enum FetchStatus {
  Done = 'done',
  Failed = 'failed',
  Loading = 'loading'
}

type FetchResult = {
  status: FetchStatus.Done,
  payload: User
} | {
  status: FetchStatus.Failed,
  payload: null
} | {
  status: FetchStatus.Loading,
  payload: null
}

const getProfile = createEvent<string>()
const getProfileFx = createEffect((id: string) => getUser(id))

const $fetchResult = createStore<FetchResult>({ status: FetchStatus.Loading, payload: null })
  .on(getProfileFx.doneData, (_, payload) => (payload ? {
    status: FetchStatus.Done,
    payload,
  } : {
    status: FetchStatus.Failed,
    payload: null,
  }))
  .on(getProfileFx.failData, () => ({ status: FetchStatus.Failed, payload: null }))
  .on(getProfileFx.pending, (state, pending) => (pending ? { status: FetchStatus.Loading, payload: null } : state))

sample({
  clock: getProfile,
  target: getProfileFx,
})

export function UserPage({ route } : NativeStackScreenProps<{ User: { id: string } }, 'User'>) {
  const navigation = useNavigation<NavigationProps>()
  const { id } = route.params

  const friends = useStore($friends)
  const requests = useStore($requests)

  const navigate = useBottomSheetNavigation()
  const { status, payload: user } = useStore($fetchResult)

  useEffect(() => {
    getProfile(id)
  }, [])

  useEffect(() => {
    if (user) {
      navigate(user, { openBottomSheet: false })
    }
  }, [user])

  if (status === FetchStatus.Loading) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator />
      </View>
    )
  }

  if (status === FetchStatus.Failed) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>Упс! Что-то пошло не так</Text>
      </View>
    )
  }

  const userStatus = getUserStatus(user.id, friends, requests)

  return (
    <>
      <View style={styles.userInfoContainer}>
        <Avatar user={user} size={48} />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userNick}>
            @
            {user.username}
          </Text>
        </View>

        <View style={styles.commandBar}>
          {userStatus.status === 'friend' && (
            <IconButton
              icon="chat"
              mode="contained"
              style={styles.commandBarButton}
              onPress={() => {
                selectChat(user)
                navigation.navigate('Conversation')
              }}
            />
          )}

          {userStatus.status === 'friend' && user.info && (
            <IconButton
              icon="crosshairs-gps"
              mode="contained"
              style={styles.commandBarButton}
              onPress={() => navigate(user, { openBottomSheet: false })}
            />
          )}

          <FriendButton foundUser={user} onlyIcon />
        </View>
      </View>

      <View>
        <View style={styles.friendsTitleContainer}>
          <Text style={styles.friendsTitle}>
            Друзья
            {` ${user.name}`}
          </Text>
          <Text style={styles.friendsCounter}>
            {(user.friends ?? []).length}
          </Text>
        </View>

        {user.friends
          && user.friends.map((friend) => (
            <TouchableOpacity
              disabled={friend.id === user.id}
              onPress={() => navigate(friend, { openBottomSheet: false })}
              key={friend.id}
              style={styles.friendContainer}
            >
              <View style={styles.friendContainer}>
                <Avatar user={friend} size={36} />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendNick}>
                    @
                    {friend.username}
                  </Text>
                </View>
              </View>

              <View style={styles.friendButton}>
                <FriendButton foundUser={friend} />
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  commandBar: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
  },

  commandBarButton: {
    backgroundColor: themes.dark.secondaryBackgroundColor,
  },

  error: {
    color: 'white',
    fontSize: 18,
    margin: 'auto',
  },

  errorContainer: {
    alignItems: 'center',

    display: 'flex',

    flex: 1,
    justifyContent: 'center',
    marginTop: 64,
  },

  friendButton: {
    marginLeft: 'auto',
  },

  friendContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 12,
  },

  friendInfo: {
    marginLeft: 12,
  },

  friendName: {
    color: 'white',
    fontSize: 15,
    marginBottom: 4,
  },

  friendNick: {
    color: 'white',
    fontSize: 13,
    opacity: 0.4,
  },

  friendsCounter: {
    color: 'white',
    fontSize: 15,
    marginLeft: 8,
    opacity: 0.3,
  },

  friendsTitle: {
    color: 'white',
    fontSize: 18,
  },

  friendsTitleContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 32,
  },

  userInfoContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  userNick: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
    marginTop: 4,
    opacity: 0.4,
  },
})
