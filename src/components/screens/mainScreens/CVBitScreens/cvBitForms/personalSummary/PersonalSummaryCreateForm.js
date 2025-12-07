import _ from 'lodash'
import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { MaterialIcons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import FormHintModal from '../../../../../common/modals/FormHintModal'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as PersonalSummaryContext } from '../../../../../../context/PersonalSummaryContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const PersonalSummaryCreateForm = ({ bit }) => {
  const [personalSummaryNew, setPersonalSummaryNew] = useState(null)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, error },
    createPersonalSummary,
    clearPersonalSummaryErrors,
  } = useContext(PersonalSummaryContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && personalSummaryNew !== null && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, personalSummaryNew])

  const errorHeading = () => {
    if (!error) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const handlePressSave = () => {
    createPersonalSummary({ content: personalSummaryNew })
    setCVBitScreenSelected('personalSummary')
  }

  const renderForm = () => {
    if (loading || loading === null) return <LoaderFullScreen />
    return (
      <View style={styles.formBed}>
        <Text style={styles.inputHeader}>Personal summary</Text>
        <TextInput
          ref={inputRef}
          style={styles.inputTextArea}
          maxLength={330}
          multiline={true}
          numberOfLines={100}
          placeholder="personal summary"
          value={personalSummaryNew}
          onChangeText={setPersonalSummaryNew}
          onFocus={() => {
            clearPersonalSummaryErrors()
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
        {!error ? (
          <Text style={styles.maxCharactersNote}>
            max 330 characters (
            {!personalSummaryNew ? '0' : personalSummaryNew.length}
            /330)
          </Text>
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
        <View style={styles.donePlusButtonBed}>
          <FormCancelButton route="personalSummary" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={handlePressSave}
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
        <FormHintModal bit="personalSummary" />
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
    marginVertical: 10,
  },
  inputHeader: {
    color: '#ffff',
    width: '85%',
    alignSelf: 'center',
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
  donePlusButtonBed: {
    flexDirection: 'row',
    alignSelf: 'center',
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
    paddingTop: 5,
    paddingBottom: 20,
  },
  itemListBed: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    alignSelf: 'center',
    borderRadius: 25,
    padding: 3,
    marginVertical: 2,
  },
  itemList: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 7,
  },
  deleteButton: {
    backgroundColor: '#f56c6c',
    borderRadius: 25,
  },
  deleteButtonIcon: {
    color: '#ffff',
    fontSize: 20,
    padding: 7,
  },
})

export default PersonalSummaryCreateForm
