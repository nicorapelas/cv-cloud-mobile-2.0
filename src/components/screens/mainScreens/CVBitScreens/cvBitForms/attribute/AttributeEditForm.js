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
import { MaterialIcons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import FormHintModal from '../../../../../common/modals/FormHintModal'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as AttributeContext } from '../../../../../../context/AttributeContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const AttributeEditForm = () => {
  const [attribute, setAttribute] = useState(null)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, error, attributeToEdit },
    editAttribute,
    addError,
    clearAttributeErrors,
  } = useContext(AttributeContext)

  const {
    state: { tipSelected },
    tipSelectReset,
  } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (attributeToEdit) {
      const { attribute } = attributeToEdit
      setAttribute(attribute)
    }
  }, [attributeToEdit])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && attribute !== null && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, attribute])

  const errorHeading = () => {
    if (!error) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const handlePressEdit = () => {
    if (
      !attribute ||
      attribute.length < 1 ||
      !attribute.replace(/\s/g, '').length
    ) {
      addError(`'Attribute' is required`)
      Keyboard.dismiss()
    } else {
      const { _id } = attributeToEdit
      editAttribute({ id: _id, attribute })
      tipSelectReset()
      setCVBitScreenSelected('attribute')
    }
  }

  const renderButtons = () => {
    return (
      <View style={styles.buttonsBed}>
        <FormCancelButton route="attribute" />
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
    )
  }

  const renderForm = () => {
    if (loading || loading === null) return <LoaderFullScreen />
    return (
      <View style={styles.formBed}>
        <View style={styles.formBed} behavior="padding">
          <Text style={styles.inputHeading}>Attribute</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            maxLength={50}
            textAlign="center"
            placeholder="attribute"
            value={attribute}
            onChangeText={setAttribute}
            onFocus={() => {
              clearAttributeErrors()
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
              max 50 characters ({!attribute ? '0' : attribute.length}
              /50)
            </Text>
          ) : (
            <Text style={styles.error}>{error}</Text>
          )}
          {renderButtons()}
        </View>
        <FormHintModal bit="attribute" />
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
  buttonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
})

export default AttributeEditForm
