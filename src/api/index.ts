import axios, { AxiosError, CreateAxiosDefaults } from 'axios'
import { apiHost } from '../const/web'
import { isUnauthorized } from './utils/isUnauthorized'

const config: CreateAxiosDefaults = {
  baseURL: `${apiHost}/api/v1`,
}

export const axiosInstance = axios.create(config)

function log() {
  const urlToSkip = ['/users/stats']

  axiosInstance.interceptors.response.use((result) => {
    const { url } = result.config

    if (urlToSkip.includes(url!)) {
      return result
    }

    const content = JSON.stringify(result.data)
    const message = `[${result.status} RESPONSE FROM URL ${url}]: ${content}`

    console.log(message)

    return result
  })

  axiosInstance.interceptors.request.use((request) => {
    const { url } = request

    if (urlToSkip.includes(url!)) {
      return request
    }

    const content = JSON.stringify(request.data)
    const message = `[REQUEST TO URL ${url}]: ${content}`

    console.log(message)

    return request
  })
}

axiosInstance.interceptors.response.use(null, (reason: AxiosError) => {
  if (reason.config?.headers.Authorization) {
    isUnauthorized(reason)
  }

  return reason
})

if (__DEV__) log()
