import React from 'react'
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import { useStore } from 'effector-react'
import { IconButton } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import SafeArea from '../../../components/SafeArea'
import { themes } from '../../../const/theme'
import { Avatar } from '../../../components/Avatar'
import { $user } from '../../../effector/user/store'
import { useSettingsNavigation } from './useSettingsNavigation'
import { NavigationProps } from '../../../types/navigation'

export function Settings() {
  const user = useStore($user)!
  const items = useSettingsNavigation()

  const { navigate } = useNavigation<NavigationProps>()

  return (
    <SafeArea style={styles.container}>
      <View style={styles.padding}>
        <View style={styles.info}>
          <Avatar user={user} size={54} />

          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>
              @
              {user.username}
            </Text>
          </View>

          <View style={styles.commandBar}>
            <IconButton
              style={styles.commandBarButton}
              icon="share"
              mode="contained"
              onPress={() => navigate('Share')}
            />
          </View>
        </View>

        <View style={{ marginTop: 32 }}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.key}
              disabled={item.disabled}
              onPress={item.action}
              style={[styles.navigationItem, item.containerStyle, item.disabled ? { opacity: 0.3 } : undefined]}
            >
              {item.icon && (
                <MaterialIcon name={item.icon.name} color="white" size={28} />
              )}

              {item.content && <Text style={[styles.navigationContent, item.contentStyle]}>{item.content}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  commandBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 'auto',
  },

  commandBarButton: {
    backgroundColor: themes.dark.secondaryBackgroundColor,
  },

  container: {
    backgroundColor: themes.dark.backgroundColor,
    flex: 1,
  },

  info: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  name: {
    color: themes.dark.primaryColor,
    fontSize: 18,
  },

  navigationContent: {
    color: themes.dark.primaryColor,
    marginLeft: 12,
  },

  navigationItem: {
    alignItems: 'center',
    display: 'flex',

    flexDirection: 'row',
    marginVertical: 12,
  },

  padding: {
    paddingHorizontal: 36,
    paddingVertical: 24,
  },

  userInfo: {
    marginLeft: 12,
  },

  username: {
    color: 'rgba(255, 255, 255, .7)',
    fontSize: 14,
    marginTop: 4,
  },
})
