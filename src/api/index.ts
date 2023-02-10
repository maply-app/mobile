import axios, { CreateAxiosDefaults } from 'axios'
import { host } from '../const/web'

const config: CreateAxiosDefaults = {
  baseURL: `${host}/api/v1`,
}

export const axiosInstance = axios.create(config)
