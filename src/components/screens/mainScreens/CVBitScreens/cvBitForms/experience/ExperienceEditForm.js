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
import { useKeyboard } from '@react-native-community/hooks'

import FormHintModal from '../../../../../common/modals/FormHintModal'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as ExperienceContext } from '../../../../../../context/ExperienceContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const ExperienceEditForm = () => {
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [titleInputShow, setTitleInputShow] = useState(true)
  const [descriptionInputShow, setDescriptionInputShow] = useState(false)
  const [saveButtonShow, setSaveButtonShow] = useState(false)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, error, experienceToEdit },
    editExperience,
    addError,
    clearExperienceErrors,
  } = useContext(ExperienceContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (error) {
      if (error.title) setTitleInputShow(true)
    }
  }, [error])

  useEffect(() => {
    if (experienceToEdit) {
      const { description, title } = experienceToEdit
      setDescription(description)
      setTitle(title)
    }
  }, [experienceToEdit])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (
      keyboard.keyboardShown &&
      (titleInputShow || descriptionInputShow) &&
      scrollViewRef.current
    ) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, titleInputShow, descriptionInputShow])

  // Flash scroll indicators on iOS when description step loads
  useEffect(() => {
    if (
      descriptionInputShow &&
      Platform.OS === 'ios' &&
      scrollViewRef.current
    ) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.flashScrollIndicators()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [descriptionInputShow])

  const errorHeading = () => {
    if (error === null) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const titleInputNext = () => {
    if (!title || title.length < 1 || !title.replace(/\s/g, '').length) {
      addError({ title: `'Title' is required` })
      Keyboard.dismiss()
      return
    } else {
      setTitleInputShow(false)
      setDescriptionInputShow(true)
      return
    }
  }

  const titleInput = () => {
    if (!titleInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Job title</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          maxLength={25}
          textAlign="center"
          placeholder="job title"
          value={title}
          onFocus={() => {
            clearExperienceErrors()
            // Scroll to end when input is focused
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            }, 300)
          }}
          onChangeText={setTitle}
          autoCorrect={true}
          autoCapitalize="words"
          autoFocus={!error ? true : false}
          editable={true}
        />
        {!error || error === null ? (
          <Text style={styles.maxCharactersNote}>
            max 25 characters ({!title ? '0' : title.length}
            /25)
          </Text>
        ) : (
          <>
            {error.title ? (
              <Text style={styles.error}>{error.title}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <FormCancelButton route="experience" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => titleInputNext()}
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
    if (!descriptionInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Job description</Text>
        <TextInput
          ref={inputRef}
          style={styles.inputTextArea}
          maxLength={230}
          multiline={true}
          numberOfLines={50}
          placeholder="job description"
          value={description}
          onChangeText={setDescription}
          autoCorrect={true}
          autoCapitalize="sentences"
          autoFocus={!error ? true : false}
          onFocus={() => {
            // Scroll to end when input is focused
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            }, 300)
          }}
          editable={true}
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
              setTitleInputShow(true)
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

  const handlePressSave = (data) => {
    const { _id } = experienceToEdit
    editExperience({ id: _id }, { formValues: data })
    setTitle(null)
    setDescription(null)
    setCVBitScreenSelected('experience')
  }

  const saveButton = () => {
    if (!saveButtonShow) return null
    const formValues = {
      title,
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

  const renderPreview = () => {
    if (!saveButtonShow) return null
    return (
      <View style={styles.previewBed}>
        {!title ? null : (
          <View>
            <Text style={styles.previewLabel}>Job title</Text>
            <Text style={styles.previewText}>{title}</Text>
          </View>
        )}
        {!description ? null : (
          <View>
            <Text style={styles.previewLabel}>Job description</Text>
            <Text style={styles.previewText}>{description}</Text>
          </View>
        )}
      </View>
    )
  }

  const renderForm = () => {
    return (
      <View style={styles.formBed}>
        {titleInput()}
        {descriptionInput()}
        {saveButton()}
        {saveButtonShow ? null : <FormHintModal bit="experience" />}
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
          showsVerticalScrollIndicator={descriptionInputShow}
          persistentScrollbar={
            Platform.OS === 'android' && descriptionInputShow
          }
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
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
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
  previewText: {
    marginBottom: 5,
  },
})

export default ExperienceEditForm
