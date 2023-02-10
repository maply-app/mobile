import React from 'react'
import { Portal } from '@gorhom/portal'
import {
  StyleSheet, View, Text, useWindowDimensions,
} from 'react-native'
import { useStore } from 'effector-react'
import { QrCodeSvg } from '@exzos28/react-native-qrcode-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconButton } from 'react-native-paper'
import * as Clipboard from 'expo-clipboard'
import { Avatar } from '../../../../../components/Avatar'
import { $user } from '../../../../../effector/user/store'
import { themes } from '../../../../../const/theme'

export function ShareCredentials() {
  const user = useStore($user)!
  const { top } = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()

  return (
    <Portal hostName="OuterContentHost">
      <View
        style={[
          styles.pageContainer,
          { paddingTop: top, width, height },
        ]}
      >
        <View style={styles.qrContainer}>
          <Avatar
            user={user}
            size={96}
            style={{
              position: 'absolute',
              zIndex: 2,

              alignSelf: 'center',
              marginTop: -48,
            }}
          />

          <QrCodeSvg
            style={styles.qr}
            value={`maply/user/${user.username}/${user.name}/${user.id}/${user.avatar}`}
            frameSize={250}
            dotColor="#1481d3"
            figurePathProps={{
              strokeWidth: 0.3,
              stroke: '#1481d3',
            }}
          />

          <View style={styles.credentials}>
            <Text style={styles.username}>
              @
              {user.username}
            </Text>

            <IconButton
              icon="content-copy"
              iconColor="#1481d3"
              onPress={() => Clipboard.setStringAsync(user.username)}
            />
          </View>
        </View>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  credentials: {
    alignItems: 'center',
    alignSelf: 'center',

    flexDirection: 'row',
    justifyContent: 'center',
  },

  pageContainer: {
    backgroundColor: themes.dark.backgroundColor,
  },

  qr: {
    alignSelf: 'center',
    borderRadius: 30,
    padding: 25,

    paddingTop: 48,
  },

  qrContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',

    borderRadius: 30,
    marginTop: 128,
    padding: 20,
  },

  username: {
    color: '#1481d3',
    fontSize: 24,
    fontWeight: 'bold',

    textAlign: 'center',
    textTransform: 'uppercase',
  },
})
