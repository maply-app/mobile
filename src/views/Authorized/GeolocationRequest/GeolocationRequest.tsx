import React from 'react'
import { useBackgroundPermissions, useForegroundPermissions } from 'expo-location'
import Animated, { FadeInDown } from 'react-native-reanimated'
import {
  View, StyleSheet, Text,
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button } from 'react-native-paper'

export function GeolocationRequest() {
  const [, requestBackground] = useBackgroundPermissions()
  const [, requestForeground] = useForegroundPermissions()

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={{ height: 96, marginBottom: 35, width: 100 }}>
          <Animated.View entering={FadeInDown.duration(1000).delay(500)}>
            <MaterialIcon style={styles.marker} name="map-marker" color="white" size={96} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(1000).delay(700)}>
            <MaterialIcon style={styles.question} name="help" color="white" size={48} />
          </Animated.View>
        </View>

        <Text style={styles.title}>Упс! Похоже, у нас нет доступа к вашей геолокации.</Text>
        <Text style={styles.text}>Нажмите на кнопку ниже, чтобы разрешить Maply доступ к вашей геолокации.</Text>

        <Button
          onPress={() => {
            requestForeground().then(requestBackground)
          }}
          textColor="black"
          buttonColor="white"
          style={{ marginTop: 12, width: 130 }}
        >
          Разрешить
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',

    maxWidth: 350,
  },

  marker: {
    marginLeft: -30,
    position: 'absolute',
    transform: [
      { rotate: '-20deg' },
    ],
  },

  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  question: {
    marginLeft: 50,
    position: 'absolute',
    transform: [
      { rotate: '20deg' },
    ],
  },

  text: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    marginVertical: 8,

    textAlign: 'center',
  },

  title: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
})
