import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import keys from '../../config/keys'

const instance = axios.create({
  baseURL: keys.serverUrl,
  timeout: 30000, // 30 second timeout to prevent hanging requests (especially on Android)
})

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors for debugging
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout:', error.config?.url)
    } else if (error.message === 'Network Error') {
      console.error('🌐 Network error:', error.config?.url)
    }
    return Promise.reject(error)
  }
)

export default instance
