import React, { useContext } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as BurgerMenuContext } from '../../../context/BurgerMenuContext'

const ReferralsButton = () => {
  const { state: { user } } = useContext(AuthContext)
  const { setInfoToShow } = useContext(BurgerMenuContext)

  if (!user || !user.affiliate) return null

  const handlePress = () => {
    setInfoToShow('referrals')
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.buttonText}>Referrals</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    backgroundColor: '#2e7d32',
    color: '#ffff',
    fontSize: 16,
    textAlign: 'center',
    borderColor: '#ffff',
    borderWidth: 2,
    borderRadius: 7,
    paddingVertical: 5,
    marginBottom: 5,
  },
})

export default ReferralsButton
