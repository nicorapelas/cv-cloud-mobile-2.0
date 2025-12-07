import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import { useKeyboard } from '@react-native-community/hooks'

import OptionsModal from '../../../../../common/modals/OptionsModal'
import YearPicker from '../../../../../common/datePicker/YearPicker'
import FormHintModal from '../../../../../common/modals/FormHintModal'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as TertEduContext } from '../../../../../../context/TertEduContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const TertEduEditEditForm = ({ incomingCertificationType }) => {
  const [instituteName, setInstituteName] = useState(null)
  const [certificationType, setCertificationType] = useState(null)
  const [description, setDescription] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState(null)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const [instituteNameInputShow, setInstituteNameInputShow] = useState(true)
  const [datesInputShow, setDatesInputShow] = useState(false)
  const [certificateInputShow, setCertificateInputShow] = useState(false)
  const [desctiptionInputShow, setDescriptionInputShow] = useState(false)
  const [additionalInfoInputShow, setAdditionalInfoInputShow] = useState(false)
  const [saveButtonShow, setSaveButtonShow] = useState(false)

  const {
    state: {
      yearPickerProps,
      yearPickerShow,
      optionsModalSelectedOption,
      startYear,
      endYear,
    },
    setStartYear,
    setEndYear,
    setOptionsModalSelectedOption,
  } = useContext(UniversalContext)

  const {
    state: { loading, error, tertEduToEdit },
    editTertEdu,
    addError,
    clearTertEduErrors,
  } = useContext(TertEduContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (tertEduToEdit) {
      const {
        additionalInfo,
        certificationType,
        description,
        instituteName,
        startDate,
        endDate,
      } = tertEduToEdit
      setAdditionalInfo(additionalInfo)
      setCertificationType(certificationType)
      setOptionsModalSelectedOption(certificationType)
      setDescription(description)
      setInstituteName(instituteName)
      setStartYear(startDate)
      setEndYear(endDate)
    }
  }, [tertEduToEdit])

  useEffect(() => {
    if (optionsModalSelectedOption)
      setCertificationType(optionsModalSelectedOption)
  }, [optionsModalSelectedOption])

  useEffect(() => {
    if (error) {
      if (error.instituteName) setInstituteNameInputShow(true)
      if (error.dates) setDatesInputShow(true)
    }
  }, [error])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && (instituteName !== null || description !== null || additionalInfo !== null) && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, instituteName, description, additionalInfo])

  const errorHeading = () => {
    if (error === null) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const instituteNameInputNext = () => {
    if (!instituteName || !instituteName.replace(/\s/g, '').length) {
      addError({ instituteName: `'Institute Name' is required` })
      Keyboard.dismiss()
    } else {
      setInstituteNameInputShow(false)
      setDatesInputShow(true)
    }
  }

  const instituteNameInput = () => {
    if (!instituteNameInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Institute Name</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          maxLength={30}
          textAlign="center"
          placeholder="institute name"
          value={instituteName}
          onFocus={() => {
            clearTertEduErrors()
            // Scroll to end when input is focused
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            }, 300)
          }}
          onChangeText={setInstituteName}
          autoCorrect={false}
          autoCapitalize="words"
          autoFocus={!error ? true : false}
        />
        {!error || error === null || yearPickerShow ? (
          <Text style={styles.maxCharactersNote}>
            max 30 characters ({!instituteName ? '0' : instituteName.length}
            /30)
          </Text>
        ) : (
          <>
            {error.instituteName ? (
              <Text style={styles.error}>{error.instituteName}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <FormCancelButton route="tertEdu" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => instituteNameInputNext()}
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

  const datesInputNext = () => {
    if (moment(startYear) > moment(endYear)) {
      addError({ dates: `The end date cannot be prior to the start date` })
    } else {
      setDatesInputShow(false)
      setCertificateInputShow(true)
    }
  }

  const datesInput = () => {
    if (!datesInputShow) return null
    if (!yearPickerProps) {
      return (
        <View style={error && error.dates ? styles.datesErrorBed : null}>
          <Text style={styles.inputHeader}>Dates attended</Text>
          <YearPicker
            bit="startYear"
            buttonText="start date"
            incomingYearSelected={startYear}
          />
          <YearPicker
            bit="endYear"
            buttonText="end date"
            incomingYearSelected={endYear}
          />
          <View style={styles.nextBackButtonsBed}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                setDatesInputShow(false)
                setInstituteNameInputShow(true)
                clearTertEduErrors()
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
              onPress={() => datesInputNext()}
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
          {!error || error === null || yearPickerShow ? null : (
            <>
              {error.dates ? (
                <Text style={styles.error}>{error.dates}</Text>
              ) : null}
            </>
          )}
        </View>
      )
    } else {
      const { bit } = yearPickerProps
      if (bit === 'startYear')
        return (
          <>
            <Text style={styles.yearPickerHeader}>Start date</Text>
            <YearPicker bit="startYear" buttonText="start date" />
          </>
        )
      if (bit === 'endYear')
        return (
          <>
            <Text style={styles.yearPickerHeader}>End date</Text>
            <YearPicker bit="endYear" buttonText="end date" />
          </>
        )
    }
  }

  const certificateInputNext = () => {
    if (!certificationType) {
      setCertificateInputShow(false)
      setAdditionalInfoInputShow(true)
    } else {
      setCertificateInputShow(false)
      setDescriptionInputShow(true)
    }
  }

  const certificateInput = () => {
    if (!certificateInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Certification type</Text>
        <OptionsModal
          bit="certificateType"
          incomingValue={incomingCertificationType}
        />
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setCertificateInputShow(false)
              setDatesInputShow(true)
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
            onPress={() => certificateInputNext()}
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

  const descriptionInput = () => {
    if (!desctiptionInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Certification description</Text>
        <TextInput
          ref={inputRef}
          style={styles.descriptionInputTextArea}
          maxLength={120}
          placeholder="certification description"
          numberOfLines={30}
          value={description}
          onChangeText={setDescription}
          onFocus={() => {
            // Scroll to end when input is focused
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            }, 300)
          }}
          autoCorrect={true}
          autoCapitalize="sentences"
          multiline={true}
          autoFocus={!error ? true : false}
        />
        <Text style={styles.maxCharactersNote}>
          max 120 characters ({!description ? '0' : description.length}
          /120)
        </Text>
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setDescriptionInputShow(false)
              setCertificateInputShow(true)
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
              setDescriptionInputShow(false)
              setAdditionalInfoInputShow(true)
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

  const additionalInfoInputBack = () => {
    if (!certificationType) {
      setAdditionalInfoInputShow(false)
      setCertificateInputShow(true)
    } else {
      setAdditionalInfoInputShow(false)
      setDescriptionInputShow(true)
    }
  }

  const additionalInfoInput = () => {
    if (!additionalInfoInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Additional information</Text>
        <TextInput
          ref={inputRef}
          style={styles.inputTextArea}
          maxLength={180}
          multiline={true}
          numberOfLines={50}
          placeholder="additional information"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          onFocus={() => {
            // Scroll to end when input is focused
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            }, 300)
          }}
          autoCorrect={true}
          autoCapitalize="sentences"
          autoFocus={!error ? true : false}
        />
        <Text style={styles.maxCharactersNote}>
          max 180 characters ({!additionalInfo ? '0' : additionalInfo.length}
          /180)
        </Text>
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => additionalInfoInputBack()}
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
              setAdditionalInfoInputShow(false)
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
        {!instituteName ? null : (
          <View>
            <Text style={styles.previewLabel}>Institute Name</Text>
            <Text style={styles.previewText}>{instituteName}</Text>
          </View>
        )}
        {!startYear || !endYear ? null : (
          <View>
            <Text style={styles.previewLabel}>Dates attended</Text>
            <Text style={styles.previewText}>
              {startYear}-{endYear}
            </Text>
          </View>
        )}
        {!certificationType ? null : (
          <View>
            <Text style={styles.previewAdditionlInfoLabel}>
              Certification type
            </Text>
            <Text style={styles.previewText}>{certificationType}</Text>
          </View>
        )}
        {!certificationType || !description || description.length < 1 ? null : (
          <View>
            <Text style={styles.previewAdditionlInfoLabel}>
              Certification description
            </Text>
            <Text style={styles.previewText}>{description}</Text>
          </View>
        )}
        {!additionalInfo || additionalInfo.length < 1 ? null : (
          <View>
            <Text style={styles.previewAdditionlInfoLabel}>
              Additional information
            </Text>
            <Text style={styles.previewText}>{additionalInfo}</Text>
          </View>
        )}
      </View>
    )
  }

  const handlePressSave = (data) => {
    const { _id } = tertEduToEdit
    editTertEdu({ id: _id }, { formValues: data })
    setCVBitScreenSelected('tertEdu')
    setStartYear(null)
    setEndYear(null)
    setOptionsModalSelectedOption(null)
  }

  const saveButton = () => {
    if (!saveButtonShow) return null
    const formValues = {
      instituteName,
      startDate: startYear,
      endDate: endYear,
      certificationType,
      description,
      additionalInfo,
    }
    return (
      <View style={styles.nextBackButtonsBed}>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            setSaveButtonShow(false)
            setAdditionalInfoInputShow(true)
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

  const renderForm = () => {
    return (
      <>
        {instituteNameInput()}
        {datesInput()}
        {certificateInput()}
        {descriptionInput()}
        {additionalInfoInput()}
        {saveButton()}
        {saveButtonShow ? null : <FormHintModal bit="tertEdu" />}
      </>
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
        {!yearPickerShow ? (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderPreview()}
            {renderForm()}
          </ScrollView>
        ) : (
          <View style={styles.yearPickerBed}>{renderForm()}</View>
        )}
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
  formBed: {
    flexDirection: 'column',
    paddingTop: 30,
    paddingBottom: 10,
  },
  inputHeader: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
    marginTop: 5,
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
  maxCharactersNote: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  inputTextArea: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    textAlignVertical: 'top',
    width: '85%',
    height: 200,
    borderRadius: 7,
    padding: 5,
    margin: 5,
  },
  descriptionInputTextArea: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    textAlignVertical: 'top',
    width: '85%',
    height: 100,
    borderRadius: 7,
    padding: 5,
    margin: 5,
  },
  yearPickerBed: {
    flex: 1,
    justifyContent: 'center',
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
  datesErrorBed: {
    borderColor: '#ff0033',
    backgroundColor: '#ffcfd8',
    borderRadius: 7,
    borderWidth: 2,
  },
  yearPickerHeader: {
    color: '#ffff',
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'sourceSansProExtraLight',
    marginBottom: -15,
  },
  error: {
    color: '#ff0033',
    alignSelf: 'center',
    paddingBottom: 10,
  },
  certificationTypeButtonContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  certificationTypeButtonText: {
    color: '#B6B8BA',
  },
  certificationTypeText: {
    color: '#030303',
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
  nextBackButtonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 15,
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
  previewAdditionlInfoLabel: {
    fontFamily: 'sourceSansProBold',
    marginTop: 7,
  },
  previewText: {
    marginBottom: 5,
  },
})

export default TertEduEditEditForm
