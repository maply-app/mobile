import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { IconButton } from 'react-native-paper'
import { useStore } from 'effector-react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Avatar } from '../../../../../components/Avatar'
import { useBottomSheetNavigation } from '../../../../../hooks/useBottomSheetNavigation'
import { useUserProfile } from '../../../../../hooks/useUserProfile'
import { $friends, $user } from '../../../../../effector/user/store'
import { FriendButton } from '../../../../../components/FriendButton'
import { themes } from '../../../../../const/theme'

export function UserPage({ route } : NativeStackScreenProps<{ User: { id: string } }, 'User'>) {
  const { id } = route.params

  const user = useStore($user)!
  const friends = useStore($friends)

  const { status, data: foundUser } = useUserProfile(id, friends)
  const navigate = useBottomSheetNavigation()

  useEffect(() => {
    if (foundUser) {
      navigate(foundUser, { openBottomSheet: false })
    }
  }, [foundUser])

  if (status === 'loading') {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator />
      </View>
    )
  }

  if (status === 'error' || !foundUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>Упс! Что-то пошло не так</Text>
      </View>
    )
  }

  return (
    <>
      <View style={styles.userInfoContainer}>
        <Avatar user={foundUser} size={48} />
        <View>
          <Text style={styles.userName}>{foundUser.name}</Text>
          <Text style={styles.userNick}>
            @
            {foundUser.username}
          </Text>
        </View>

        <View style={styles.commandBar}>
          {foundUser.info && (
            <IconButton
              icon="crosshairs-gps"
              mode="contained"
              style={styles.commandBarButton}
              onPress={() => navigate(foundUser, { openBottomSheet: false })}
            />
          )}
          <FriendButton foundUser={foundUser} onlyIcon />
        </View>
      </View>

      <View>
        <View style={styles.friendsTitleContainer}>
          <Text style={styles.friendsTitle}>
            Друзья
            {foundUser.name}
          </Text>
          <Text style={styles.friendsCounter}>
            {(foundUser.friends ?? []).length}
          </Text>
        </View>

        {foundUser.friends
          && foundUser.friends.map((friend) => (
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
