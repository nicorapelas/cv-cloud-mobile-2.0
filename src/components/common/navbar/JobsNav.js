import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Context as NavContext } from '../../../context/NavContext'
import { normalize } from '../../../utils/fontUtils'

const JobsNav = () => {
  const {
    state: { navTabSelected },
    setNavTabSelected,
  } = useContext(NavContext)

  const handlePress = () => {
    setNavTabSelected('classifiedAds')
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={navTabSelected === 'classifiedAds' ? styles.textActive : styles.text}>
        Jobs
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  text: {
    color: '#278ACD',
    textAlign: 'center',
    fontSize: normalize(13),
  },
  textActive: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: normalize(13),
  },
})

export default JobsNav
