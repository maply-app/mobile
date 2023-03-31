import 'react-native-reanimated'

import React from 'react'
import {
  ActivityIndicator, StatusBar, StyleSheet, View,
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MD3DarkTheme as DefaultTheme, Provider } from 'react-native-paper'
import { PortalProvider } from '@gorhom/portal'
import { registerSheet, SheetProvider } from 'react-native-actions-sheet'
import { ThemeProp } from 'react-native-paper/lib/typescript/src/types'
import { Search } from './src/views/Authorized/Search/Search'
import { Conversations } from './src/views/Authorized/Conversations/Conversations'
import { Conversation } from './src/views/Authorized/Conversations/Conversation/Conversation'
import { SignIn } from './src/views/NotAuthorized/SignIn'
import { SignUp } from './src/views/NotAuthorized/SignUp'
import { Home } from './src/views/Authorized/Home/Home'
import { getToken } from './src/effector/user/events'
import { UserManager } from './src/managers/User'
import { Settings as SettingsPage } from './src/views/Authorized/Settings/Settings'
import { Theming } from './src/views/Authorized/Settings/subpages/Theming'
import { Share } from './src/views/Authorized/Settings/subpages/Share'
import { Account } from './src/views/Authorized/Settings/subpages/Account'
import { ScannedUserSheet } from './src/views/Authorized/Settings/subpages/Share/ScannedUserSheet'
import { themes } from './src/const/theme'
import { GeolocationRequest } from './src/views/Authorized/GeolocationRequest/GeolocationRequest'
import { AuthStatus, useAuth } from './useAuth'

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibW92cHVzaG1vdiIsImEiOiJjbDBnaTB6aXcxMzc5M2Vwcm53b2xrajlmIn0.Zl55a5v_Tr2Sso_WDA_xsw',
)

registerSheet('scanned-user', ScannedUserSheet)

const Stack = createNativeStackNavigator()

const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ffffff',
  },
  version: 3,
}

UserManager.initializeGeolocation()
getToken()

export default function App() {
  const authStatus = useAuth()

  if (authStatus === AuthStatus.Loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (authStatus === AuthStatus.NeedGeo) {
    return <GeolocationRequest />
  }

  return (
    <SheetProvider>
      <Provider theme={theme}>
        <PortalProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" />
            <Stack.Navigator screenOptions={{ header: () => null }}>
              {authStatus === AuthStatus.Authorized ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Search" component={Search} />
                  <Stack.Screen name="Conversations" component={Conversations} />
                  <Stack.Screen name="Conversation" component={Conversation} />
                  <Stack.Screen name="Settings" component={SettingsPage} />
                  <Stack.Screen name="Theming" component={Theming} />
                  <Stack.Screen name="Share" component={Share} />
                  <Stack.Screen name="Account" component={Account} />
                </>
              ) : (
                <>
                  <Stack.Screen name="SignIn" component={SignIn} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PortalProvider>
      </Provider>
    </SheetProvider>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    backgroundColor: themes.dark.backgroundColor,

    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
})
