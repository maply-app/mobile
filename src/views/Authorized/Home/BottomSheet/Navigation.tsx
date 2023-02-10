import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import {
  StackNavigationState,
  StackRouterOptions,
  StackRouter,
  useNavigationBuilder,

  DefaultNavigatorOptions, createNavigatorFactory,
} from '@react-navigation/native'
import { NativeStackNavigationConfig } from 'react-native-screens/lib/typescript/native-stack/types'
import { changeBottomSheetNavigator } from '../../../../effector/ui/relations'

type ParamListBase = Record<string, any>
type NavigationOptions = Record<string, never>;
type NavigationEventMap = Record<string, never>;

type Props = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  NavigationOptions,
  NavigationEventMap
  > &
  StackRouterOptions &
  NativeStackNavigationConfig;

function BottomSheetNavigator({ children, screenOptions, initialRouteName }: Props) {
  const {
    state, navigation, descriptors, NavigationContent,
  } = useNavigationBuilder(StackRouter, {
    children,
    screenOptions,
    initialRouteName,
  })

  useEffect(() => {
    changeBottomSheetNavigator(navigation as never)
  }, [navigation])

  return (
    <NavigationContent>
      {state.routes.map((route, index) => (index === state.index ? (
        descriptors[route.key].render()
      ) : null))}
    </NavigationContent>
  )
}

export default createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  NavigationOptions,
  NavigationEventMap,
  typeof BottomSheetNavigator
  >(BottomSheetNavigator)
