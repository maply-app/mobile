import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheet } from './BottomSheet/BottomSheet'
import { Map } from './Map/Map'

export function Home() {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.page, { paddingBottom: bottom }]}>
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
