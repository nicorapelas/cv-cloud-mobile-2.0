import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

import FormHintModal from '../../../../../common/modals/FormHintModal'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import FormCancelButton from '../../../../../common/FormCancelButton'
import validateEmailInput from '../../../../../../validation/email'
import validatePhoneInput from '../../../../../../validation/phone'
import { Context as ContactInfoContext } from '../../../../../../context/ContactInfoContext'
import { Context as PersonalInfoContext } from '../../../../../../context/PersonalInfoContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'
import { getCountryConfig } from '../../../../../../utils/countryConfig'

const ContactInfoEditForm = () => {
  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)
  const scrollViewRef = React.useRef(null)
  const shouldScrollToTopRef = React.useRef(false)
  const prevAddressInputShowRef = React.useRef(false)
  const [unit, setUnit] = useState(null)
  const [complex, setComplex] = useState(null)
  const [address, setAddress] = useState(null)
  const [suburb, setSuburb] = useState(null)
  const [city, setCity] = useState(null)
  const [province, setProvince] = useState(null)
  const [country, setCountry] = useState(null)
  const [postalCode, setPostalCode] = useState(null)

  const [emailInputShow, setEmailInputShow] = useState(true)
  const [phoneInputShoow, setPhoneInputShow] = useState(false)
  const [addressInputShow, setAddressInputShow] = useState(false)
  const [saveButtonShow, setSaveButtonShow] = useState(false)
  const autoJumpedRef = React.useRef(false)

  const { toggleHideNavLinks } = useContext(UniversalContext)

  const {
    state: { loading, error, contactInfoToEdit },
    editContactInfo,
    addError,
    clearErrors,
  } = useContext(ContactInfoContext)

  const {
    state: { personalInfo },
    fetchPersonalInfo,
  } = useContext(PersonalInfoContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  // Get user's country from personalInfo, default to 'ZA'
  const userCountry = personalInfo?.country || 'ZA'
  const countryConfig = getCountryConfig(userCountry)

  const keyboard = useKeyboard()

  useEffect(() => {
    fetchPersonalInfo() // Fetch to get user's country
  }, [fetchPersonalInfo])

  useEffect(() => {
    if (error) toggleHideNavLinks(false)
  }, [error])

  // Detect when we arrive at address step and scroll to top
  useEffect(() => {
    if (addressInputShow && !prevAddressInputShowRef.current) {
      // We just arrived at address step
      prevAddressInputShowRef.current = true
      shouldScrollToTopRef.current = true
      
      // Scroll to top immediately and repeatedly to override any other scrolls
      const scrollToTop = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false })
        }
      }
      
      // Immediate scroll
      scrollToTop()
      
      // On iOS, use longer delays to ensure scroll-to-top overrides keyboard scroll
      const delays = Platform.OS === 'ios' 
        ? [50, 150, 300, 500, 700, 900, 1100] 
        : [50, 150, 300, 500]
      
      // Additional scrolls at different intervals to ensure it sticks
      const timeouts = delays.map((delay) => setTimeout(scrollToTop, delay))
      
      // Keep shouldScrollToTopRef true longer on iOS to prevent keyboard scroll override
      timeouts.push(
        setTimeout(() => {
          shouldScrollToTopRef.current = false
        }, Platform.OS === 'ios' ? 1200 : 800)
      )
      
      return () => {
        timeouts.forEach(clearTimeout)
      }
    } else if (!addressInputShow) {
      prevAddressInputShowRef.current = false
      shouldScrollToTopRef.current = false
    }
  }, [addressInputShow])

  // Scroll to input when keyboard appears (but not when we should scroll to top)
  useEffect(() => {
    if (
      keyboard.keyboardShown &&
      (emailInputShow || phoneInputShoow || addressInputShow) &&
      scrollViewRef.current &&
      !shouldScrollToTopRef.current
    ) {
      setTimeout(() => {
        if (scrollViewRef.current && !shouldScrollToTopRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [
    keyboard.keyboardShown,
    emailInputShow,
    phoneInputShoow,
    addressInputShow,
  ])

  // Flash scroll indicators on iOS when Address step loads
  useEffect(() => {
    if (addressInputShow && Platform.OS === 'ios' && scrollViewRef.current) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.flashScrollIndicators()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [addressInputShow])

  useEffect(() => {
    if (contactInfoToEdit) {
      const {
        address,
        city,
        complex,
        country,
        email,
        phone,
        postalCode,
        province,
        suburb,
        unit,
      } = contactInfoToEdit
      setEmail(email)
      setPhone(phone)
      setUnit(unit)
      setComplex(complex)
      setAddress(address)
      setSuburb(suburb)
      setCity(city)
      setProvince(province)
      setCountry(country)
      setPostalCode(postalCode)

      const isEmptyVal = (val) => {
        if (val === undefined || val === null) return true
        if (typeof val === 'string') return val.trim().length === 0
        return false
      }

      const missingPhone = isEmptyVal(phone)
      const missingCity = isEmptyVal(city)

      // If both city and phone are missing, jump straight to phone step
      if (missingPhone && missingCity && !autoJumpedRef.current) {
        autoJumpedRef.current = true
        setEmailInputShow(false)
        setPhoneInputShow(true)
        setAddressInputShow(false)
        setSaveButtonShow(false)
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 250)
      }
    }
  }, [contactInfoToEdit])

  const errorHeading = () => {
    if (error === null) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const handlePressSave = (data) => {
    const { _id } = contactInfoToEdit
    editContactInfo({ id: _id }, data)
    setCVBitScreenSelected('contactInfo')
  }

  const saveButton = () => {
    if (!saveButtonShow) return null
    const formValues = {
      email,
      phone,
      unit,
      complex,
      address,
      suburb,
      city,
      province,
      country,
      postalCode,
    }
    return (
      <View style={styles.nextBackButtonsBed}>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            setSaveButtonShow(false)
            setAddressInputShow(true)
          }}
        >
          <Ionicons
            name="arrow-back-circle-sharp"
            style={styles.addButtonIcon}
          />
          <Text
            style={
              Platform.OS === 'ios'
                ? styles.addButtonTextIos
                : styles.addButtonText
            }
          >
            edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => handlePressSave(formValues)}
        >
          <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
          <Text
            style={
              Platform.OS === 'ios'
                ? styles.addButtonTextIos
                : styles.addButtonText
            }
          >
            save
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const emailInputNext = () => {
    const { errors, isValid } = validateEmailInput(email)
    if (!isValid) {
      addError({ email: errors.email })
      Keyboard.dismiss()
    } else {
      setEmailInputShow(false)
      setPhoneInputShow(true)
    }
  }

  const renderEmailField = () => {
    if (!emailInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Email Address</Text>
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder="Enter your email address"
          value={email}
          autoFocus={!error ? true : false}
          onFocus={() => clearErrors()}
          onChangeText={setEmail}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {error === null ? null : (
          <>
            {error.email ? (
              <Text style={styles.error}>{error.email}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <FormCancelButton route="contactInfo" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => emailInputNext()}
          >
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.addButtonTextIos
                  : styles.addButtonText
              }
            >
              next
            </Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const phoneInputNext = () => {
    const { errors, isValid } = validatePhoneInput(phone)
    if (!isValid) {
      addError({ phone: errors.phone })
      Keyboard.dismiss()
    } else {
      setPhoneInputShow(false)
      setAddressInputShow(true)
    }
  }

  const renderPhoneField = () => {
    if (!phoneInputShoow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Phone Number</Text>
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder="Enter your phone number"
          value={phone}
          onFocus={() => clearErrors()}
          autoFocus={!error ? true : false}
          onChangeText={setPhone}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="phone-pad"
        />
        {error === null ? null : (
          <>
            {error.phone ? (
              <Text style={styles.error}>{error.phone}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setPhoneInputShow(false)
              setEmailInputShow(true)
            }}
          >
            <Ionicons
              name="arrow-back-circle-sharp"
              style={styles.addButtonIcon}
            />
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.addButtonTextIos
                  : styles.addButtonText
              }
            >
              back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => phoneInputNext()}
          >
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.addButtonTextIos
                  : styles.addButtonText
              }
            >
              next
            </Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const multipleFormFieldValue = (field) => {
    if (field === 'email') return email
    if (field === 'phone') return phone
    if (field === 'unit') return unit
    if (field === 'complex') return complex
    if (field === 'address') return address
    if (field === 'suburb') return suburb
    if (field === 'city') return city
    if (field === 'province') return province
    if (field === 'country') return country
    if (field === 'postalCode') return postalCode
  }

  const addressFieldSetState = (field) => {
    if (field === 'unit') return setUnit
    if (field === 'complex') return setComplex
    if (field === 'address') return setAddress
    if (field === 'suburb') return setSuburb
    if (field === 'city') return setCity
    if (field === 'province') return setProvince
    if (field === 'country') return setCountry
    if (field === 'postalCode') return setPostalCode
  }

  const addressField = (label, placeHolder, field) => {
    return (
      <>
        <Text style={styles.inputHeader}>{label}</Text>
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder={placeHolder}
          value={multipleFormFieldValue(field)}
          onChangeText={addressFieldSetState(field)}
          autoCorrect={false}
          autoCapitalize="words"
          autoFocus={!error && field === 'unit' ? true : false}
        />
      </>
    )
  }

  const renderAddressFields = () => {
    if (!addressInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Address Information</Text>
        {addressField('Unit Number', 'Unit/Flat number', 'unit')}
        {addressField('Complex Name', 'Complex/Building name', 'complex')}
        {addressField('Street Address', 'Enter your street address', 'address')}
        {addressField(
          userCountry === 'PH' ? 'Barangay' : userCountry === 'NG' ? 'LGA' : 'Suburb',
          userCountry === 'PH' ? 'Barangay' : userCountry === 'NG' ? 'Local Government Area' : 'Suburb/Neighborhood',
          'suburb'
        )}
        {addressField('City', 'City', 'city')}
        {addressField(
          userCountry === 'PH' ? 'Region' : userCountry === 'NG' ? 'State' : 'Province/State',
          userCountry === 'PH' ? 'Region' : userCountry === 'NG' ? 'State' : 'Province or State',
          'province'
        )}
        {countryConfig.addressFields.country && addressField('Country', 'Country', 'country')}
        {addressField(
          userCountry === 'PH' ? 'ZIP Code' : 'Postal Code',
          userCountry === 'PH' ? 'ZIP code' : 'Postal/ZIP code',
          'postalCode'
        )}
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setAddressInputShow(false)
              setPhoneInputShow(true)
            }}
          >
            <Ionicons
              name="arrow-back-circle-sharp"
              style={styles.addButtonIcon}
            />
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.addButtonTextIos
                  : styles.addButtonText
              }
            >
              back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setAddressInputShow(false)
              setSaveButtonShow(true)
            }}
          >
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.addButtonTextIos
                  : styles.addButtonText
              }
            >
              next
            </Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderPreview = () => {
    if (!saveButtonShow) return null
    return (
      <View style={styles.previewBed}>
        {!email ? null : (
          <View>
            <Text style={styles.previewLabel}>Email Address</Text>
            <Text style={styles.previewText}>{email}</Text>
          </View>
        )}
        {!phone ? null : (
          <View>
            <Text style={styles.previewLabel}>Phone Number</Text>
            <Text style={styles.previewText}>{phone}</Text>
          </View>
        )}
        {(!address || address.length < 1) &&
        (!suburb || suburb.length < 1) &&
        (!city || city.length < 1) &&
        (!province || province.length < 1) &&
        (!country || country.length < 1) &&
        (!postalCode || postalCode.length < 1) ? null : (
          <View>
            <Text style={styles.previewLabel}>Address Information</Text>
            {!unit || unit.length < 1 ? null : (
              <Text>
                {!complex || complex.length === 0 ? null : 'unit:'}
                {unit}
              </Text>
            )}
            {!complex || complex.length < 1 ? null : <Text>{complex}</Text>}
            {!address || address.length < 1 ? null : <Text>{address}</Text>}
            {!suburb || suburb.length < 1 ? null : <Text>{suburb}</Text>}
            {!city || city.length < 1 ? null : <Text>{city}</Text>}
            {!province || province.length < 1 ? null : <Text>{province}</Text>}
            {!country || country.length < 1 ? null : <Text>{country}</Text>}
            {!postalCode || postalCode.length < 1 ? null : (
              <Text>{postalCode}</Text>
            )}
          </View>
        )}
      </View>
    )
  }

  const renderForm = () => {
    return (
      <View style={styles.formBed}>
        {renderEmailField()}
        {renderPhoneField()}
        {renderAddressFields()}
        {saveButton()}
        {saveButtonShow ? null : <FormHintModal bit="contactInfo" />}
      </View>
    )
  }

  const renderContent = () => {
    if (loading) return <LoaderFullScreen />
    return (
      <KeyboardAvoidingView
        style={
          Platform.OS === 'ios' && keyboard.keyboardShown === false
            ? styles.bedIos
            : styles.bedAndroid
        }
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {errorHeading()}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={
            keyboard.keyboardShown
              ? styles.scrollContent
              : styles.scrollContentCentered
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={addressInputShow}
          persistentScrollbar={Platform.OS === 'android' && addressInputShow}
        >
          {renderPreview()}
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
  scrollContent: {
    paddingBottom: 150,
    paddingTop: 40,
  },
  scrollContentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 150,
    paddingTop: 80,
  },
  formBed: {
    flexDirection: 'column',
  },
  inputHeader: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
    marginTop: 5,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    textAlign: 'center',
    borderRadius: 7,
    margin: 5,
  },
  errorHeadingBed: {
    backgroundColor: '#ffcfd8',
    borderColor: '#ff0033',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    width: '85%',
    marginVertical: 10,
  },
  errorHeadingText: {
    color: '#ff0033',
    padding: 10,
    alignSelf: 'center',
  },
  error: {
    color: '#ff0033',
    alignSelf: 'center',
    paddingBottom: 10,
  },
  doneButtonContainer: {
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    width: 90,
    marginTop: 15,
    marginBottom: 30,
    height: 40,
  },
  addButtonContainer: {
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    width: 90,
    height: 40,
    marginHorizontal: 5,
  },
  addButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingRight: 5,
  },
  addButtonTextIos: {
    color: '#ffff',
    fontSize: 18,
  },
  addButtonText: {
    color: '#ffff',
    fontSize: 18,
    marginBottom: 4,
  },
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
  },
  nextBackButtonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
  },
  previewBed: {
    backgroundColor: '#ffff',
    alignSelf: 'center',
    width: '90%',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  previewLabel: {
    fontFamily: 'sourceSansProBold',
  },
  previewText: {
    marginBottom: 5,
  },
})

export default ContactInfoEditForm
