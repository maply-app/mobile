import axios, { AxiosError, CreateAxiosDefaults } from 'axios'
import { apiHost } from '../const/web'
import { isUnauthorized } from './utils/isUnauthorized'

const config: CreateAxiosDefaults = {
  baseURL: `${apiHost}/api/v1`,
}

export const axiosInstance = axios.create(config)

axiosInstance.interceptors.response.use(null, (reason: AxiosError) => {
  if (reason.config?.headers.Authorization) {
    isUnauthorized(reason)
  }

  return reason
})
