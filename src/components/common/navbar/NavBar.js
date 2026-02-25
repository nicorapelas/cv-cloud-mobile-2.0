import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Context as UniversalContext } from '../../../context/UniversalContext'
import { Context as NavContext } from '../../../context/NavContext'
import { Context as ClassifiedAdsContext } from '../../../context/ClassifiedAdsContext'
import DashboardNav from './DashboardNav'
import ViewCV from './ViewCV'
import ShareCV from './ShareCV'
import JobsNav from './JobsNav'

const NavBar = ({ videoUploading = false, isRecording = false }) => {
  const {
    state: { imageToViewUrl },
  } = useContext(UniversalContext)

  const {
    state: { CVBitScreenSelected, navTabSelected, classifiedAdDetailId },
  } = useContext(NavContext)

  const { state: { classifiedAdsActive } } = useContext(ClassifiedAdsContext)

  const keyboard = useKeyboard()
  const insets = useSafeAreaInsets()

  const renderContent = () => {
    // Hide navbar during: keyboard, image viewing, video recording, video uploading, or when in a CV bit form
    if (
      keyboard.keyboardShown ||
      imageToViewUrl ||
      videoUploading ||
      isRecording ||
      CVBitScreenSelected !== '' ||
      (navTabSelected === 'classifiedAds' && classifiedAdDetailId)
    )
      return null
    return (
      <View style={styles.container}>
        <DashboardNav />
        <ViewCV />
        <ShareCV />
        {classifiedAdsActive && <JobsNav />}
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
