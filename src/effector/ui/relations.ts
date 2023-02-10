import { createEvent, sample } from 'effector'
import BottomSheet from '@gorhom/bottom-sheet'
import { CameraRef } from '@rnmapbox/maps/lib/typescript/components/Camera'
import { NavigationProp } from '@react-navigation/native'
import { Position } from '../../types/map'
import { AppTheme, MapStyle } from '../../types/theming'
import { saveAppThemeFx, saveMapStyleFx } from './effects'

export const changeBottomSheetRef = createEvent<BottomSheet>()
export const changeBottomSheetNavigator = createEvent<NavigationProp<Record<string, any>>>()

export const changeBounds = createEvent<Position[]>()
export const changeZoom = createEvent<number>()

export const changeMapCameraRef = createEvent<CameraRef>()

export const changeMapStyle = createEvent<MapStyle>()
export const changeAppTheme = createEvent<AppTheme>()

sample({
  clock: changeMapStyle,
  target: saveMapStyleFx,
})

sample({
  clock: changeAppTheme,
  target: saveAppThemeFx,
})
