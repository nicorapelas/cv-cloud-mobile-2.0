import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'

import FormHintModal from '../../../../../common/modals/FormHintModal'
import FormCancelButton from '../../../../../common/FormCancelButton'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import YearMonthPicker from '../../../../../common/datePicker/YearMonthPicker'
import { Context as EmployHistoryContext } from '../../../../../../context/EmployHistoryContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const EmployHistoryEditForm = () => {
  const [company, setCompany] = useState(null)
  const [position, setPosition] = useState(null)
  const [description, setDescription] = useState(null)
  const [companyNameInputShow, setCompanyNameInputShow] = useState(true)
  const [datesInputShow, setDatesInputShow] = useState(false)
  const [positionInputShow, setPositionInputShow] = useState(false)
  const [descriptionInputShow, setDescriptionInputShow] = useState(false)
  const [saveButtonShow, setSaveButtonShow] = useState(false)
  const [current, setCurrent] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [initStartDateDone, setInitStartDateDone] = useState(false)
  const [initEndDateDone, setInitEndDateDone] = useState(false)

  const {
    state: {
      monthYearPickerProps,
      monthYearPickerShow,
      startYear,
      endYear,
      startMonth,
      endMonth,
    },
    setStartYear,
    setEndYear,
    setStartMonth,
    setEndMonth,
  } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const {
    state: { loading, error, employHistoryToEdit },
    editEmployHistory,
    addError,
    clearEmployHistoryErrors,
  } = useContext(EmployHistoryContext)

  useEffect(() => {
    if (startYear && startMonth) setStartDate(`${startMonth} ${startYear}`)
    if (endYear && endMonth) setEndDate(`${endMonth} ${endYear}`)
  }, [startYear, endYear, startMonth, endMonth])

  useEffect(() => {
    if (employHistoryToEdit) {
      const { company, current, description, startDate, endDate, position } =
        employHistoryToEdit
      setCompany(company)
      setCurrent(current)
      setDescription(description)
      setStartDate(startDate)
      setEndDate(endDate)
      setPosition(position)
    }
  }, [employHistoryToEdit])

  useEffect(() => {
    if (!initStartDateDone) {
      if (startDate) {
        const [month, year] = startDate.split(' ')
        setStartMonth(month)
        setStartYear(year)
        setInitStartDateDone(true)
      }
    }
  }, [initStartDateDone, startDate, endDate])

  useEffect(() => {
    if (!initEndDateDone) {
      if (endDate) {
        const [month, year] = endDate.split(' ')
        setEndMonth(month)
        setEndYear(year)
        setInitEndDateDone(true)
      }
    }
  }, [initEndDateDone, startDate, endDate])

  useEffect(() => {
    if (current) {
      setEndDate(null)
    }
  }, [current])

  const keyboard = useKeyboard()

  const errorHeading = () => {
    if (error === null) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const datesInputNext = () => {
    if (!startYear || !endYear) {
      setDatesInputShow(false)
      setDescriptionInputShow(true)
      return
    } else {
      setDatesInputShow(false)
      setDescriptionInputShow(true)
      return
    }
  }

  const datesInput = () => {
    if (!datesInputShow) return null
    if (!monthYearPickerProps) {
      return (
        <View style={error && error.dates ? styles.datesErrorBed : null}>
          <Text style={styles.inputHeader}>Dates attended</Text>
          <YearMonthPicker bit="startYearMonth" buttonText="start date" />
          {current ? (
            <TouchableOpacity
              onPress={() => setCurrent(false)}
              style={styles.input}
            >
              <Text style={styles.currentButtonUndoText}>Current</Text>
            </TouchableOpacity>
          ) : (
            <YearMonthPicker bit="endYearMonth" buttonText="end date" />
          )}
          {current ? null : (
            <>
              <Text style={styles.orText}>or</Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrent(true)
                  setEndYear(null)
                }}
                style={styles.currentButton}
              >
                <Text style={styles.currentButtonText}>Current</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.nextBackButtonsBed}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                setDatesInputShow(false)
                setPositionInputShow(true)
                clearEmployHistoryErrors()
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
          {!error || error === null || monthYearPickerShow ? null : (
            <>
              {error.dates ? (
                <Text style={styles.error}>{error.dates}</Text>
              ) : null}
            </>
          )}
        </View>
      )
    } else {
      const { bit } = monthYearPickerProps
      if (bit === 'startYearMonth') {
        return (
          <>
            <Text style={styles.yearPickerHeader}>Start date</Text>
            <YearMonthPicker bit="startYearMonth" buttonText="start date" />
          </>
        )
      } else {
        return (
          <>
            <Text style={styles.yearPickerHeader}>End date</Text>
            <YearMonthPicker bit="endYearMonth" buttonText="end date" />
          </>
        )
      }
    }
  }

  const descriptionInput = () => {
    if (!descriptionInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Work description</Text>
        <TextInput
          style={styles.inputTextArea}
          maxLength={230}
          multiline={true}
          numberOfLines={50}
          placeholder="work description"
          value={description}
          onChangeText={setDescription}
          autoCorrect={true}
          autoCapitalize="sentences"
          autoFocus={!error ? true : false}
        />
        <Text style={styles.maxCharactersNote}>
          max 230 characters ({!description ? '0' : description.length}
          /230)
        </Text>
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setDescriptionInputShow(false)
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
            onPress={() => {
              setDescriptionInputShow(false)
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

  const positionInput = () => {
    if (!positionInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Position</Text>
        <TextInput
          style={styles.input}
          maxLength={25}
          textAlign="center"
          placeholder="position"
          value={position}
          onChangeText={setPosition}
          autoCorrect={true}
          autoCapitalize="words"
          autoFocus={!error ? true : false}
        />
        <Text style={styles.maxCharactersNote}>
          max 25 characters ({!position ? '0' : position.length}
          /25)
        </Text>
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setPositionInputShow(false)
              setCompanyNameInputShow(true)
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
              setPositionInputShow(false)
              setDatesInputShow(true)
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

  const companyNameInputNext = () => {
    if (!company || !company.replace(/\s/g, '').length) {
      addError({ company: `'Company Name' is required` })
      Keyboard.dismiss()
    } else {
      setCompanyNameInputShow(false)
      setPositionInputShow(true)
    }
  }

  const companyNameInput = () => {
    if (!companyNameInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Company Name</Text>
        <TextInput
          style={styles.input}
          maxLength={25}
          textAlign="center"
          placeholder="company name"
          value={company}
          onFocus={clearEmployHistoryErrors}
          onChangeText={setCompany}
          autoCorrect={false}
          autoCapitalize="words"
          autoFocus={!error ? true : false}
        />
        {!error || error === null ? (
          <Text style={styles.maxCharactersNote}>
            max 25 characters ({!company ? '0' : company.length}
            /25)
          </Text>
        ) : (
          <>
            {error.company ? (
              <Text style={styles.error}>{error.company}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <FormCancelButton route="employHistory" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => companyNameInputNext()}
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

  const renderEndDatePreview = () => {
    if (current) {
      return <Text>Current</Text>
    }
    if (endDate) {
      return <Text>{endDate}</Text>
    }
    return null
  }

  const renderPreview = () => {
    if (!saveButtonShow) return null
    return (
      <View style={styles.previewBed}>
        {!company ? null : (
          <View>
            <Text style={styles.previewLabel}>Company Name</Text>
            <Text style={styles.previewText}>{company}</Text>
          </View>
        )}
        {!position ? null : (
          <View>
            <Text style={styles.previewLabel}>Position</Text>
            <Text style={styles.previewText}>{position}</Text>
          </View>
        )}
        {!startDate && !endDate ? null : (
          <View>
            <Text style={styles.previewLabel}>Dates attended</Text>
            <Text style={styles.previewText}>
              {startDate} - {renderEndDatePreview()}
            </Text>
          </View>
        )}
        {!description || description.length < 1 ? null : (
          <View>
            <Text style={styles.previewAdditionlInfoLabel}>
              Work description
            </Text>
            <Text style={styles.previewText}>{description}</Text>
          </View>
        )}
      </View>
    )
  }

  const handlePressSave = (data) => {
    const { _id } = employHistoryToEdit
    editEmployHistory({ id: _id }, { formValues: data })
    setStartYear(null)
    setEndYear(null)
    setStartMonth(null)
    setEndMonth(null)
    setCVBitScreenSelected('employHistory')
  }

  const saveButton = () => {
    if (!saveButtonShow) return null
    const formValues = {
      company,
      startDate,
      endDate,
      current,
      position,
      description,
    }
    return (
      <View style={styles.nextBackButtonsBed}>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            setSaveButtonShow(false)
            setDescriptionInputShow(true)
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
        {companyNameInput()}
        {positionInput()}
        {datesInput()}
        {descriptionInput()}
        {saveButton()}
        {saveButtonShow ? null : <FormHintModal bit="employmentHistory" />}
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {errorHeading()}
        {!monthYearPickerShow ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="always"
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
  formBed: {
    flexDirection: 'column',
    paddingTop: 30,
    paddingBottom: 10,
  },
  inputHeader: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
  },
  orText: {
    color: '#ffff',
    textAlign: 'center',
    margin: 5,
  },
  currentButton: {
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    alignSelf: 'center',
    height: 50,
    width: '85%',
    borderRadius: 7,
    margin: 5,
  },
  currentButtonText: {
    color: '#ffff',
    alignSelf: 'center',
    paddingTop: 15,
  },
  currentButtonUndoText: {
    alignSelf: 'center',
    paddingTop: 15,
  },
  input: {
    backgroundColor: '#ffff',
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
    marginBottom: -5,
  },
  error: {
    color: '#ff0033',
    alignSelf: 'center',
    paddingBottom: 10,
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
  datePickerBed: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 15,
  },
  pickerBackButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
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
  startEndDateButtonContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    margin: 5,
  },
  startEndDateButtonText: {
    color: '#B6B8BA',
  },
  startEndDateText: {
    color: '#030303',
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
  nextBackButtonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 7,
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

export default EmployHistoryEditForm
