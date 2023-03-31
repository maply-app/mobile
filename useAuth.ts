import { createEvent, createStore } from 'effector'
import { useStore } from 'effector-react'
import { useEffect, useRef } from 'react'
import { useBackgroundPermissions, useForegroundPermissions } from 'expo-location'
import { getProfileFx } from './src/effector/user/effects/user'
import { WebSocketManager } from './src/managers/WebSocket'
import { $token } from './src/effector/user/store'
import { UserManager } from './src/managers/User'

export enum AuthStatus {
  Unauthorized = 'unauthorized',
  Authorized = 'authorized',
  NeedGeo = 'need_geo',
  Banned = 'banned',
  Loading = 'loading'
}

const changeStatus = createEvent<AuthStatus>()

const $authStatus = createStore(AuthStatus.Unauthorized)
  .on(getProfileFx.pending, (authStatus, pending) => (authStatus !== AuthStatus.Authorized && pending ? AuthStatus.Loading : authStatus))
  .on(getProfileFx.doneData, (_, payload) => {
    if (payload) {
      return payload.info?.coords?.geo?.coords ? AuthStatus.Authorized : AuthStatus.NeedGeo
    }

    return AuthStatus.Unauthorized
  })
  .on(changeStatus, (_, payload) => payload)

export function useAuth() {
  const status = useStore($authStatus)
  const token = useStore($token)

  const [backgroundStatus, , getBackgroundStatus] = useBackgroundPermissions()
  const [foregroundStatus, , getForegroundStatus] = useForegroundPermissions()

  const geoPermitted = Boolean(backgroundStatus?.status === 'granted') && Boolean(foregroundStatus?.status === 'granted')
  const interval = useRef(-1)

  useEffect(() => {
    if (status === AuthStatus.Authorized && !geoPermitted) {
      changeStatus(AuthStatus.NeedGeo)
      interval.current = setInterval(async () => {
        const foreground = await getForegroundStatus()
        const background = await getBackgroundStatus()

        if (foreground.status === 'granted' && background.status === 'granted') {
          changeStatus(AuthStatus.Authorized)
          clearInterval(interval.current)
        }
      }, 500) as unknown as number
    }
  }, [backgroundStatus, foregroundStatus, status])

  useEffect(() => {
    if (token && status === AuthStatus.Authorized && geoPermitted) {
      UserManager.startWatch()
      WebSocketManager.openConnection({ token, reconnect: true })
    } else if (status === AuthStatus.Unauthorized && UserManager.initialized) {
      UserManager.stopWatch()
      WebSocketManager.closeConnection()
    }
  }, [status])

  return status
}
