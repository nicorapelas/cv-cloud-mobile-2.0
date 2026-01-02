import React, { useState, useContext, useEffect } from 'react'
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
import { useKeyboard } from '@react-native-community/hooks'

import AuthScreensBackArrowLink from '../../links/AuthScreensBackArrowLink'
import LoaderFullScreen from '../../common/LoaderFullScreen'
import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as UniversalContext } from '../../../context/UniversalContext'
import ModalLink from '../../links/ModalLink'
import logo from '../../../../assets/images/logo-w400.png'

const PasswordForgotScreen = () => {
  const [email, setEmail] = useState('')
  const {
    state: { loading, errorMessage, apiMessage },
    forgotPassword,
    clearApiMessage,
    clearErrorMessage,
  } = useContext(AuthContext)

  const {
    state: { userPlanformOS },
  } = useContext(UniversalContext)

  const keyboard = useKeyboard()

  // Clear messages when component mounts
  useEffect(() => {
    clearApiMessage()
    clearErrorMessage()
  }, [])

  const renderSuccess = () => {
    if (!apiMessage) return null
    const { success } = apiMessage
    return (
      <>
        {!success || success.length < 1 ? null : (
          <ModalLink buttonText="OK" message={success} routeName="LoginEmail" />
        )}
      </>
    )
  }

  const renderInstruction = () => {
    if (!errorMessage) {
      return (
        <View style={styles.instructionBed}>
          <Text style={styles.noteText}>
            Enter your email and we'll email instructions on how to reset your
            password.
          </Text>
        </View>
      )
    }
  }

  const renderError = () => {
    if (!errorMessage) return null
    return (
      <>
        {!errorMessage ? null : (
          <View style={styles.errorMessageBed}>
            {!errorMessage.email ? null : (
              <Text style={styles.errorText}>{errorMessage.email}</Text>
            )}
          </View>
        )}
        {!errorMessage.warn ? null : (
          <ModalLink
            buttonText="OK"
            message={errorMessage.warn}
            routeName="LoginEmail"
          />
        )}
      </>
    )
  }

  const renderForm = () => {
    return (
      <View style={styles.container}>
        <AuthScreensBackArrowLink routeName="loginEmail" />
        <Image style={styles.logo} source={logo} resizeMode="contain" />
        <Text
          style={
            userPlanformOS === 'ios' ? styles.headingIos : styles.headingAndroid
          }
        >
          Password reset
        </Text>
        <View style={styles.formInputs}>
          <TextInput
            style={styles.input}
            textAlign="center"
            placeholder="Email address"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => {
              clearErrorMessage()
              clearApiMessage()
            }}
          />
          {renderInstruction()}
          {renderSuccess()}
          {renderError()}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => forgotPassword({ email })}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
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
        >
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  navArrow: {
    color: '#F9B321',
    fontSize: 30,
    paddingLeft: 15,
  },
  formInputs: {
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    height: 50,
    width: '85%',
    textAlign: 'center',
    borderRadius: 7,
    margin: 5,
  },
  logo: {
    width: 200,
    alignSelf: 'center',
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
  instructionBed: {
    backgroundColor: '#298ACD',
    borderRadius: 7,
    width: '85%',
    alignSelf: 'center',
    padding: 7,
    marginBottom: 10,
  },
  noteText: {
    color: '#ffff',
    textAlign: 'center',
    fontSize: 18,
  },
  errorMessageBed: {
    backgroundColor: 'red',
    borderRadius: 7,
    width: '85%',
    alignSelf: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  errorText: {
    color: '#ffff',
    alignSelf: 'center',
  },
})

export default PasswordForgotScreen
