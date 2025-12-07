import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { MaterialIcons, Ionicons, Octicons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import RadioProficiencyButton from '../../../../../common/RadioProficiencyButton'
import FormHintModal from '../../../../../common/modals/FormHintModal'
import ProficiencyOne from '../../../../../common/proficiencyDots/ProficiencyOne'
import ProficiencyTwo from '../../../../../common/proficiencyDots/ProficiencyTwo'
import ProficiencyThree from '../../../../../common/proficiencyDots/ProficiencyThree'
import ProficiencyFour from '../../../../../common/proficiencyDots/ProficiencyFour'
import ProficiencyFive from '../../../../../common/proficiencyDots/ProficiencyFive'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as LanguageContext } from '../../../../../../context/LanguageContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const LanguageEditForm = () => {
  const [saveButtonShow, setSaveButtonShow] = useState(false)
  const [language, setLanguage] = useState(null)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const [write, setWrite] = useState(null)
  const [read, setRead] = useState(null)
  const [speak, setSpeak] = useState(null)
  const [languageInputShow, setLanguageInputShow] = useState(true)
  const [writeProficiencyInputShow, setWriteProficiencyInputShow] =
    useState(false)
  const [readProficiencyInputShow, setReadProficiencyInputShow] =
    useState(false)
  const [speakProficiencyInputShow, setSpeakProficiencyInputShow] =
    useState(false)

  const {
    state: { loading, error, languageToEdit },
    editLanguage,
    addError,
    clearLanguageErrors,
  } = useContext(LanguageContext)

  const {
    state: { proficiency },
    setProficiency,
  } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (error) setLanguageInputShow(true)
  }, [error])

  useEffect(() => {
    if (languageToEdit) {
      const { language, read, speak, write } = languageToEdit
      setLanguage(language)
      setRead(read)
      setSpeak(speak)
      setWrite(write)
    }
  }, [languageToEdit])

  useEffect(() => {
    if (writeProficiencyInputShow) setProficiency(write)
    if (readProficiencyInputShow) setProficiency(read)
    if (speakProficiencyInputShow) setProficiency(speak)
  }, [
    writeProficiencyInputShow,
    speakProficiencyInputShow,
    readProficiencyInputShow,
    write,
    speak,
    read,
  ])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && language !== null && languageInputShow && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, language, languageInputShow])

  const errorHeading = () => {
    if (!error) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const renderProfiencyDots = (val) => {
    if (val === 1) return <ProficiencyOne zoom="zoomedIn" />
    if (val === 2) return <ProficiencyTwo zoom="zoomedIn" />
    if (val === 3) return <ProficiencyThree zoom="zoomedIn" />
    if (val === 4) return <ProficiencyFour zoom="zoomedIn" />
    if (val === 5) return <ProficiencyFive zoom="zoomedIn" />
  }

  const renderPreview = () => {
    if (!saveButtonShow) return null
    return (
      <View style={styles.previewBed}>
        <View style={styles.headingBed}>
          <Octicons style={styles.point} name="dot-fill" />
          <Text style={styles.previewHeading}>{language}</Text>
        </View>
        {!write ? null : (
          <View style={styles.previewTextBed}>
            <Text style={styles.previewText}>write</Text>
            <Text style={styles.previewProficiencyBed}>
              {renderProfiencyDots(write)}
            </Text>
          </View>
        )}
        {!read ? null : (
          <View style={styles.previewTextBed}>
            <Text style={styles.previewText}>read</Text>
            <Text style={styles.previewProficiencyBed}>
              {renderProfiencyDots(read)}
            </Text>
          </View>
        )}
        {!speak ? null : (
          <View style={styles.previewTextBed}>
            <Text style={styles.previewText}>speak</Text>
            <Text style={styles.previewProficiencyBed}>
              {renderProfiencyDots(speak)}
            </Text>
          </View>
        )}
      </View>
    )
  }

  const languageInputNext = () => {
    if (
      !language ||
      language.length < 1 ||
      !language.replace(/\s/g, '').length
    ) {
      addError(`'Language' is required`)
      Keyboard.dismiss()
    } else {
      setLanguageInputShow(false)
      setWriteProficiencyInputShow(true)
    }
  }

  const handlePressEdit = () => {
    const { _id } = languageToEdit
    editLanguage({ id: _id }, { language, read, write, speak })
    setCVBitScreenSelected('language')
  }

  const languageInput = () => {
    if (!languageInputShow) return null
    return (
      <>
        <Text style={styles.heading}>Lanuage</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          maxLength={25}
          textAlign="center"
          placeholder="language"
          value={language}
          onChangeText={setLanguage}
          onFocus={() => {
            clearLanguageErrors()
            // Scroll to end when input is focused
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            }, 300)
          }}
          autoCorrect={false}
          autoFocus={!error ? true : false}
        />
        {!error ? (
          <Text style={styles.maxCharactersNote}>
            max 25 characters ({!language ? '0' : language.length}
            /25)
          </Text>
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
        <View style={styles.buttonContainer}>
          {!languageInputShow ? null : <FormCancelButton route="language" />}
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => languageInputNext()}
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
      </>
    )
  }

  const writeProficiencyInput = () => {
    if (!writeProficiencyInputShow) return null
    return (
      <>
        <Text style={styles.heading}>How well do you write in {language}?</Text>
        <RadioProficiencyButton
          bit="language"
          formPart="write"
          incomingProficiency={write}
        />
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setWriteProficiencyInputShow(false)
              setLanguageInputShow(true)
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
              setWrite(proficiency)
              setWriteProficiencyInputShow(false)
              setReadProficiencyInputShow(true)
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
      </>
    )
  }

  const readProficiencyInput = () => {
    if (!readProficiencyInputShow) return null
    return (
      <>
        <Text style={styles.heading}>How well do you read {language}?</Text>
        <RadioProficiencyButton
          bit="language"
          formPart="read"
          incomingProficiency={read}
        />
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setReadProficiencyInputShow(false)
              setLanguageInputShow(true)
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
              setRead(proficiency)
              setReadProficiencyInputShow(false)
              setSpeakProficiencyInputShow(true)
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
      </>
    )
  }

  const speakProficiencyInput = () => {
    if (!speakProficiencyInputShow) return null
    return (
      <>
        <Text style={styles.heading}>How well do you speak {language}?</Text>
        <RadioProficiencyButton
          bit="language"
          formPart="speak"
          incomingProficiency={speak}
        />
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setSpeakProficiencyInputShow(false)
              setLanguageInputShow(true)
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
              setSpeak(proficiency)
              setSpeakProficiencyInputShow(false)
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
              done
            </Text>
            <Ionicons
              name="arrow-forward-circle-sharp"
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const renderForm = () => {
    if (loading || loading === null) return <LoaderFullScreen />
    return (
      <View style={styles.formBed}>
        <View style={styles.formBed} behavior="padding">
          {languageInput()}
          {writeProficiencyInput()}
          {readProficiencyInput()}
          {speakProficiencyInput()}
          {!saveButtonShow ? null : (
            <View style={styles.saveButtonBed}>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => {
                  setLanguageInputShow(true)
                  setSaveButtonShow(false)
                }}
              >
                <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
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
                onPress={handlePressEdit}
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
          )}
          {saveButtonShow ? null : <FormHintModal bit="language" />}
        </View>
      </View>
    )
  }

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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderPreview()}
        {renderForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  )
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
  previewBed: {
    backgroundColor: '#ffff',
    width: '90%',
    borderRadius: 5,
    marginTop: 15,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  headingBed: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  point: {
    fontSize: 20,
    paddingTop: 11,
  },
  previewHeading: {
    fontSize: 22,
    marginTop: 5,
    marginLeft: 5,
  },
  previewTextBed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  previewText: {
    fontSize: 20,
    paddingTop: 4,
  },
  heading: {
    color: '#ffff',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 5,
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
  addButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingRight: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nextBackButtonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
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
  saveButtonBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
})

export default LanguageEditForm
