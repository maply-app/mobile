import React, { useEffect, useMemo, useRef } from 'react'
import GorhomBottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { StyleSheet, View } from 'react-native'
import { changeBottomSheetRef } from '../../../../effector/ui/relations'
import createBottomSheetNavigator from './Navigation'
import { Profile } from './subpages/Profile'
import { UserPage } from './subpages/UserPage'
import { themes } from '../../../../const/theme'

const Navigator = createBottomSheetNavigator<{ Profile: undefined, User: { id: string } }>()

export function BottomSheet() {
  const ref = useRef<GorhomBottomSheet>(null)
  const snapPoints = useMemo(() => ['15%', '40%', '90%'], [])

  useEffect(() => {
    if (ref.current) {
      changeBottomSheetRef(ref.current)
    }
  }, [ref.current])

  return (
    <GorhomBottomSheet
      ref={ref}
      containerStyle={styles.bottomSheet}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      snapPoints={snapPoints}
      index={1}
    >
      <BottomSheetScrollView>
        <View style={styles.content}>
          <Navigator.Navigator initialRouteName="Profile">
            <Navigator.Screen name="Profile" component={Profile} />
            <Navigator.Screen name="User" component={UserPage} />
          </Navigator.Navigator>
        </View>
      </BottomSheetScrollView>
    </GorhomBottomSheet>
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    zIndex: 10,
  },

  bottomSheetBackground: {
    backgroundColor: themes.dark.backgroundColor,
  },

  bottomSheetHandleIndicator: {
    backgroundColor: 'white',
  },

  content: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
})
