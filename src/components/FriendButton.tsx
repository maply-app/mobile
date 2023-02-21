import React from 'react'
import { Button, IconButton } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { useStore } from 'effector-react'
import {
  FriendRequestUser, ReceivedRequest, SentRequest, User,
} from '../types/user'
import { $friends, $requests, $user } from '../effector/user/store'
import {
  acceptRequest, declineRequest, removeFriend, sendRequest,
} from '../effector/user/events'
import { $pending } from '../effector/ui/store'
import { themes } from '../const/theme'

type UserStatus =
  | {
  status: 'friend' | 'none';
}
  | {
  status: 'request_sent';
  data: SentRequest;
}
  | {
  status: 'request_received';
  data: ReceivedRequest;
};

function getUserStatus(
  userId: string,
  friends: User[],
  requests: { sent: SentRequest[], received: ReceivedRequest[] },
): UserStatus {
  if (friends.find((u) => u.id === userId)) {
    return {
      status: 'friend',
    }
  }

  {
    const data = requests.sent.find((request) => request.receiver.id === userId)

    if (data) {
      return {
        status: 'request_sent',
        data,
      }
    }
  }

  {
    const data = requests.received.find(
      (request) => request.sender.id === userId,
    )

    if (data) {
      return {
        status: 'request_received',
        data,
      }
    }
  }

  return {
    status: 'none',
  }
}

export function FriendButton({
  foundUser,
  onlyIcon,
}: { foundUser: User | FriendRequestUser; onlyIcon?: boolean }) {
  const user = useStore($user)!
  const friends = useStore($friends)
  const requests = useStore($requests)
  const pending = useStore($pending)

  if (user.id === foundUser.id) {
    return <Button disabled labelStyle={{ color: 'white', opacity: 0.5 }}>Это вы</Button>
  }

  const userInfo = getUserStatus(foundUser.id, friends, requests)
  switch (userInfo.status) {
    case 'friend': {
      return onlyIcon ? (
        <IconButton
          icon="account-remove"
          mode="contained"
          disabled={pending.removeFriend}
          style={styles.background}
          onPress={() => removeFriend(foundUser.id)}
        />
      ) : (
        <Button
          textColor="white"
          loading={pending.removeFriend}
          onPress={() => removeFriend(foundUser.id)}
        >
          Удалить
        </Button>
      )
    }
    case 'none': {
      return onlyIcon ? (
        <IconButton
          icon="account-plus"
          mode="contained"
          disabled={pending.sendRequest}
          style={styles.background}
          onPress={() => sendRequest(foundUser)}
        />
      ) : (
        <Button
          textColor="black"
          loading={pending.sendRequest}
          onPress={() => sendRequest(foundUser)}
          mode="contained"
        >
          Добавить
        </Button>
      )
    }
    case 'request_received': {
      return (
        <View style={styles.container}>
          {onlyIcon ? (
            <>
              <IconButton
                icon="account-plus"
                disabled={pending.acceptRequest}
                onPress={() => acceptRequest(userInfo.data)}
                mode="contained"
                style={[styles.margin, styles.background]}
              />
              <IconButton
                icon="close"
                onPress={() => declineRequest(userInfo.data)}
                disabled={pending.declineRequest}
              />
            </>
          ) : (
            <>
              <Button
                textColor="black"
                buttonColor="white"
                disabled={pending.acceptRequest}
                onPress={() => acceptRequest(userInfo.data)}
                mode="elevated"
                elevation={0}
                style={styles.margin}
              >
                Принять
              </Button>
              <IconButton
                icon="close"
                onPress={() => declineRequest(userInfo.data)}
                disabled={pending.declineRequest}
              />
            </>
          )}
        </View>
      )
    }
    case 'request_sent': {
      return onlyIcon ? (
        <IconButton
          icon="clock-time-five-outline"
          mode="contained"
          style={styles.background}
          disabled={pending.declineRequest}
          onPress={() => declineRequest(userInfo.data)}
        />
      ) : (
        <Button
          disabled={pending.declineRequest}
          textColor="white"
          onPress={() => declineRequest(userInfo.data)}
        >
          Отменить
        </Button>
      )
    }
    default: {
      return null
    }
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: themes.dark.secondaryBackgroundColor,
  },

  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  margin: {
    marginRight: '2%',
  },
})
