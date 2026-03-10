import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Context as NavContext } from '../../context/NavContext'
import { Context as AuthContext } from '../../context/AuthContext'

const AuthScreensBackArrowLink = ({ routeName }) => {
  const insets = useSafeAreaInsets()
  const { setScreenSelected } = useContext(NavContext)

  const { clearErrorMessage, clearApiMessage } = useContext(AuthContext)

  const handlePress = () => {
    clearErrorMessage()
    clearApiMessage()
    setScreenSelected(routeName)
  }

  const topPadding = Platform.OS === 'ios' ? Math.max(12, insets.top) : 25

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <TouchableOpacity onPress={handlePress}>
        <Feather style={styles.navArrow} name="arrow-left" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: '5%',
  },
  navArrow: {
    color: '#F9B321',
    fontSize: 30,
    paddingLeft: 15,
  },
})

export default AuthScreensBackArrowLink
