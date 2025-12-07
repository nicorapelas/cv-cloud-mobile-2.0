import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'

import keys from '../../../../../../config/keys'
import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import LoaderWithText from '../../../../common/LoaderWithText'
import FormCancelButton from '../../../../common/FormCancelButton'
import { Context as CertificateContext } from '../../../../../context/CertificateContext'
import { Context as NavContext } from '../../../../../context/NavContext'
import InstructionModal from '../../../../common/modals/InstructionModal'

const CertificatePdfUploadScreen = () => {
  const [title, setTitle] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [documentName, setDocumentName] = useState(null)
  const [pdfUploading, setPdfUploading] = useState(false)

  const {
    state: { loading, uploadSignature },
    createCertificate,
    createUploadSignature,
    clearUploadSignature,
  } = useContext(CertificateContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const keyboard = useKeyboard()

  useEffect(() => {
    ;(async () => {
      await pickFromDocuments()
    })()
  }, [])

  useEffect(() => {
    if (pdfUrl) {
      createFileName()
    }
  }, [pdfUrl])

  useEffect(() => {
    if (uploadSignature) {
      documentUpload()
      setPdfUploading(true)
    }
  }, [uploadSignature])

  const randomFileName =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString()

  const createFileName = () => {
    if (!pdfUrl || pdfUrl.type === 'canceled') return
    const fileType = pdfUrl.split('.').pop()
    setDocumentName(`${randomFileName}.${fileType}`)
  }

  const handleCertificateCreate = (data) => {
    createCertificate({
      title: title,
      pdfUrl: data.url,
      publicId: data.public_id,
    })
    setPdfUploading(false)
    setPdfUrl(null)
    clearUploadSignature()
    setCVBitScreenSelected('certificate')
  }

  const documentUpload = async () => {
    const { apiKey, signature, timestamp } = uploadSignature
    const data = new FormData()
    const fileType = pdfUrl.split('.').pop()
    data.append('file', {
      uri: pdfUrl,
      type: `application/${fileType}`,
      name: documentName,
    })
    data.append('api_key', apiKey)
    data.append('timestamp', timestamp)
    data.append('signature', signature)
    try {
      const response = await fetch(keys.cloudinary.uploadPdfUrl, {
        method: 'POST',
        body: data,
      })
      const result = await response.json()
      if (result.error) {
        handleUploadError()
        return
      }
      handleCertificateCreate(result)
    } catch (error) {
      handleUploadError()
    } finally {
      setPdfUploading(false)
    }
  }

  const handleUploadError = () => {
    setPdfUrl(null)
    setPdfUploading(false)
    clearUploadSignature()
    Alert.alert('Unable to upload PDF, please try again later')
    setCVBitScreenSelected('')
  }

  const pickFromDocuments = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    })
    if (!result || result.canceled) {
      setCVBitScreenSelected('certificateCreate')
    } else {
      const { uri } = result.assets[0]
      setPdfUrl(uri)
    }
  }

  const titleField = () => {
    if (!pdfUrl || pdfUrl.type === 'canceled') return null
    if (pdfUploading)
      return (
        <LoaderWithText
          mainText="uploading PDF document"
          subText="this may take a minute or so depending on the speed of your network connection"
        />
      )
    return (
      <View style={styles.textInputBed}>
        <MaterialIcons name="picture-as-pdf" style={styles.fileSelectedIcon} />
        <Text style={styles.fileSelected}>{pdfUrl.name}</Text>
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder="document title"
          value={title}
          onChangeText={setTitle}
          autoCorrect={false}
          autoFocus={true}
        />
        <View style={styles.buttonContainer}>
          <FormCancelButton route="certificate" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => createUploadSignature()}
          >
            <MaterialIcons style={styles.addButtonIcon} name="add-circle" />
            <Text style={styles.addButtonText}>save</Text>
          </TouchableOpacity>
        </View>
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {titleField()}
      </KeyboardAvoidingView>
    )
  }

  return (
    <>
      <InstructionModal bit="certificate" />
      {renderContent()}
    </>
  )
}

const styles = StyleSheet.create({
  heading: {
    color: '#ffff',
    fontSize: 22,
  },
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
  uploadOptionBed: {
    borderColor: '#7ac6fa',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    margin: 10,
  },
  uploadOptionHeading: {
    color: '#7ac6fa',
    alignSelf: 'center',
    fontWeight: '900',
    marginTop: 5,
    marginBottom: 15,
  },
  documentSelectButton: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    borderRadius: 5,
  },
  documentSelectButtonsBed: {
    flexDirection: 'row',
  },
  documentSelectButtonText: {
    color: '#ffff',
    fontSize: 18,
    paddingVertical: 10,
  },
  documentSelectButtonIcon: {
    color: '#ffff',
    fontSize: 22,
    paddingTop: 10,
    paddingRight: 10,
  },
  fileSelectedIcon: {
    color: '#ffff',
    fontSize: 60,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  fileSelected: {
    color: '#ffff',
    alignSelf: 'center',
    maxWidth: '60%',
    textAlign: 'center',
    paddingBottom: 10,
  },
  textInputBed: {
    paddingTop: '10%',
  },
  input: {
    backgroundColor: '#ffffff',
    height: 50,
    width: '85%',
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 7,
    marginBottom: 10,
  },
  note: {
    color: '#7ac6fa',
    width: '70%',
    textAlign: 'center',
    fontSize: 16,
    alignSelf: 'center',
    paddingVertical: 10,
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
  },
  inistructionLink: {
    borderColor: '#7ac6fa',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
  },
  inistructionLinkIcon: {
    color: '#7ac6fa',
    fontSize: 22,
    marginRight: 10,
  },
  inistructionLinkText: {
    color: '#7ac6fa',
    fontSize: 18,
  },
})

export default CertificatePdfUploadScreen
