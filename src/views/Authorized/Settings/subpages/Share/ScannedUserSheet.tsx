import React, { useRef } from 'react'
import {
  StyleSheet, Text, useWindowDimensions, View,
} from 'react-native'
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet'
import { FriendButton } from '../../../../../components/FriendButton'
import { Avatar } from '../../../../../components/Avatar'
import { User } from '../../../../../types/user'
import { themes } from '../../../../../const/theme'

export function ScannedUserSheet(props: SheetProps<{
    name: string;
    userName: string;
    avatar: string;
    id: string;
  }>) {
  const ref = useRef<ActionSheetRef>(null)
  const { payload, sheetId } = props
  const dimensions = useWindowDimensions()

  if (!payload) {
    return null
  }

  return (
    <ActionSheet
      ref={ref}
      indicatorStyle={{ backgroundColor: 'transparent' }}
      id={sheetId}
      containerStyle={{
        ...styles.sheetContent,
        width: dimensions.width - 24,
      }}
    >
      <View style={styles.sheetInfo}>
        <Avatar
          user={{ username: payload.userName, avatar: payload.avatar }}
          size={72}
          style={{
            alignSelf: 'center',
            marginBottom: 12,
          }}
        />

        <Text style={styles.sheetInfoUserName}>{payload.name}</Text>

        <FriendButton foundUser={payload as unknown as User} />
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  sheetContent: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: 24,
    overflow: 'hidden',
  },

  sheetInfo: {
    backgroundColor: themes.dark.backgroundColor,
    paddingHorizontal: 12,
    paddingVertical: 24,
  },

  sheetInfoUserName: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
})
