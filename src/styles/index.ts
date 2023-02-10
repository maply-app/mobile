import { Styles } from './types'
import { ViewStyle } from 'react-native'

function getAvatarStyle(size: number, borderRadius?: number): ViewStyle {
  return {
    width: size,
    height: size,
    borderRadius: borderRadius ?? 100,
  }
}

export const styles = {
  user: {
    avatar: {
      circle: {
        32: getAvatarStyle(32),
        48: getAvatarStyle(48),
        64: getAvatarStyle(64),
        96: getAvatarStyle(96),
        128: getAvatarStyle(128),
      },

      square: {
        32: getAvatarStyle(32, 0),
        48: getAvatarStyle(48, 0),
        64: getAvatarStyle(64, 0),
        96: getAvatarStyle(96, 0),
        128: getAvatarStyle(128, 0),
      }
    },

    nick: {

    },
  },
}
