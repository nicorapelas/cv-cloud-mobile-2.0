import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'

import AuthScreensBackArrowLink from '../../links/AuthScreensBackArrowLink'
import NavLink from '../../links/NavLink'
import ModalLink from '../../links/ModalLink'
import EmailVerificationModal from './EmailVerificationModal'
import LoaderFullScreen from '../../common/LoaderFullScreen'
import logo from '../../../../assets/images/logo-w400.png'
import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as UniversalContext } from '../../../context/UniversalContext'

const LoginEmailScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const {
    state: { loading, errorMessage, apiMessage },
    login,
    clearApiMessage,
    clearErrorMessage,
  } = useContext(AuthContext)

  const {
    state: { userPlanformOS },
  } = useContext(UniversalContext)

  const keyboard = useKeyboard()

  const renderWarnMessage = () => {
    if (!errorMessage || apiMessage) return null
    const { warn } = errorMessage
    if (!warn) return null
    return <ModalLink buttonText="OK" message={warn} routeName="loginEmail" />
  }

  const renderNotVerifiedMessage = () => {
    if (!errorMessage || apiMessage) return null
    const { notVerified } = errorMessage
    if (!notVerified) return null
    return (
      <EmailVerificationModal
        buttonOneText="OK"
        message={notVerified}
        routeName="LoginEmail"
        buttonTwoText="Re-send verification email"
        email={email}
      />
    )
  }

  const renderErrorMessage = () => {
    if (!errorMessage || apiMessage) return null
    const { email, password } = errorMessage
    const { notVerified } = errorMessage
    if (notVerified) return null
    return (
      <View style={styles.errorMessageBed}>
        {!email ? null : <Text style={styles.errorText}>{email}</Text>}
        {!password ? null : <Text style={styles.errorText}>{password}</Text>}
      </View>
    )
  }

  const renderResendSuccessMessage = () => {
    if (!apiMessage) return null
    const { success } = apiMessage
    if (!success) return null
    return (
      <ModalLink buttonText="OK" message={success} routeName="loginEmail" />
    )
  }

  const formHeader = () => {
    if (keyboard.keyboardShown) {
      return (
        <View
          style={
            isInputFocused ? styles.logoContainerFocused : styles.logoContainer
          }
        >
          <Image style={styles.logoSmall} source={logo} resizeMode="contain" />
        </View>
      )
    }
    return (
      <>
        <View
          style={
            isInputFocused ? styles.logoContainerFocused : styles.logoContainer
          }
        >
          <Image style={styles.logo} source={logo} resizeMode="contain" />
        </View>
        <Text
          style={
            userPlanformOS === 'ios' ? styles.headingIos : styles.headingAndroid
          }
        >
          Login with email
        </Text>
      </>
    )
  }

  const handleLogin = () => {
    if (!email || !password || loading) {
      return
    }

    login({ email, password })
  }

  const renderForm = () => {
    return (
      <View style={styles.container}>
        {renderWarnMessage()}
        {renderNotVerifiedMessage()}
        {renderResendSuccessMessage()}
        {formHeader()}
        <View style={styles.formInputs}>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => {
              setIsInputFocused(true)
              clearErrorMessage()
            }}
            onBlur={() => {
              // Only clear focus if keyboard is hidden
              if (!keyboard.keyboardShown) {
                setIsInputFocused(false)
              }
            }}
          />
          <View style={styles.passwordInputBed}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              textContentType="oneTimeCode"
              onFocus={() => {
                setIsInputFocused(true)
                clearErrorMessage()
              }}
              onBlur={() => {
                // Only clear focus if keyboard is hidden
                if (!keyboard.keyboardShown) {
                  setIsInputFocused(false)
                }
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButtonBed}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                style={styles.eyeButtonIcon}
                name={showPassword ? 'eye' : 'eye-off'}
              />
            </TouchableOpacity>
          </View>
        </View>
        {renderErrorMessage()}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!email || !password || loading) {
              return
            }
            login({ email, password })
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.navLinkContainer}>
          <View style={styles.navLink}>
            <NavLink
              routeName="registerEmail"
              text="Don't have an account? Register here."
            />
          </View>
          <View style={styles.navLink}>
            <NavLink
              routeName="passwordForgot"
              text="Forgot your password? Reset password here."
            />
          </View>
          <View style={styles.navLink}>
            <NavLink routeName="registerOrLogin" text="← Cancel" />
          </View>
        </View>
      </View>
    )
  }

  const renderContent = () => {
    if (loading) return <LoaderFullScreen />
    return (
      <KeyboardAvoidingView
        style={
          userPlanformOS === 'ios' && keyboard.keyboardShown === false
            ? styles.bedIos
            : styles.bedAndroid
        }
        behavior={userPlanformOS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <AuthScreensBackArrowLink routeName="registerOrLogin" />
          {renderForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return renderContent()
}

const styles = StyleSheet.create({
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
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formInputs: {
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    height: 50,
    width: '80%',
    textAlign: 'center',
    borderRadius: 7,
    margin: 5,
  },
  passwordInputBed: {
    flexDirection: 'row',
    width: '80%',
  },
  passwordInput: {
    backgroundColor: '#ffff',
    height: 50,
    textAlign: 'center',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    marginVertical: 5,
    flex: 3,
  },
  eyeButtonBed: {
    backgroundColor: '#555555',
    flex: 1,
    justifyContent: 'center',
    marginVertical: 5,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  eyeButtonIcon: {
    color: '#ffff',
    fontSize: 27,
    alignSelf: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
  },
  logoContainerFocused: {
    alignSelf: 'center',
    paddingTop: 30,
  },
  logo: {
    width: 200,
    alignSelf: 'center',
  },
  logoSmall: {
    width: 100,
    height: 34,
    marginLeft: '10%',
  },
  headingIos: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '100',
    marginBottom: 10,
  },
  headingAndroid: {
    color: '#F9B321',
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 10,
    fontFamily: 'sourceSansProLight',
  },
  button: {
    backgroundColor: '#278acd',
    width: '65%',
    alignSelf: 'center',
    borderRadius: 7,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#ffff',
    paddingRight: 10,
    marginTop: 13,
  },
  buttonText: {
    color: '#ffff',
    paddingVertical: 10,
  },
  errorMessageBed: {
    backgroundColor: 'red',
    borderRadius: 7,
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 15,
    marginVertical: 5,
  },
  errorText: {
    color: '#ffff',
    textAlign: 'center',
    fontSize: 18,
  },
  navLinkContainer: {
    marginTop: 20,
  },
  navLink: {
    alignSelf: 'center',
    width: '100%',
  },
})

export default LoginEmailScreen
