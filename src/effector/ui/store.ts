import { combine, createStore } from 'effector'
import BottomSheet from '@gorhom/bottom-sheet'
import { CameraRef } from '@rnmapbox/maps/lib/typescript/components/Camera'
import { NavigationProp } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  changeAppTheme,
  changeBottomSheetNavigator, changeBottomSheetRef, changeBounds, changeMapCameraRef, changeMapStyle, changeZoom,
} from './relations'
import { signOut } from '../user/events'
import {
  acceptRequestFx, declineRequestFx, removeFriendFx, sendRequestFx,
} from '../user/effects/friends'
import {
  getProfileFx, signInFx, signUpFx, updateSettingsFx,
} from '../user/effects/user'
import { Position } from '../../types/map'
import { AppTheme, MapStyle } from '../../types/theming'

const $ref = createStore<BottomSheet | null>(null)
  .on(changeBottomSheetRef, (_, payload) => payload)
  .on(signOut, () => null)

const $navigator = createStore<NavigationProp<Record<string, any>> | null>(null)
  .on(changeBottomSheetNavigator, (_, payload) => payload)
  .on(signOut, () => null)

const $bounds = createStore<Position[]>([[0, 0], [0, 0]])
  .on(changeBounds, (_, payload) => payload)
  .on(signOut, () => [[0, 0], [0, 0]])

const $zoom = createStore(0)
  .on(changeZoom, (_, payload) => payload)
  .on(signOut, () => 0)

const $style = createStore('scheme')
  .on(changeMapStyle, (_, payload) => payload)

const $camera = createStore<CameraRef | null>(null)
  .on(changeMapCameraRef, (_, payload) => payload)
  .on(signOut, () => null)

export const $bottomSheet = combine({ ref: $ref, navigator: $navigator })
export const $map = combine({
  bounds: $bounds, zoom: $zoom, camera: $camera, style: $style,
})

export const $pending = combine({
  removeFriend: removeFriendFx.pending,
  acceptRequest: acceptRequestFx.pending,
  declineRequest: declineRequestFx.pending,
  sendRequest: sendRequestFx.pending,

  signIn: signInFx.pending,
  signUp: signUpFx.pending,

  getProfile: getProfileFx.pending,
  updateSettings: updateSettingsFx.pending,
})

const $signInError = createStore(false)
  .on(signInFx.doneData, () => false)
  .on(signInFx.failData, () => true)

const $signUpError = createStore(false)
  .on(signUpFx.doneData, () => false)
  .on(signUpFx.failData, () => true)

export const $errors = combine({
  signIn: $signInError,
  signUp: $signUpError,
})

export const $theme = createStore(AppTheme.Dark)
  .on(changeAppTheme, (_, payload) => payload)

AsyncStorage.getItem('@appTheme').then((result) => {
  if (result) {
    changeAppTheme(result as AppTheme)
  }
})

AsyncStorage.getItem('@mapStyle').then((result) => {
  if (result) {
    changeMapStyle(result as MapStyle)
  }
})
