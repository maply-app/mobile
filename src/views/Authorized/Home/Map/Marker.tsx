import React, { useEffect } from 'react'
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MapboxGL from '@rnmapbox/maps'
import LinearGradient from 'react-native-linear-gradient'
import { useStore } from 'effector-react'
import { User, UserInfo } from '../../../../types/user'
import { $map } from '../../../../effector/ui/store'
import { Position } from '../../../../types/map'
import { Avatar } from '../../../../components/Avatar'

interface Props {
  user: User;
  onPress?: () => void;
}

function getBatteryIcon(percentage = 0) {
  if (percentage < 25) {
    return 'battery-empty'
  } if (percentage >= 25 && percentage < 50) {
    return 'battery-quarter'
  } if (percentage >= 50 && percentage < 75) {
    return 'battery-half'
  } if (percentage >= 75 && percentage < 95) {
    return 'battery-three-quarters'
  }

  return 'battery-full'
}

function checkIfInBounds(
  bounds: Position[],
  coords: UserInfo['coords']['geo']['coords'],
) {
  return (
    bounds[0][0] + 0.1 >= coords.lon
    && bounds[1][0] - 0.1 <= coords.lon
    && bounds[0][1] + 0.1 >= coords.lat
    && bounds[1][1] - 0.1 <= coords.lat
  )
}

export function UserMarker({ user, onPress }: Props) {
  const info = user.info!.coords

  const userInfo = {
    isOnline: info.isOnline,
    battery: info.info.battery,
    coords: [info.geo.coords.lon, info.geo.coords.lat],
    speed: info.geo.speed,
    moveDirection: info.geo.direction,
  }

  const map = useStore($map)

  const zoom = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(zoom.value, { duration: 200 }) }],
    }),
    [zoom.value],
  )

  const imageZoom = useSharedValue(1)
  const imageAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(imageZoom.value, { duration: 200 }) }],
    }),
    [imageZoom.value],
  )

  const dotAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(1 - imageZoom.value, { duration: 200 }) }],
    }),
    [imageZoom.value],
  )

  useEffect(() => {
    zoom.value = map.zoom > 12 ? 1 : 0
    imageZoom.value = map.zoom > 8 ? 1 : 0
  }, [imageZoom, map.zoom, zoom])

  const onlineAnimationValueX = useSharedValue(1)
  const onlineAnimationValueY = useSharedValue(1)

  const onlineAnimationStyle = useAnimatedStyle(
    () => ({
      transform: [
        { scaleX: onlineAnimationValueX.value },
        { scaleY: onlineAnimationValueY.value },
      ],
    }),
    [onlineAnimationValueX.value, onlineAnimationValueY.value],
  )

  useEffect(() => {
    if (!userInfo.isOnline) {
      cancelAnimation(onlineAnimationValueX)
      cancelAnimation(onlineAnimationValueY)
    } else {
      onlineAnimationValueX.value = withRepeat(
        withTiming(0.95, {
          duration: 1000,
        }),
        -1,
        true,
      )

      onlineAnimationValueY.value = withRepeat(
        withTiming(1.05, {
          duration: 1000,
        }),
        -1,
        true,
      )
    }
  }, [onlineAnimationValueX, onlineAnimationValueY, userInfo.isOnline])

  if (!checkIfInBounds(map.bounds, info.geo.coords)) {
    return null
  }

  return (
    <>
      <MapboxGL.MarkerView
        coordinate={userInfo.coords}
        anchor={{ x: 0.5, y: 0.5 }}
        allowOverlap={false}
        isSelected={false}
      >
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <View>
            {userInfo.isOnline && (
              <Animated.View style={animatedStyle}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.online}
                  colors={['#8BFAE3', '#9DB0F4', '#CF97F4']}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={styles.onlineText}
                  >
                    IN APP
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}

            <Animated.View style={[styles.marker, imageAnimatedStyle, onlineAnimationStyle]}>
              <Avatar radius={20} size={58} user={user} />
            </Animated.View>

            {false && (
              <Animated.View style={[styles.time, animatedStyle]}>
                <Text style={styles.timeText}>
                  2D
                  {'\n'}
                  11H
                </Text>
              </Animated.View>
            )}
          </View>

          <Animated.View style={[styles.batteryContainer, animatedStyle]}>
            <Icon
              name={getBatteryIcon(Math.abs(userInfo.battery ?? 0))}
              style={styles.batteryIcon}
            />
            <Text style={styles.batteryText}>
              {Math.abs(userInfo.battery ?? 0)}
              %
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </MapboxGL.MarkerView>
      {imageZoom.value === 0 && (
        <MapboxGL.MarkerView
          coordinate={userInfo.coords}
          anchor={{ x: 0.5, y: 0.5 }}
          allowOverlap={false}
          isSelected={false}
        >
          <TouchableOpacity onPress={onPress}>
            <Animated.View style={[styles.dot, dotAnimatedStyle]} />
          </TouchableOpacity>
        </MapboxGL.MarkerView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  batteryContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,

    bottom: -36,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 6,
    position: 'absolute',
  },

  batteryIcon: {},

  batteryText: {
    fontSize: 12,
    marginLeft: 6,
  },

  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    display: 'flex',

    flexDirection: 'column',
    justifyContent: 'center',
  },

  dot: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderRadius: 100,
    borderStyle: 'solid',
    borderWidth: 2,
    height: 12,
    width: 12,
  },

  marker: {
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
  },

  online: {
    borderRadius: 10,

    left: -2,
    padding: 6,
    position: 'absolute',
    top: -40,
  },

  onlineText: {
    flexWrap: 'nowrap',
    flex: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  time: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .7)',
    borderRadius: 10,
    bottom: -6,
    display: 'flex',

    justifyContent: 'center',
    left: -12,

    padding: 6,
    position: 'absolute',
    width: 36,
  },

  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
})
