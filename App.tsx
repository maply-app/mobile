import 'react-native-reanimated'

import React, { useEffect } from 'react'
import {
  ActivityIndicator, StatusBar, StyleSheet, View,
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useStore } from 'effector-react'
import { ThemeProp } from 'react-native-paper/lib/typescript/types'
import { MD3DarkTheme as DefaultTheme, Provider } from 'react-native-paper'
import { PortalProvider } from '@gorhom/portal'
import { registerSheet, SheetProvider } from 'react-native-actions-sheet'
import { $token, $user } from './src/effector/user/store'
import { Search } from './src/views/Authorized/Search/Search'
import { Conversations } from './src/views/Authorized/Conversations/Conversations'
import { Conversation } from './src/views/Authorized/Conversations/Conversation/Conversation'
import { SignIn } from './src/views/NotAuthorized/SignIn'
import { SignUp } from './src/views/NotAuthorized/SignUp'
import { Home } from './src/views/Authorized/Home/Home'
import { getProfile, getToken } from './src/effector/user/events'
import { $pending } from './src/effector/ui/store'
import { UserManager } from './src/managers/User'
import { Settings as SettingsPage } from './src/views/Authorized/Settings/Settings'
import { Theming } from './src/views/Authorized/Settings/subpages/Theming'
import { Share } from './src/views/Authorized/Settings/subpages/Share'
import { Account } from './src/views/Authorized/Settings/subpages/Account'
import { ScannedUserSheet } from './src/views/Authorized/Settings/subpages/Share/ScannedUserSheet'
import { themes } from './src/const/theme'
import { WebSocketManager } from './src/managers/WebSocket'

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
  const token = useStore($token)
  const user = useStore($user)
  const pending = useStore($pending)

  useEffect(() => {
    if (token) WebSocketManager.openConnection({ token, reconnect: true })
    else WebSocketManager.closeConnection()
  }, [token])

  useEffect(() => {
    if (token && !pending.getProfile && !user) {
      getProfile()
    }

    if (user && !UserManager.initialized) {
      UserManager.startWatch()
    }

    if (UserManager.initialized && !token) {
      UserManager.stopWatch()
    }
  }, [token, pending.getProfile, user])

  if ((token && !user) || (user && !user?.info?.coords)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SheetProvider>
      <Provider theme={theme}>
        <PortalProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" />
            <Stack.Navigator screenOptions={{ header: () => null }}>
              {user ? (
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
