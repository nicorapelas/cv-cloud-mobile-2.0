import React, { useContext, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import DashboardScreen from './dashboard/DashboardScreen'
import ViewCVScreen from './viewCV/ViewCVScreen'
import ShareCVScreen from './shareCVScreen/ShareCVScreen'
import ClassifiedAdsScreen from './classifiedAds/ClassifiedAdsScreen'
import InitDataFetch from '../../common/InitDataFetch'
import BannerAdRender from '../../../advertisements/bannerAdsStrip/BannerAdStripRender'
import { Context as NavContext } from '../../../context/NavContext'
import { Context as BurgerMenuContext } from '../../../context/BurgerMenuContext'
import { Context as ClassifiedAdsContext } from '../../../context/ClassifiedAdsContext'

const MainViewRender = () => {
  const {
    state: { navTabSelected, CVBitScreenSelected },
  } = useContext(NavContext)

  const { setBurgerMenuVisible } = useContext(BurgerMenuContext)
  const { state: { classifiedAdsActive } } = useContext(ClassifiedAdsContext)

  useEffect(() => {
    if (CVBitScreenSelected !== '') {
      setBurgerMenuVisible(false)
    }
  }, [CVBitScreenSelected])

  const renderContent = () => {
    switch (navTabSelected) {
      case 'dashboard':
        return <DashboardScreen />
      case 'viewCV':
        return <ViewCVScreen />
      case 'shareCV':
        return <ShareCVScreen />
      case 'classifiedAds':
        if (!classifiedAdsActive) {
          return (
            <View style={styles.unavailableContainer}>
              <Text style={styles.unavailableText}>Job listings are currently unavailable.</Text>
            </View>
          )
        }
        return <ClassifiedAdsScreen />
      default:
        break
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>{renderContent()}</View>
      <View style={styles.bannerContainer}>
        <InitDataFetch />
        <BannerAdRender />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  unavailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unavailableText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default MainViewRender
