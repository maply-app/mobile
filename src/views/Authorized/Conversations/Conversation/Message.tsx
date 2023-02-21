import React from 'react'
import {
  StyleSheet, Text, View, ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Message as MessageDTO } from '../../../../types/chat'
import { themes } from '../../../../const/theme'

interface Props {
  message: MessageDTO;
  userId: string;
}

export function Message({ message, userId }: Props) {
  return (
    <View style={styles.message}>
      <View style={message.sender.id === userId ? styles.your : styles.notYour}>
        <Text style={styles.text}>{message.text}</Text>
        <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
          <Text style={styles.time}>{message.time.toLocaleTimeString(['ru'], { minute: '2-digit', hour: '2-digit' })}</Text>
          {userId === message.sender.id && (
            <Icon
              name={message.isRead ? 'done-all' : 'done'}
              color="white"
              size={14}
              style={{ marginLeft: 4, opacity: message.isRead ? 0.8 : 0.6 }}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const baseMessageStyle: ViewStyle = {
  alignItems: 'center',

  borderRadius: 12,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',

  maxWidth: 250,
  paddingHorizontal: 12,
  paddingVertical: 8,
}

const styles = StyleSheet.create({
  message: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },

  notYour: {
    backgroundColor: themes.dark.secondaryBackgroundColor,
    borderBottomLeftRadius: 0,
    marginRight: 'auto',

    ...baseMessageStyle,
  },

  text: {
    color: 'white',
    fontSize: 15,
    marginRight: 6,
  },

  time: {
    color: 'white',
    fontSize: 12,
    opacity: 0.5,
  },

  your: {
    backgroundColor: '#1068c0',
    borderBottomRightRadius: 0,
    marginLeft: 'auto',

    ...baseMessageStyle,
  },
})
