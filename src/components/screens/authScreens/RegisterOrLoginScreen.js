import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'

import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as NavContext } from '../../../context/NavContext'
import { Context as UniversalContext } from '../../../context/UniversalContext'
import logo from '../../../../assets/images/logo-w400.png'
import LoaderFullScreen from '../../common/LoaderFullScreen'
import ModalLink from '../../links/ModalLink'

const RegisterOrLoginScreen = ({ navigation }) => {
  const [code, setCode] = useState(null)
  const scrollViewRef = useRef(null)

  const {
    state: { loading, apiMessage, introAffiliateCode },
    setIntroAffiliateCode,
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

  // On Android, scroll affiliate input into view when keyboard opens
  useEffect(() => {
    if (Platform.OS !== 'android') return
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 100)
    })
    return () => sub.remove()
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

  const scrollToAffiliateSection = () => {
    const delay = Platform.OS === 'android' ? 400 : 300
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    }, delay)
  }

  const handleRemoveCode = () => {
    setIntroAffiliateCode(null)
  }

  const affiliateInput = () => {
    const attached = introAffiliateCode && introAffiliateCode.length > 0
    if (attached) {
      return (
        <View style={styles.affiliateSection}>
          <Text style={styles.affiliateLabel}>Referral code (optional)</Text>
          <View style={styles.attachedBlock}>
            <Ionicons name="checkmark-circle" size={28} color="#2ecc71" style={styles.attachedIcon} />
            <Text style={styles.attachedTitle}>Referral code attached</Text>
            <Text style={styles.attachedCode}>{introAffiliateCode}</Text>
            <Text style={styles.attachedHint}>Will be applied when you sign up.</Text>
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveCode}>
              <Text style={styles.removeButtonText}>Remove code</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.affiliateSection}>
        <Text style={styles.affiliateLabel}>Referral code (optional)</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          textAlign="center"
          placeholder="Enter code if you have one"
          value={code || ''}
          onChangeText={setCode}
          onFocus={scrollToAffiliateSection}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => {
            Keyboard.dismiss()
            setIntroAffiliateCode(code && code.trim() ? code.trim() : null)
          }}
        >
          <Text style={styles.attachButtonText}>Attach code</Text>
        </TouchableOpacity>
      </View>
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
            ref={scrollViewRef}
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
            {affiliateInput()}
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
  affiliateSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  affiliateLabel: {
    color: '#F9B321',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  logo: {
    width: 200,
    alignSelf: 'center',
    marginTop: '20%',
  },
  input: {
    backgroundColor: '#ffff',
    width: '50%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 5,
  },
  attachButton: {
    backgroundColor: '#278acd',
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: -30,
  },
  attachButtonText: {
    color: '#ffff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  attachedBlock: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignSelf: 'center',
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.4)',
  },
  attachedIcon: {
    marginBottom: 8,
  },
  attachedTitle: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  attachedCode: {
    color: '#F9B321',
    fontSize: 16,
    fontFamily: Platform.OS === 'android' ? 'sourceSansProLight' : undefined,
    marginBottom: 6,
  },
  attachedHint: {
    color: '#bdc3c7',
    fontSize: 11,
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 20,
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 12,
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
