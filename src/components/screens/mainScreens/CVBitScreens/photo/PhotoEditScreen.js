import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'

import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import FormCancelButton from '../../../../common/FormCancelButton'
import { Context as PhotoContext } from '../../../../../context/PhotoContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const PhotoEditScreen = () => {
  const [id, setId] = useState()
  const [title, setTitle] = useState()
  const [photoUrl, setPhotoUrl] = useState()
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, photoToEdit },
    editPhoto,
  } = useContext(PhotoContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const keyboard = useKeyboard()

  useEffect(() => {
    if (photoToEdit) {
      const { _id, title, photoUrl } = photoToEdit
      setId(_id)
      setTitle(title)
      setPhotoUrl(photoUrl)
    }
  }, [photoToEdit])

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && photoUrl && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, photoUrl])

  //   {
  //     editPhoto(id, { title: title }, () => {
  //       navigation.navigate('Photo')
  //     })
  //     setTitle('')
  //     buildCV()
  //   }

  const handlePressEdit = () => {
    editPhoto(id, { title })
    setTitle('')
    setCVBitScreenSelected('photo')
  }

  const renderContent = () => {
    if (loading || loading === null) return <LoaderFullScreen />
    return (
      <View style={styles.bed}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              style={styles.photo}
              source={{
                uri: photoUrl,
              }}
            />
            <TextInput
              ref={inputRef}
              style={styles.input}
              textAlign="center"
              placeholder="title"
              value={title}
              onChangeText={setTitle}
              autoCorrect={false}
              autoCapitalize="words"
              onFocus={() => {
                // Scroll to end when input is focused
                setTimeout(() => {
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true })
                  }
                }, 300)
              }}
            />
            <View style={styles.buttonContainer}>
              <FormCancelButton route="photo" />
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={handlePressEdit}
              >
                <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
                <Text style={styles.addButtonText}>save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }

  return renderContent()
}

const styles = StyleSheet.create({
  heading: {
    color: '#ffff',
    fontSize: 22,
  },
  bed: {
    backgroundColor: '#232936',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#232936',
  },
  scrollContent: {
    paddingBottom: 150,
    paddingTop: 40,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 7,
    alignSelf: 'center',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    textAlign: 'center',
    borderRadius: 7,
    margin: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginLeft: 10,
  },
  addButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingRight: 5,
  },
  addButtonText: {
    color: '#ffff',
    fontSize: 18,
    marginBottom: 5,
  },
})

export default PhotoEditScreen
