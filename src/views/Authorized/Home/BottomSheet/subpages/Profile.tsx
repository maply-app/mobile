import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native'
import { useStore } from 'effector-react'
import { IconButton } from 'react-native-paper'
import { Avatar } from '../../../../../components/Avatar'
import { $friends, $requests, $user } from '../../../../../effector/user/store'
import { FriendButton } from '../../../../../components/FriendButton'
import { TabsView } from '../../../../../components/TabsView'
import { NavigationProps } from '../../../../../types/navigation'
import { useBottomSheetNavigation } from '../../../../../hooks/useBottomSheetNavigation'
import { themes } from '../../../../../const/theme'
import { User } from '../../../../../types/user'

export function Profile() {
  const user = useStore($user)!
  const friends = useStore($friends)
  const requests = useStore($requests)

  const navigation = useNavigation<NavigationProps>()
  const navigate = useBottomSheetNavigation()

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
          <IconButton
            icon="magnify"
            mode="contained"
            onPress={() => navigation.navigate('Search')}
            style={styles.commandBarButton}
          />
          <IconButton
            icon="cog"
            mode="contained"
            onPress={() => navigation.navigate('Settings')}
            style={styles.commandBarButton}
          />
        </View>
      </View>

      <TabsView
        headers={[
          <View style={styles.friendsTitleContainer} key="friends">
            <Text style={styles.friendsTitle}>Мои друзья</Text>
            <Text style={styles.friendsCounter}>
              {friends.length}
            </Text>
          </View>,
          <View style={styles.friendsTitleContainer} key="requests">
            <Text style={styles.friendsTitle}>Заявки в друзья</Text>
            <Text style={styles.friendsCounter}>
              {requests.received.length}
            </Text>
          </View>,
        ]}
        screens={[
          <View>
            {friends.length === 0 && (
              <Text style={styles.statusText}>У вас пока нет друзей</Text>
            )}

            {friends.map((friend, index) => (
              <TouchableOpacity
                onPress={() => navigate(friend, { openBottomSheet: false })}
                key={friend.id ?? index}
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
          </View>,
          <View>
            {requests.received.length === 0 && (
              <Text style={styles.statusText}>
                У вас пока нет заявок в друзья
              </Text>
            )}

            {requests.received.map(
              (request, index) => request.sender && (
              <View key={request.sender.id ?? index} style={styles.friendContainer}>
                <View style={styles.friendContainer}>
                  <Avatar user={request.sender as User} size={36} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>
                      {request.sender.name}
                    </Text>
                    <Text style={styles.friendNick}>
                      @
                      {request.sender.username}
                    </Text>
                  </View>
                </View>

                <View style={styles.friendButton}>
                  <FriendButton foundUser={request.sender} />
                </View>
              </View>
              ),
            )}
          </View>,
        ]}
      />
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

  statusText: {
    color: 'white',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '15%',
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
