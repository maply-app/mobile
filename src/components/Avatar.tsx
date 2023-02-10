import React from 'react'
import {
  Image, ImageStyle, Text, View,
} from 'react-native'
import { avatarsURL } from '../const/web'
import { User } from '../types/user'

interface Props {
  size?: number;
  radius?: number;

  user: Pick<User, 'username' | 'avatar'>

  style?: ImageStyle;
}

function componentToHex(c: number) {
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

function getInitialsColor(r: number, g: number, b: number) {
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#ffffff'
}

function getAvatarColors(nick: string) {
  const step = Math.trunc(nick.length / 3)

  const r = nick.charCodeAt(0)
  const g = nick.charCodeAt(step)
  const b = nick.charCodeAt(step + step)

  return {
    background: rgbToHex(r, g, b),
    initials: getInitialsColor(r, g, b),
  }
}

export function Avatar({
  size = 48, radius = 100, style, user,
}: Props) {
  function getAvatar(avatar: string) {
    if (avatar && avatar.startsWith('file')) {
      return avatar
    }

    return `${avatarsURL}/${avatar}`
  }

  if (!user.avatar) {
    if (user.username) {
      const colors = getAvatarColors(user.username)
      const initialsSize = size / 2

      return (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: colors.background,
            borderRadius: radius,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ color: colors.initials, fontWeight: 'bold', fontSize: initialsSize }}
          >
            {user.username[0].toUpperCase()}
          </Text>
        </View>
      )
    }

    return null
  }

  return (
    <Image
      style={[{ width: size, height: size, borderRadius: radius }, style]}
      source={{ uri: getAvatar(user.avatar) }}
    />
  )
}
