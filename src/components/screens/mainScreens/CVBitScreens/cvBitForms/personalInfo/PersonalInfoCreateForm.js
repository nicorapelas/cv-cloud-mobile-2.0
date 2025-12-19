import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
} from 'react-native'
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import FormHintModal from '../../../../../common/modals/FormHintModal'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import CountrySelector from '../../../../../common/selectors/CountrySelector'
import GenderSelector from '../../../../../common/selectors/GenderSelector'
import DriversLicenseInput from './DriversLicenseInput'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as PersonalInfoContext } from '../../../../../../context/PersonalInfoContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'
import {
  COUNTRIES,
  getCountryConfig,
  detectUserCountry,
} from '../../../../../../utils/countryConfig'

const PersonalInfoCreateForm = ({
  incomingDateOfBirth,
  incomingFullName,
  incomingGender,
  incomingIdNumber,
  incomingNationality,
  incomingPpNumber,
  incomingSaCitizen,
}) => {
  const [fullName, setFullName] = useState(
    incomingFullName ? incomingFullName : null
  )

  const [dateOfBirth, setDateOfBirth] = useState(new Date())

  const [gender, setGender] = useState(incomingGender ? incomingGender : null)
  const [country, setCountry] = useState(detectUserCountry())
  // Default saCitizen based on country: true for ZA, false for others
  const [saCitizen, setSaCitizen] = useState(
    detectUserCountry() === 'ZA' ? true : false
  )

  const [idNumber, setIdNumber] = useState(
    incomingIdNumber ? incomingIdNumber : null
  )
  const [nationality, setNationality] = useState(
    incomingNationality ? incomingNationality : null
  )
  const [ppNumber, setPpNumber] = useState(
    incomingPpNumber ? incomingPpNumber : null
  )

  const [fullNameInputShow, setFullNameInputShow] = useState(true)
  const [countryInputShow, setCountryInputShow] = useState(false)
  const [idInputShow, setIdInputShow] = useState(false)
  const [licenseInputShow, setLicenseInputShow] = useState(false)
  const [dateOfBirthInputShow, setDateOfBirthInputShow] = useState(false)
  const [genderInputShow, setGenderInputShow] = useState(false)

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dummyDateShow, setDummyDateShow] = useState(false)
  const [saveButtonShow, setSaveButtonShow] = useState(false)

  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  // Get country configuration based on selected country
  const countryConfig = getCountryConfig(country)

  const { toggleHideNavLinks } = useContext(UniversalContext)

  const {
    state: { loading, error, driversLicense, licenseCode },
    createPersonalInfo,
    addError,
    clearErrors,
  } = useContext(PersonalInfoContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (incomingDateOfBirth) {
      const parsedBirthday = new Date(
        moment(incomingDateOfBirth).format('YYYY-MM-DD')
      )
      setDateOfBirth(parsedBirthday)
      setDummyDateShow(true)
    }
  }, [])

  // Debug: Log country state changes
  useEffect(() => {
    console.log('PersonalInfoCreateForm: Country state changed to:', country)
  }, [country])

  useEffect(() => {
    if (error) toggleHideNavLinks(false)
  }, [error])

  // Update saCitizen: incoming value takes precedence, otherwise set based on country
  useEffect(() => {
    if (incomingSaCitizen !== undefined) {
      // Incoming value takes precedence
      setSaCitizen(incomingSaCitizen)
    } else if (country === 'ZA') {
      // Only set based on country if no incoming value is provided
      setSaCitizen(true)
    } else if (country) {
      // Only set to false if country is set and not ZA
      setSaCitizen(false)
    }
  }, [country, incomingSaCitizen])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (
      keyboard.keyboardShown &&
      (fullNameInputShow || idInputShow) &&
      scrollViewRef.current
    ) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, fullNameInputShow, idInputShow])

  const errorHeading = () => {
    if (!error) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const toggleSaCitizen = () => setSaCitizen((previousState) => !previousState)

  const onChangeDatePickerIos = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth
    setDateOfBirth(currentDate)
    clearErrors()
  }

  const onChangeDatePickerAndroid = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth
    setDatePickerOpen(false)
    setDateOfBirth(currentDate)
    clearErrors()
  }

  const renderGenderPicker = () => {
    if (!genderInputShow) return null
    return (
      <>
        <Text style={styles.inputHeader}>Gender</Text>
        <GenderSelector
          selectedGender={gender}
          onSelect={(genderValue) => {
            setGender(genderValue)
          }}
        />
        {
          <View style={styles.nextBackButtonsBed}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                setGenderInputShow(false)
                setDateOfBirthInputShow(true)
              }}
            >
              <Ionicons
                name="arrow-back-circle-sharp"
                style={styles.addButtonIcon}
              />
              <Text style={styles.addButtonText}>back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                setGenderInputShow(false)
                setIdInputShow(true)
              }}
            >
              <Text style={styles.addButtonText}>next</Text>
              <Ionicons
                name="arrow-forward-circle-sharp"
                style={styles.nextButtonIcon}
              />
            </TouchableOpacity>
          </View>
        }
      </>
    )
  }

  const renderDatePicker = () => {
    let thisDate = new Date()
    if (!dateOfBirthInputShow) return null
    if (dummyDateShow) {
      return (
        <>
          <Text style={styles.inputHeader}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.dummyInput}
            onPress={() => {
              setDummyDateShow(false)
              setDatePickerOpen(true)
            }}
          >
            <Text style={styles.dummyInputText}>
              {dateOfBirth ? moment(dateOfBirth).format('D MMMM YYYY') : ''}
            </Text>
          </TouchableOpacity>
          <View style={styles.nextBackButtonsBed}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                setFullNameInputShow(true)
                setDateOfBirthInputShow(false)
              }}
            >
              <Ionicons
                name="arrow-back-circle-sharp"
                style={styles.addButtonIcon}
              />
              <Text style={styles.addButtonText}>back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                setGenderInputShow(true)
                setDateOfBirthInputShow(false)
              }}
            >
              <Text style={styles.addButtonText}>next</Text>
              <Ionicons
                name="arrow-forward-circle-sharp"
                style={styles.nextButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </>
      )
    }
    return (
      <>
        {datePickerOpen ? (
          <View
            style={
              Platform.OS === 'ios'
                ? styles.datePickerBedIos
                : styles.datePickerBedAndroid
            }
          >
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={
                Platform.OS === 'ios'
                  ? onChangeDatePickerIos
                  : onChangeDatePickerAndroid
              }
            />
            <TouchableOpacity
              style={
                Platform.OS === 'ios'
                  ? styles.pickerBackButtonIos
                  : styles.pickerBackButtonAndroid
              }
              onPress={() => setDatePickerOpen(false)}
            >
              <MaterialIcons
                style={styles.pickerBackButtonIcon}
                name="check-circle"
              />
              <Text style={styles.pickerBackButtonText}>done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.genderButtonBed}>
              <Text style={styles.inputHeader}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateOfBirthButtonContainer}
                onPress={() => {
                  setDatePickerOpen(true)
                }}
              >
                {dateOfBirth.getFullYear() === thisDate.getFullYear() ? (
                  <Text style={styles.dateOfBirthButtonText}>
                    date of birth
                  </Text>
                ) : (
                  <Text style={styles.dateOfBirthText}>
                    {moment(dateOfBirth).format('D MMMM YYYY')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.nextBackButtonsBed}>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => {
                  setFullNameInputShow(true)
                  setDateOfBirthInputShow(false)
                }}
              >
                <Ionicons
                  name="arrow-back-circle-sharp"
                  style={styles.addButtonIcon}
                />
                <Text style={styles.addButtonText}>back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => {
                  setGenderInputShow(true)
                  setDateOfBirthInputShow(false)
                }}
              >
                <Text style={styles.addButtonText}>next</Text>
                <Ionicons
                  name="arrow-forward-circle-sharp"
                  style={styles.nextButtonIcon}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </>
    )
  }

  const fullNameInputNext = () => {
    if (
      !fullName ||
      fullName.length < 1 ||
      !fullName.replace(/\s/g, '').length
    ) {
      addError({ error: `'Full Name' is required` })
      return
    } else {
      setFullNameInputShow(false)
      setCountryInputShow(true)
      return
    }
  }

  const renderNameField = () => {
    if (!fullNameInputShow) return null
    return (
      <>
        <View>
          <Text style={styles.inputHeader}>Full Name</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            maxLength={30}
            onSubmitEditing={() => fullNameInputNext()}
            autoFocus={!error ? true : false}
            returnKeyLabel="next"
            returnKeyType="next"
            textAlign="center"
            placeholder="full name"
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => {
              clearErrors()
              // Scroll to end when input is focused
              setTimeout(() => {
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollToEnd({ animated: true })
                }
              }, 300)
            }}
            autoCorrect={false}
            autoCapitalize="words"
            editable={true}
          />
        </View>
        {!error ? (
          <Text style={styles.maxCharactersNote}>
            max 30 characters ({!fullName ? '0' : fullName.length}
            /30)
          </Text>
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
        <View style={styles.nextBackButtonsBed}>
          <FormCancelButton route="personalInfo" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => fullNameInputNext()}
          >
            <Text style={styles.addButtonText}>next</Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const renderCountrySelector = () => {
    if (!countryInputShow) return null
    return (
      <>
        <View>
          <Text style={[styles.inputHeader, { marginBottom: 5 }]}>Country</Text>
          <Text style={styles.helperText}>
            {country === 'ZA'
              ? '🇿🇦 South Africa - Full features available'
              : `${
                  COUNTRIES.find((c) => c.code === country)?.flag || '🌍'
                } International`}
          </Text>
          <CountrySelector
            selectedCountryCode={country}
            onSelect={(countryCode) => {
              console.log(
                'PersonalInfoCreateForm: Country selected:',
                countryCode
              )
              setCountry(countryCode)
              toggleHideNavLinks(false)
            }}
          />
        </View>
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setCountryInputShow(false)
              setFullNameInputShow(true)
            }}
          >
            <Ionicons
              name="arrow-back-circle-sharp"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setCountryInputShow(false)
              setDateOfBirthInputShow(true)
            }}
          >
            <Text style={styles.addButtonText}>next</Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const renderSaCitizenFields = () => {
    if (!idInputShow) return null
    return (
      <>
        {/* Show SA Citizen toggle only for non-ZA countries */}
        {country !== 'ZA' && (
          <View style={styles.switchFieldBed}>
            <Text style={styles.switchFieldText}>South African citizen?</Text>
            <Switch
              trackColor={{ false: '#ffff', true: '#81b0ff' }}
              thumbColor={saCitizen ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={toggleSaCitizen}
              value={saCitizen}
            />
            <Text style={styles.switchFieldText}>
              {saCitizen ? 'yes' : 'no'}
            </Text>
          </View>
        )}

        {/* Show ID field if ZA country OR if SA citizen */}
        {country === 'ZA' || saCitizen ? (
          <View>
            <Text style={styles.inputHeader}>{countryConfig.idLabel}</Text>
            <Text style={styles.helperText}>{countryConfig.idHelperText}</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              maxLength={country === 'ZA' ? 13 : 20}
              textAlign="center"
              placeholder={countryConfig.idPlaceholder}
              value={idNumber}
              onChangeText={setIdNumber}
              onFocus={() => {
                // Scroll to end when input is focused
                setTimeout(() => {
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true })
                  }
                }, 300)
              }}
              autoCorrect={false}
              keyboardType="phone-pad"
              editable={true}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Passport Number</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              maxLength={10}
              textAlign="center"
              placeholder="passport number"
              value={ppNumber}
              onChangeText={setPpNumber}
              onFocus={() => {
                // Scroll to end when input is focused
                setTimeout(() => {
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true })
                  }
                }, 300)
              }}
              autoCorrect={false}
              editable={true}
            />
          </View>
        )}
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setIdInputShow(false)
              setGenderInputShow(true)
            }}
          >
            <Ionicons
              name="arrow-back-circle-sharp"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setIdInputShow(false)
              setLicenseInputShow(true)
            }}
          >
            <Text style={styles.addButtonText}>next</Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const handlePressSave = (data) => {
    createPersonalInfo(data)
    setCVBitScreenSelected('personalInfo')
  }

  const saveButton = () => {
    let thisDate = new Date()
    if (!saveButtonShow) return null
    console.log('PersonalInfoCreateForm: Saving with country state:', country)
    const formValuesToSubmit = {
      fullName,
      dateOfBirth:
        dateOfBirth.getFullYear() === thisDate.getFullYear()
          ? null
          : dateOfBirth,
      country,
      gender,
      saCitizen,
      idNumber,
      ppNumber,
      driversLicense,
      licenseCode,
    }
    console.log(
      'PersonalInfoCreateForm: formValuesToSubmit:',
      formValuesToSubmit
    )
    return (
      <View style={styles.nextBackButtonsBed}>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            setSaveButtonShow(false)
            setLicenseInputShow(true)
          }}
        >
          <Ionicons
            name="arrow-back-circle-sharp"
            style={styles.addButtonIcon}
          />
          <Text style={styles.addButtonText}>edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => handlePressSave(formValuesToSubmit)}
        >
          <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
          <Text style={styles.addButtonText}>save</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderPreview = () => {
    let thisDate = new Date()
    if (!saveButtonShow) return null
    return (
      <View style={styles.previewBed}>
        {!fullName ? null : (
          <View>
            <Text style={styles.previewLabel}>Full Name</Text>
            <Text style={styles.previewText}>{fullName}</Text>
          </View>
        )}
        {dateOfBirth.getFullYear() === thisDate.getFullYear() ? null : (
          <View>
            <Text style={styles.previewLabel}>Date of Birth</Text>
            <Text style={styles.previewText}>
              {moment(dateOfBirth).format('D MMMM YYYY')}
            </Text>
          </View>
        )}
        {!gender ? null : (
          <View>
            <Text style={styles.previewLabel}>Gender</Text>
            <Text style={styles.previewText}>{gender}</Text>
          </View>
        )}
        {!country ? null : (
          <View>
            <Text style={styles.previewLabel}>Country</Text>
            <Text style={styles.previewText}>
              {COUNTRIES.find((c) => c.code === country)?.name || country}
            </Text>
          </View>
        )}
        {!saCitizen || country !== 'ZA' ? null : (
          <View>
            <Text style={styles.previewLabel}>Nationality</Text>
            <Text style={styles.previewText}>South African</Text>
          </View>
        )}
        {saCitizen || !ppNumber ? null : (
          <View>
            <Text style={styles.previewLabel}>Passport number</Text>
            <Text style={styles.previewText}>{ppNumber}</Text>
          </View>
        )}
        {!idNumber ? null : (
          <View>
            <Text style={styles.previewLabel}>ID Number</Text>
            <Text style={styles.previewText}>ID {idNumber}</Text>
          </View>
        )}
        {!licenseCode || !driversLicense ? null : (
          <View>
            <Text style={styles.previewLabel}>Driver license</Text>
            <Text style={styles.previewText}>
              {country === 'ZA'
                ? `Code: ${licenseCode}`
                : (() => {
                    const licenseMap = {
                      MOTORCYCLE: 'Motorcycle',
                      LIGHT_MOTOR: 'Light motor vehicle',
                      MEDIUM_COMMERCIAL: 'Medium commercial vehicle',
                      HEAVY_COMMERCIAL: 'Heavy commercial vehicle',
                      LIGHT_MOTOR_TRAILER: 'Light motor vehicle with trailer',
                      MEDIUM_COMMERCIAL_TRAILER:
                        'Medium commercial vehicle with trailer',
                      HEAVY_COMMERCIAL_TRAILER:
                        'Heavy commercial vehicle with trailer',
                    }
                    return licenseMap[licenseCode] || licenseCode
                  })()}
            </Text>
          </View>
        )}
      </View>
    )
  }

  const renderForm = () => {
    return (
      <View style={styles.formBed}>
        {renderNameField()}
        {renderCountrySelector()}
        {renderDatePicker()}
        {renderGenderPicker()}
        {renderSaCitizenFields()}
        {!licenseInputShow ? null : (
          <>
            <DriversLicenseInput country={country} />
            <View style={styles.nextBackButtonsBed}>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => {
                  setLicenseInputShow(false)
                  setIdInputShow(true)
                }}
              >
                <Ionicons
                  name="arrow-back-circle-sharp"
                  style={styles.addButtonIcon}
                />
                <Text style={styles.addButtonText}>back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => {
                  setLicenseInputShow(false)
                  setSaveButtonShow(true)
                }}
              >
                <Text style={styles.addButtonText}>next</Text>
                <Ionicons
                  name="arrow-forward-circle-sharp"
                  style={styles.nextButtonIcon}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        {saveButton()}
        {datePickerOpen || saveButtonShow ? null : (
          <FormHintModal bit="personalInfo" />
        )}
      </View>
    )
  }

  const renderContent = () => {
    if (loading || loading === null) return <LoaderFullScreen />
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
          showsVerticalScrollIndicator={false}
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
  inputHeader: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    borderRadius: 7,
    margin: 5,
  },
  maxCharactersNote: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  dummyInput: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    alignItems: 'center',
    height: 50,
    width: '85%',
    borderRadius: 7,
    margin: 5,
  },
  dummyInputText: {
    marginTop: 17,
  },
  dateOfBirthButtonContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  dateOfBirthButtonText: {
    color: '#B6B8BA',
  },
  dateOfBirthText: {
    color: '#030303',
  },
  datePickerBedIos: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    padding: 15,
  },
  datePickerBedAndroid: {
    display: 'none',
  },
  pickerBackButtonIos: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  pickerBackButtonAndroid: {
    display: 'none',
  },
  pickerBackButtonIcon: {
    color: '#278ACD',
    paddingRight: 7,
    paddingTop: 2,
    fontSize: 20,
  },
  pickerBackButtonText: {
    color: '#278ACD',
    fontSize: 18,
  },
  genderButtonContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  genderButtonText: {
    color: '#B6B8BA',
  },
  genderText: {
    color: '#030303',
  },
  genderPickerBed: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    width: '60%',
    paddingBottom: 15,
    alignSelf: 'center',
  },
  switchFieldBed: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  switchFieldText: {
    color: '#ffff',
    paddingHorizontal: 10,
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
    margin: 5,
    height: 40,
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
  addButtonTextIos: {
    color: '#ffff',
    fontSize: 18,
  },
  addButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingRight: 5,
  },
  addButtonText: {
    color: '#ffff',
    fontSize: 18,
    marginBottom: 3,
  },
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
  },
  nextBackButtonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
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
  helperText: {
    color: '#7ac6fa',
    fontSize: 12,
    width: '85%',
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: -3,
  },
  scrollContent: {
    paddingBottom: 150,
    paddingTop: 40,
  },
  scrollContentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 150,
    paddingTop: 40,
  },
  formBed: {
    flexDirection: 'column',
  },
  pickerButton: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    borderRadius: 7,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
})

export default PersonalInfoCreateForm
