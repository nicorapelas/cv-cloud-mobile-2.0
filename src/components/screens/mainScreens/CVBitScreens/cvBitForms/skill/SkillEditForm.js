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
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import RadioProficiencyButton from '../../../../../common/RadioProficiencyButton'
import FormHintModal from '../../../../../common/modals/FormHintModal'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as SkillContext } from '../../../../../../context/SkillContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const SkillEditForm = () => {
  const [skill, setSkill] = useState(null)
  const [proficiencyInputShow, setProficiencyInputShow] = useState(false)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, error, skillToEdit },
    editSkill,
    addError,
    clearSkillErrors,
  } = useContext(SkillContext)
  const {
    state: { proficiency },
    setProficiency,
  } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (error) setProficiencyInputShow(false)
  }, [error])

  useEffect(() => {
    if (skillToEdit) {
      const { skill, proficiency } = skillToEdit
      setSkill(skill)
      setProficiency(proficiency)
    }
  }, [skillToEdit])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && skill !== null && !proficiencyInputShow && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, skill, proficiencyInputShow])

  const errorHeading = () => {
    if (!error) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const skillInputNext = () => {
    if (!skill || skill.length < 1 || !skill.replace(/\s/g, '').length) {
      addError(`'Skill' is required`)
      Keyboard.dismiss()
    } else {
      setProficiencyInputShow(true)
    }
  }

  const renderProficiencyInput = () => {
    if (!proficiencyInputShow) return null
    return (
      <>
        <Text style={styles.heading}>How good are you at {skill}?</Text>
        <RadioProficiencyButton bit="skill" incomingProficiency={proficiency} />
      </>
    )
  }

  const handlePressEdit = () => {
    const { _id } = skillToEdit
    editSkill({ id: _id }, { skill, proficiency })
    setCVBitScreenSelected('skill')
  }

  const renderButtons = () => {
    return (
      <View style={styles.nextBackButtonsBed}>
        {proficiencyInputShow ? null : <FormCancelButton route="skill" />}
        {!proficiencyInputShow ? null : (
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setProficiencyInputShow(false)
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
        )}
        {!proficiencyInputShow ? (
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => skillInputNext()}
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
        ) : (
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
        )}
      </View>
    )
  }

  const renderForm = () => {
    if (loading || loading === null) return <LoaderFullScreen />
    return (
      <View style={styles.formBed}>
        <View style={styles.formBed} behavior="padding">
          {proficiencyInputShow ? null : (
            <>
              <Text style={styles.inputHeading}>Skill</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                maxLength={25}
                textAlign="center"
                placeholder="skill"
                value={skill}
                onChangeText={setSkill}
                onFocus={() => {
                  clearSkillErrors()
                  // Scroll to end when input is focused
                  setTimeout(() => {
                    if (scrollViewRef.current) {
                      scrollViewRef.current.scrollToEnd({ animated: true })
                    }
                  }, 300)
                }}
                autoCorrect={true}
                autoFocus={!error ? true : false}
              />
              {!error ? (
                <Text style={styles.maxCharactersNote}>
                  max 25 characters ({!skill ? '0' : skill.length}
                  /25)
                </Text>
              ) : (
                <Text style={styles.error}>{error}</Text>
              )}
            </>
          )}
          {renderProficiencyInput()}
          {renderButtons()}
        </View>
        <FormHintModal bit="skill" />
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
  inputHeading: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
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
  headingBed: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headingContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 15,
    borderRadius: 5,
  },
  point: {
    fontSize: 16,
    paddingTop: 10,
  },
  heading: {
    color: '#ffff',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 5,
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
  },
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
  },
})

export default SkillEditForm
