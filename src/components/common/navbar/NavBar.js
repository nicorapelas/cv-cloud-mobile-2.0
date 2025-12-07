import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Context as UniversalContext } from '../../../context/UniversalContext'
import { Context as NavContext } from '../../../context/NavContext'
import DashboardNav from './DashboardNav'
import ViewCV from './ViewCV'
import ShareCV from './ShareCV'

const NavBar = ({ videoUploading = false, isRecording = false }) => {
  const {
    state: { imageToViewUrl },
  } = useContext(UniversalContext)

  const {
    state: { CVBitScreenSelected },
  } = useContext(NavContext)

  const keyboard = useKeyboard()
  const insets = useSafeAreaInsets()

  const renderContent = () => {
    // Hide navbar during: keyboard, image viewing, video recording, video uploading, or when in a CV bit form
    if (
      keyboard.keyboardShown ||
      imageToViewUrl ||
      videoUploading ||
      isRecording ||
      CVBitScreenSelected !== ''
    )
      return null
    return (
      <View style={styles.container}>
        <DashboardNav />
        <ViewCV />
        <ShareCV />
      </View>
    )
  }

  return renderContent()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#5e5e5e',
    backgroundColor: '#232936',
    paddingTop: 5,
  },
})

export default NavBar
