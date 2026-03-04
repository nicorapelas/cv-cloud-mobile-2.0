import React, { useContext, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'

import TermsAndConditions from './termsAndConditions/TermsAndConditions'
import TermsAndConditionsText from './burgerMenu/TermsAndConditionsText'
import SignOutConfirm from './burgerMenu/SignOutConfirm'
import DeleteAccountConfirm from './burgerMenu/DeleteAcountConfirm'
import ReferralsPerformanceView from './burgerMenu/ReferralsPerformanceView'
import ManagmentMenu from './burgerMenu/managment/ManagmentMenu'
import AdminPanelScreen from '../screens/admin/AdminPanelScreen'
import { Context as BurgerMenuContext } from '../../context/BurgerMenuContext'

const InfoFullscreenRender = () => {
  const {
    state: { InfoToShow },
    setBurgerMenuVisible,
  } = useContext(BurgerMenuContext)

  useEffect(() => {
    if (InfoToShow !== '') {
      setBurgerMenuVisible(false)
    }
  }, [InfoToShow])

  const contentSelector = () => {
    switch (InfoToShow) {
      case 'initTerms':
        return <TermsAndConditions />
      case 'terms':
        return <TermsAndConditionsText />
      case 'signOut':
        return <SignOutConfirm />
      case 'deleteAccount':
        return <DeleteAccountConfirm />
      case 'referrals':
        return (
          <View style={styles.referralsWrapper}>
            <ReferralsPerformanceView />
          </View>
        )
      case 'managment':
        return <ManagmentMenu />
      case 'adminPanel':
        return <AdminPanelScreen />
      default:
        break
    }
  }

  const renderContent = () => {
    return <View style={styles.container}>{contentSelector()}</View>
  }

  return renderContent()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  referralsWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 80,
  },
})

export default InfoFullscreenRender
