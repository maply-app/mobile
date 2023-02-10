import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BottomSheet } from './BottomSheet/BottomSheet'
import { Map } from './Map/Map'

export function Home() {
  return (
    <View style={styles.page}>
      <Map />
      <BottomSheet />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    height: '100%',
  },
})
