import React, { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, Platform } from 'react-native'

import { Context as NavContext } from './src/context/NavContext'
import { Context as AuthContext } from './src/context/AuthContext'
import { Context as UniversalContext } from './src/context/UniversalContext'
import { Context as AdvertisementContext } from './src/context/AdvertisementContext'

import RegisterOrLoginScreen from './src/components/screens/authScreens/RegisterOrLoginScreen'
import RegisterEmailScreen from './src/components/screens/authScreens/RegisterEmailScreen'
import LoginEmailScreen from './src/components/screens/authScreens/LoginEmailScreen'
import PasswordForgotScreen from './src/components/screens/authScreens/PasswordForgotScreen'
import MainScreen from './src/components/screens/mainScreens/MainScreen'

const { width } = Dimensions.get('window')

const AppScreens = () => {
  const {
    state: { screenSelected },
  } = useContext(NavContext)

  const {
    state: { token, user },
    tryLocalSignin,
    fetchUser,
  } = useContext(AuthContext)

  const { setUserPlatformOS } = useContext(UniversalContext)

  const { fetchSystemSettings } = useContext(AdvertisementContext)

  // Valid auth screens
  const validAuthScreens = ['registerOrLogin', 'registerEmail', 'loginEmail', 'passwordForgot']
  
  // Ensure screenSelected is always valid
  const getValidScreen = (screen) => {
    if (!screen || !validAuthScreens.includes(screen)) {
      return 'registerOrLogin'
    }
    return screen
  }

  const [fetchUserCount, setFetchUserCount] = useState(0)

  useEffect(() => {
    tryLocalSignin()
    setUserPlatformOS(Platform.OS)
  }, [])

  useEffect(() => {
    if (token && fetchUserCount < 1) {
      fetchUser()
      setFetchUserCount(fetchUserCount + 1)
    }
    // Reset fetchUserCount when user logs out (token becomes null)
    if (!token && fetchUserCount > 0) {
      setFetchUserCount(0)
    }
  }, [token, fetchUserCount, user])

  // Fetch system settings immediately when user is loaded
  useEffect(() => {
    if (user) {
      fetchSystemSettings()
    }
  }, [user])


  const initialScreenSelector = (screen) => {
    const validScreen = getValidScreen(screen)
    switch (validScreen) {
      case 'registerOrLogin':
        return <RegisterOrLoginScreen />
      case 'registerEmail':
        return <RegisterEmailScreen />
      case 'loginEmail':
        return <LoginEmailScreen />
      case 'passwordForgot':
        return <PasswordForgotScreen />
      default:
        // Fallback to registerOrLogin if somehow invalid
        return <RegisterOrLoginScreen />
    }
  }

  const authenticatedScreenSelector = (screen) => {
    switch (screen) {
      case 'main':
        return <MainScreen />
      // Add more cases for other authenticated screens
      default:
        return <MainScreen />
    }
  }

  const screenSelector = (screen) => {
    return token
      ? authenticatedScreenSelector(screen)
      : initialScreenSelector(screen)
  }

  // Get the current screen to render - simple and direct, no animations
  const currentScreenToRender = getValidScreen(screenSelected)

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {screenSelector(currentScreenToRender)}
      </View>
    </View>
  )
}

export default AppScreens

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  screenContainer: {
    ...StyleSheet.absoluteFillObject,
    width,
  },
})
