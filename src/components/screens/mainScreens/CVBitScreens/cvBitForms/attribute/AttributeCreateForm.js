import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import uuid from 'uuid/v4'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import FormHintModal from '../../../../../common/modals/FormHintModal'
import FormCancelButton from '../../../../../common/FormCancelButton'
import { Context as AttributeContext } from '../../../../../../context/AttributeContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const AttributeCreateForm = ({ bit }) => {
  const [attribute, setAttribute] = useState(null)
  const [attributeArray, setAttributeArray] = useState([])
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, error, attributes },
    createAttribute,
    clearAttributeErrors,
  } = useContext(AttributeContext)

  const {
    state: { tipSelected, userPlanformOS },
    tipSelectReset,
    toggleHideNavLinks,
  } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    addIncomingAttributes()
  }, [attributes])

  useEffect(() => {
    addTipSelectedAttribute()
  }, [tipSelected])

  useEffect(() => {
    if (error) toggleHideNavLinks(false)
  }, [error])

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

  const addAttribute = () => {
    if (!attribute || !attribute.replace(/\s/g, '').length) {
      return null
    } else {
      const queryUnique = attributeArray.filter((att) => {
        return att.attribute === attribute
      })
      if (queryUnique.length !== 0) {
        return null
      } else {
        return setAttributeArray([
          ...attributeArray,
          { attribute, key: uuid() },
        ])
      }
    }
  }

  const addIncomingAttributes = () => {
    if (!attributes || attributes.length < 1) return null
    attributes.map((att) => {
      setAttributeArray((attributeArray) => [
        ...attributeArray,
        { attribute: att.attribute, key: uuid() },
      ])
    })
  }

  const addTipSelectedAttribute = () => {
    if (!tipSelected) return null
    const queryUnique = attributeArray.filter((att) => {
      return att.attribute === attribute
    })
    if (queryUnique.length !== 0) {
      return null
    } else {
      return setAttributeArray([
        ...attributeArray,
        { attribute: tipSelected, key: uuid() },
      ])
    }
  }

  const removeArrayItem = (key) => {
    const newArray = attributeArray.filter((att) => att.key !== key)
    setAttributeArray(newArray)
  }

  const errorHeading = () => {
    if (!error) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const renderAttributeArray = () => {
    if (!attributeArray || attributeArray.length < 1) return null
    return attributeArray.map((att) => {
      return (
        <View style={styles.itemListBed} key={att.key}>
          <Text style={styles.itemList}>{att.attribute}</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <MaterialCommunityIcons
              style={styles.deleteButtonIcon}
              name="delete"
              onPress={() => removeArrayItem(att.key)}
            />
          </TouchableOpacity>
        </View>
      )
    })
  }

  const handleSave = () => {
    createAttribute(attributeArray)
    tipSelectReset()
    setCVBitScreenSelected('attribute')
  }

  const renderDoneSaveButton = () => {
    if (!attributeArray || attributeArray.length < 1) return null
    if (keyboard.keyboardShown) {
      return (
        <>
          <View style={styles.donePlusButtonBed}>
            <FormCancelButton route="attribute" />
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                addAttribute()
                setAttribute(null)
                Keyboard.dismiss()
              }}
            >
              <MaterialIcons name="check-circle" style={styles.addButtonIcon} />
              <Text
                style={
                  userPlanformOS === 'ios'
                    ? styles.addButtonTextIos
                    : styles.addButtonText
                }
              >
                done
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                addAttribute()
                setAttribute(null)
              }}
            >
              <AntDesign name="plus" style={styles.addButtonIcon} />
              <Text
                style={
                  userPlanformOS === 'ios'
                    ? styles.addButtonTextIos
                    : styles.addButtonText
                }
              >
                add
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )
    }
    return (
      <>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={handleSave}
        >
          <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
          <Text
            style={
              userPlanformOS === 'ios'
                ? styles.addButtonTextIos
                : styles.addButtonText
            }
          >
            save
          </Text>
        </TouchableOpacity>
      </>
    )
  }

  const renderForm = () => {
    if (loading) return <LoaderFullScreen />
    return (
      <View style={styles.formBed}>
        <Text style={styles.inputHeading}>Attribute</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          maxLength={25}
          onSubmitEditing={() => {
            addAttribute()
            setAttribute(null)
          }}
          returnKeyLabel="add"
          blurOnSubmit={false}
          textAlign="center"
          placeholder="attribute"
          value={attribute}
          onChangeText={setAttribute}
          onFocus={() => {
            tipSelectReset()
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
            max 25 characters ({!attribute ? '0' : attribute.length}
            /25)
          </Text>
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
        {!attributeArray || attributeArray.length < 1 ? (
          <FormCancelButton route="attribute" />
        ) : null}
        {renderDoneSaveButton()}
        <FormHintModal bit={bit} />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={
        userPlanformOS === 'ios' && keyboard.keyboardShown === false
          ? styles.bedIos
          : styles.bedAndroid
      }
      behavior={userPlanformOS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={userPlanformOS === 'ios' ? 0 : 0}
    >
      {errorHeading()}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderAttributeArray()}
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
    marginVertical: 10,
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

export default AttributeCreateForm
