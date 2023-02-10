import { createEffect } from 'effector'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { axiosInstance } from '../../../api'
import { RequestsApiAnswer, NetworkRequestAnswer } from '../../../types/web'
import {
  SignUpEventProps, UpdateSettingsEventProps, UpdateUserInfoProps,
} from '../events'
import {
  ReceivedRequest, SentRequest, User, UserInfo,
} from '../../../types/user'
import { UserManager } from '../../../managers/User'
import { WebSocketManager } from '../../../managers/WebSocket'

export const updateTokenFx = createEffect(async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem('@accessToken', token)
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
  } else {
    await AsyncStorage.removeItem('@accessToken')
    axiosInstance.defaults.headers.Authorization = ''
  }

  return true
})

export const signInFx = createEffect(async ({ email, password }: { email: string; password: string }) => {
  const { data: result } = await axiosInstance
    .post<NetworkRequestAnswer<{token: string}>>('/auth/login', {
      email,
      password,
    })

  if ('data' in result && 'token' in result.data) {
    return result.data.token
  }

  return null
})

export const getTokenFromStoreFx = createEffect(async () => AsyncStorage.getItem('@accessToken'))

export const signUpFx = createEffect((props: SignUpEventProps) => axiosInstance
  .post<NetworkRequestAnswer<string>>('/auth/register', props))

export const getProfileFx = createEffect(
  async () => (await axiosInstance.get<{data: User}>('/users/get')).data.data,
)

export const updateSettingsFx = createEffect(async ({ name, username, image } : UpdateSettingsEventProps) => {
  const formData = new FormData()

  if (name) {
    formData.append('name', name)
  }

  if (username) {
    formData.append('username', username)
  }

  if (image && !image.cancelled && image.uri) {
    const blob = await (fetch(image.uri).then((res) => res.blob()))
    formData.append('avatar', blob)
  }

  await axiosInstance
    .post('/users/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

  await getProfileFx()
})

export const updateInfoFx = createEffect(
  async (params: { user: User | null, infoToUpdate?: UpdateUserInfoProps }): Promise<UserInfo> => {
    const { user, infoToUpdate } = params

    if (!user || !user.info) {
      throw new Error('User not initialized')
    }

    const { lastUpdate: _, ...info } = user.info.coords ?? {
      geo: {
        coords: { lat: 0, lon: 0 },
        speed: 0,
        direction: 0,
      },
      info: { battery: 0 },
      isOnline: true,
    }

    info.geo.coords.lat = infoToUpdate?.lat ?? info.geo.coords.lat
    info.geo.coords.lon = infoToUpdate?.lon ?? info.geo.coords.lon
    info.geo.speed = Math.trunc((infoToUpdate?.speed ?? info.geo.speed) * 3.6)
    info.geo.direction = Math.trunc(infoToUpdate?.direction ?? info.geo.direction)
    info.info.battery = infoToUpdate?.battery ?? info.info.battery
    info.isOnline = true

    await axiosInstance.post('/users/stats', info)
    return {
      coords: info,
    }
  },
)

export const getUserRequestsFx = createEffect(async () => Promise.all([
  axiosInstance.get<RequestsApiAnswer<SentRequest>>('/friends/requests/sent'),
  axiosInstance.get<RequestsApiAnswer<ReceivedRequest>>(
    '/friends/requests/received',
  ),
]).then((result) => ({
  sent: result[0].data.data ?? [],
  received: result[1].data.data ?? [],
})))

export const setupManagersFx = createEffect(
  ({ token, user } : { token: string | null, user: User | null }) => {
    if (user && token) {
      UserManager.startWatch()
      WebSocketManager.openConnection({
        reconnect: true,
        token,
      })
    } else {
      UserManager.stopWatch()
      WebSocketManager.closeConnection()
    }
  },
)
