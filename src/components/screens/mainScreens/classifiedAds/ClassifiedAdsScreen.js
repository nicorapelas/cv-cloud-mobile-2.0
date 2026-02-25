import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Context as NavContext } from '../../../../context/NavContext'
import ClassifiedAdsListScreen from './ClassifiedAdsListScreen'
import ClassifiedAdDetailScreen from './ClassifiedAdDetailScreen'

const ClassifiedAdsScreen = () => {
  const {
    state: { classifiedAdDetailId },
  } = useContext(NavContext)

  if (classifiedAdDetailId) {
    return <ClassifiedAdDetailScreen adId={classifiedAdDetailId} />
  }
  return <ClassifiedAdsListScreen />
}

export default ClassifiedAdsScreen
