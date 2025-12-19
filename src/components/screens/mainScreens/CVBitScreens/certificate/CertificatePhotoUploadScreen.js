import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ScrollView,
} from 'react-native'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'

import keys from '../../../../../../config/keys'
import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import PhotoPermissions from '../photo/PhotoPermissions'
import FormCancelButton from '../../../../common/FormCancelButton'
import DoneButton from '../../../../links/DoneButton'
import { Context as CertificateContext } from '../../../../../context/CertificateContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const CertificatePhotoUploadScreen = () => {
  const [modal, setModal] = useState(true)
  const [title, setTitle] = useState(null)
  const [imageUri, setImageUri] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState(null)
  const [galleryPermissionStatus, setGalleryPermissionStatus] = useState(null)
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const {
    state: { loading, uploadSignature },
    createCertificate,
    createUploadSignature,
    clearUploadSignature,
  } = useContext(CertificateContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    if (uploadSignature) {
      imageUpload()
    }
  }, [uploadSignature])

  const keyboard = useKeyboard()

  // Scroll to input when keyboard appears
  useEffect(() => {
    if (keyboard.keyboardShown && imageUri && scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 300)
    }
  }, [keyboard.keyboardShown, imageUri])

  const handleCertificateCreate = (data) => {
    createCertificate({
      title: title,
      photoUrl: data.secure_url || data.url,
      publicId: data.public_id,
    })
    setImageUploading(false)
    setModal(false)
    setTitle(null)
    setImageFile(null)
    clearUploadSignature()
    setCVBitScreenSelected('certificate')
  }

  const randomFileName =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString()

  // Helper function to process and compress images
  const processImage = async (uri) => {
    try {
      // First, resize the image to a maximum width of 1200px while maintaining aspect ratio
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Resize to max 1200px width
        {
          compress: 0.3, // 30% compression quality
          format: ImageManipulator.SaveFormat.JPEG, // Convert to JPEG for better compression
        }
      )
      return resizedImage
    } catch (error) {
      // If processing fails, return original URI
      return { uri }
    }
  }

  const imageUpload = () => {
    const { apiKey, signature, timestamp } = uploadSignature
    const data = new FormData()
    if (imageFile) {
      data.append('file', {
        uri: imageFile.uri,
        type: `documents/${imageFile.uri.split('.')[1]}`,
        name: imageFile.name,
      })
      data.append('api_key', apiKey)
      data.append('timestamp', timestamp)
      data.append('signature', signature)
      fetch(keys.cloudinary.uploadImageUrl, {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setImageUploading(false)
            clearUploadSignature()
            Alert.alert('Unable to upload image, please try again later')
            setCVBitScreenSelected('')
            return
          }
          handleCertificateCreate(data)
        })
        .catch((err) => {
          Alert.alert('Unable to upload image, please try again later')
          setCVBitScreenSelected('')
          return
        })
    }
  }

  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Higher initial quality since we'll process it further
      })
      if (!data.canceled) {
        const { uri } = data.assets[0]

        // Process the image (resize and compress)
        const processedImage = await processImage(uri)

        let newFile = {
          uri: processedImage.uri,
          type: `certificate/jpeg`, // Always JPEG after processing
          name: `${randomFileName}.jpg`,
        }
        setImageUri(newFile.uri)
        setImageFile(newFile)
        setModal(false)
      }
    } else {
      setGalleryPermissionStatus(false)
    }
  }

  const pickFromCamera = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync()
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Higher initial quality since we'll process it further
      })
      if (!data.canceled) {
        const { uri } = data.assets[0]

        // Process the image (resize and compress)
        const processedImage = await processImage(uri)

        let newFile = {
          uri: processedImage.uri,
          type: `certificate/jpeg`, // Always JPEG after processing
          name: `${randomFileName}.jpg`,
        }
        setImageUri(newFile.uri)
        setImageFile(newFile)
        setModal(false)
      }
    } else {
      setCameraPermissionStatus(false)
    }
  }

  const titleField = () => {
    if (!imageUri || imageUri.length < 1) return null
    return (
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
          <Image source={{ uri: imageUri }} style={styles.photo} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            textAlign="center"
            placeholder="image title"
            value={title}
            onChangeText={setTitle}
            autoCorrect={false}
            autoFocus={true}
            onFocus={() => {
              // Scroll to end when input is focused
              setTimeout(() => {
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollToEnd({ animated: true })
                }
              }, 300)
            }}
          />
          <View style={styles.donePlusButtonBed}>
            <FormCancelButton route="certificate" />
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => createUploadSignature()}
            >
              <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
              <Text style={styles.addButtonText}>save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  const cameraOrGallery = () => {
    if (modal === false) return null
    return (
      <View>
        <TouchableOpacity
          style={styles.imageSelectButton}
          onPress={pickFromGallery}
        >
          <View style={styles.imageSelectButtonsBed}>
            <Fontisto style={styles.imageSelectButtonIcon} name="photograph" />
            <Text style={styles.imageSelectButtonText}>gallery</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageSelectButton}
          onPress={pickFromCamera}
        >
          <View style={styles.imageSelectButtonsBed}>
            <Fontisto style={styles.imageSelectButtonIcon} name="camera" />
            <Text style={styles.imageSelectButtonText}>camera</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderContent = () => {
    if (loading) return <LoaderFullScreen />
    if (cameraPermissionStatus === false)
      return <PhotoPermissions bit="camera" routeName="certificate" />
    if (galleryPermissionStatus === false)
      return <PhotoPermissions bit="gallery" routeName="certificate" />
    return (
      <>
        <View style={styles.bed}>
          {cameraOrGallery()}
          {titleField()}
        </View>
        {imageUri !== null ? null : (
          <DoneButton text="Cancel" routeName="certificate" />
        )}
      </>
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
  bedIos: {
    backgroundColor: '#232936',
    width: '100%',
    flex: 1,
    paddingTop: '10%',
  },
  bedAndroid: {
    backgroundColor: '#232936',
    width: '100%',
    flex: 1,
    paddingTop: '10%',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#232936',
  },
  scrollContent: {
    paddingBottom: 150,
    paddingTop: 40,
  },
  imageSelectButton: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageSelectButtonsBed: {
    flexDirection: 'row',
  },
  imageSelectButtonText: {
    color: '#ffff',
    fontSize: 18,
    paddingVertical: 10,
  },
  imageSelectButtonIcon: {
    color: '#ffff',
    fontSize: 22,
    paddingTop: 10,
    paddingRight: 10,
  },
  buttonContentBed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  buttonIcon: {
    color: '#42daf5',
    fontSize: 24,
  },
  buttonText: {
    color: '#42daf5',
    fontSize: 20,
  },
  cancelButton: {
    alignSelf: 'center',
    width: 37,
    marginTop: 10,
    backgroundColor: '#232936',
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 2,
  },
  cancelButtonIcon: {
    fontSize: 22,
    color: 'red',
    padding: 5,
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
    height: 50,
    width: '85%',
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 7,
    marginVertical: 10,
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
  addButtonText: {
    color: '#ffff',
    fontSize: 18,
    marginBottom: 5,
  },
})

export default CertificatePhotoUploadScreen
