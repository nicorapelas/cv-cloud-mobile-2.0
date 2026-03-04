import React, { useRef, useContext, useEffect } from 'react'
import { View, Animated, StyleSheet, Dimensions, Platform } from 'react-native'

import MainViewRender from '../../screens/mainScreens/MainViewRender'
import TermsAndConditionsBurgerButton from '../burgerMenu/TermsAndConditionsBurgerButton'
import ReferralsButton from '../burgerMenu/ReferralsButton'
import SignOut from '../burgerMenu/SignOut'
import DeleteAccount from '../burgerMenu/DeleteAccount'
import AppVersion from '../burgerMenu/AppVersion'
import Managment from '../burgerMenu/managment/Managment'
import { Context as BurgerMenuContext } from '../../../context/BurgerMenuContext'
import { Context as NavContext } from '../../../context/NavContext'

const { width } = Dimensions.get('window')

const Menu = () => {
  const slideAnim = useRef(new Animated.Value(width)).current // Initially off-screen

  const {
    state: { burgerMenuVisible },
  } = useContext(BurgerMenuContext)

  const {
    state: { navTabSelected },
  } = useContext(NavContext)

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: !burgerMenuVisible ? width : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [burgerMenuVisible])

  return (
    <View style={styles.container}>
      {/* Main View Content */}
      <MainViewRender />
      {navTabSelected === 'dashboard' && (
        <Animated.View
          style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
        >
          <TermsAndConditionsBurgerButton />
          <ReferralsButton />
          <SignOut />
          <DeleteAccount />
          <Managment />
          <AppVersion />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuIcon: {
    margin: 20,
    zIndex: 2, // Ensures the menu icon is above other components
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#232936',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 10,
    zIndex: 1, // Ensures the menu is above the main content
  },
})

export default Menu
