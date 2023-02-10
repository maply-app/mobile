import { createEffect } from 'effector'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppTheme, MapStyle } from '../../types/theming'

export const saveMapStyleFx = createEffect(
  (style: MapStyle) => AsyncStorage.setItem('@mapStyle', style),
)

export const saveAppThemeFx = createEffect(
  (theme: AppTheme) => AsyncStorage.setItem('@appTheme', theme),
)
