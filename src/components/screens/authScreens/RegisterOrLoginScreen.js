import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as NavContext } from '../../../context/NavContext'
import { Context as UniversalContext } from '../../../context/UniversalContext'
import logo from '../../../../assets/images/logo-w400.png'
import LoaderFullScreen from '../../common/LoaderFullScreen'
import ModalLink from '../../links/ModalLink'

const RegisterOrLoginScreen = ({ navigation }) => {
  const {
    state: { loading, apiMessage },
    clearApiMessage,
    clearErrorMessage,
  } = useContext(AuthContext)

  const { setScreenSelected } = useContext(NavContext)

  const {
    state: { userPlanformOS },
  } = useContext(UniversalContext)

  // Clear any error/API messages when component mounts
  useEffect(() => {
    clearApiMessage()
    clearErrorMessage()
  }, [])

  const renderApiMessage = () => {
    if (!apiMessage) return null
    const { error } = apiMessage
    return (
      <>
        {!error ? null : (
          <ModalLink buttonText="OK" message={error} routeName="LoginEmail" />
        )}
      </>
    )
  }

  const handlePressSignup = () => {
    clearApiMessage()
    clearErrorMessage()
    setScreenSelected('registerEmail')
  }

  const handlePressLogin = () => {
    clearApiMessage()
    clearErrorMessage()
    setScreenSelected('loginEmail')
  }

  const renderContent = () => {
    if (loading) return <LoaderFullScreen />
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View
          style={userPlanformOS === 'ios' ? styles.bedIos : styles.bedAndroid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {renderApiMessage()}
            <Image style={styles.logo} source={logo} resizeMode="contain" />
            <Text
              style={
                userPlanformOS === 'ios'
                  ? styles.headingIos
                  : styles.headingAndroid
              }
            >
              Welcome!
            </Text>
            <View style={styles.emailButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={handlePressSignup}
              >
                <AntDesign style={styles.buttonIcon} name="user" />
                <Text style={styles.buttonText}>Sign up with us</Text>
              </TouchableOpacity>
              <Text
                style={
                  userPlanformOS === 'ios'
                    ? styles.orTextIos
                    : styles.orTextAndroid
                }
              >
                or
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handlePressLogin}
              >
                <AntDesign style={styles.buttonIcon} name="login" />
                <Text style={styles.buttonText}>Login here</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    )
  }
  return renderContent()
}

RegisterOrLoginScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  bedIos: {
    backgroundColor: '#232936',
    width: '100%',
    flex: 1,
    marginTop: -100,
  },
  bedAndroid: {
    backgroundColor: '#232936',
    width: '100%',
    flex: 1,
  },
  container: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'android' ? 270 : 120,
  },
  headingIos: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '100',
    marginBottom: 20,
  },
  headingAndroid: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'sourceSansProLight',
  },
  orTextIos: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '100',
    marginTop: 4,
    marginBottom: 6,
  },
  orTextAndroid: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'sourceSansProLight',
    marginTop: 4,
    marginBottom: 6,
  },
  logo: {
    width: 200,
    alignSelf: 'center',
    marginTop: '20%',
  },
  button: {
    backgroundColor: '#278acd',
    width: '90%',
    paddingVertical: 13,
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#ffff',
    fontSize: 24,
  },
  buttonText: {
    color: '#ffff',
    paddingLeft: 15,
    fontSize: 18,
  },
})

export default RegisterOrLoginScreen
