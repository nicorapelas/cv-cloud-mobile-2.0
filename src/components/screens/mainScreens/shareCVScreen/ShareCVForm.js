import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import { useKeyboard } from '@react-native-community/hooks'
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons'
import uuid from 'uuid/v4'

import FormHintModal from '../../../common/modals/FormHintModal'
import validateEmailInput from '../../../../validation/email'
import FormCancelButton from '../../../common/FormCancelButton'
import LoaderFullScreen from '../../../common/LoaderFullScreen'
import { Context as ShareCVContext } from '../../../../context/ShareCVContext'
import { Context as PhotoContext } from '../../../../context/PhotoContext'
import { Context as PersonalInfoContext } from '../../../../context/PersonalInfoContext'
import { Context as UniversalContext } from '../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../context/NavContext'
import ngrokApi from '../../../../api/ngrok'

const ShareCVForm = () => {
  const [subject, setSubject] = useState(
    'CV Application - Professional Opportunity'
  )
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(null)
  const [sentMessage, setSentMessage] = useState(false)

  const [subjectInpuShow, setSubjectInputShow] = useState(true)
  const [messageInputShow, setMessageInputShow] = useState(false)
  const [recipientInputShow, setRecipientInputShow] = useState(false)
  const [sendButtonShow, setSendButtonShow] = useState(false)
  const [includePhotoInputShow, setIncludePhotoInputShow] = useState(false)
  const [includePhoto, setIncludePhoto] = useState(false)
  const [recipientArray, setRecipientsArray] = useState([])

  const {
    state: { curriculumVitaeID },
    fetchCV_ID,
    toggleHideNavLinks,
  } = useContext(UniversalContext)

  const {
    state: { assignedPhotoUrl, assignedPhotoId, photos },
    fetchAssignedPhoto,
  } = useContext(PhotoContext)

  const {
    state: { personalInfo },
    fetchPersonalInfo,
  } = useContext(PersonalInfoContext)

  const {
    state: { error, loading },
    createShareCV,
    clearShareCVErrors,
    addError,
  } = useContext(ShareCVContext)

  const { setNavTabSelected, setCVBitScreenSelected } = useContext(NavContext)

  useEffect(() => {
    // Always fetch fresh data when form opens to ensure we have the latest assigned photo
    fetchAssignedPhoto()
    fetchCV_ID()
    fetchPersonalInfo()
  }, [])

  // Update subject line and message when personal info loads
  useEffect(() => {
    if (personalInfo && personalInfo.length > 0 && personalInfo[0]?.fullName) {
      const fullName = personalInfo[0].fullName
      const defaultMessage = `Dear Hiring Manager,

I am writing to express my interest in potential opportunities within your organization. Please find my CV attached for your review.

I would welcome the opportunity to discuss how my skills and experience could contribute to your team.

Thank you for your consideration.

Best regards,
${fullName}`

      setSubject(`CV Application - ${fullName}`)
      // Only set default message if user hasn't typed anything yet
      setMessage((currentMessage) => {
        // Only set default if message is empty
        return currentMessage === '' ? defaultMessage : currentMessage
      })
    }
  }, [personalInfo])

  useEffect(() => {
    if (!photos || photos.length < 1) {
      setIncludePhoto(false)
    } else {
      setIncludePhoto(true)
    }
  }, [photos])

  useEffect(() => {
    if (sentMessage) {
      const timer = setTimeout(() => {
        setSentMessage(false)
        // Reset to default values (will be updated by personalInfo effect)
        const fullName = personalInfo && personalInfo.length > 0 ? personalInfo[0]?.fullName || '' : ''
        setSubject(
          fullName
            ? `CV Application - ${fullName}`
            : 'CV Application - Professional Opportunity'
        )
        if (fullName) {
          const defaultMessage = `Dear Hiring Manager,

I am writing to express my interest in potential opportunities within your organization. Please find my CV attached for your review.

I would welcome the opportunity to discuss how my skills and experience could contribute to your team.

Thank you for your consideration.

Best regards,
${fullName}`
          setMessage(defaultMessage)
        } else {
          setMessage('')
        }
        setEmail(null)
        setCVBitScreenSelected('')
        setNavTabSelected('dashboard')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [sentMessage, personalInfo])

  const keyboard = useKeyboard()

  const errorHeading = () => {
    if (error === null || sentMessage) return null
    return (
      <View style={styles.errorHeadingBed}>
        <Text style={styles.errorHeadingText}>please attend to errors</Text>
      </View>
    )
  }

  const renderSentMessage = () => {
    if (sentMessage === false) return null
    return (
      <View style={styles.sentMessageBed}>
        <View style={styles.sentMessageContainer}>
          <View style={styles.sentMessageTextBed}>
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.sentMessageTextIos
                  : styles.sentMessageTextAndroid
              }
            >
              your CV has been sent
            </Text>
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.sentMessageTextIos
                  : styles.sentMessageTextAndroid
              }
            >
              good luck
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setSentMessage(false)
              // Reset to default values
              const fullName = personalInfo && personalInfo.length > 0 ? personalInfo[0]?.fullName || '' : ''
              setSubject(
                fullName
                  ? `CV Application - ${fullName}`
                  : 'CV Application - Professional Opportunity'
              )
              if (fullName) {
                const defaultMessage = `Dear Hiring Manager,

I am writing to express my interest in potential opportunities within your organization. Please find my CV attached for your review.

I would welcome the opportunity to discuss how my skills and experience could contribute to your team.

Thank you for your consideration.

Best regards,
${fullName}`
                setMessage(defaultMessage)
              } else {
                setMessage('')
              }
              setEmail(null)
              setCVBitScreenSelected('')
              setNavTabSelected('dashboard')
            }}
            style={styles.sentMessageButton}
          >
            <MaterialIcons name="check-circle" style={styles.sentMessageIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const subjectInputNext = () => {
    if (!subject || !subject.replace(/\s/g, '').length) {
      addError({ subject: `'Subject' is required` })
      Keyboard.dismiss()
    } else {
      setSubjectInputShow(false)
      setMessageInputShow(true)
    }
  }

  const subjectInput = () => {
    if (!subjectInpuShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Email subject line</Text>
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder="subject"
          value={subject}
          onChangeText={setSubject}
          onFocus={clearShareCVErrors}
          autoFocus={!error ? true : false}
          autoCorrect={true}
          autoCapitalize="sentences"
        />
        {error === null ? null : (
          <>
            {error.subject ? (
              <Text style={styles.error}>{error.subject}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <FormCancelButton route="dashboard" />
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => subjectInputNext()}
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
        <View style={styles.hintModalBed}>
          {sendButtonShow ? null : <FormHintModal bit="shareCVSubject" />}
        </View>
      </View>
    )
  }

  const messagetInputNext = () => {
    if (!message || !message.replace(/\s/g, '').length) {
      addError({ message: `'Message' is required` })
      Keyboard.dismiss()
    } else {
      if (!assignedPhotoId) {
        setMessageInputShow(false)
        setRecipientInputShow(true)
      } else {
        setMessageInputShow(false)
        setIncludePhotoInputShow(true)
      }
    }
  }

  const messageInput = () => {
    if (!messageInputShow) return null
    return (
      <View>
        <Text style={styles.inputHeader}>Message</Text>
        <TextInput
          style={styles.inputTextArea}
          multiline={true}
          numberOfLines={50}
          placeholder="message"
          value={message}
          onFocus={clearShareCVErrors}
          onChangeText={setMessage}
          autoFocus={!error ? true : false}
          autoCorrect={true}
          autoCapitalize="sentences"
        />
        {error === null ? null : (
          <>
            {error.message ? (
              <Text style={styles.error}>{error.message}</Text>
            ) : null}
          </>
        )}
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setMessageInputShow(false)
              setSubjectInputShow(true)
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
            onPress={() => messagetInputNext()}
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
        <View style={styles.hintModalBed}>
          {sendButtonShow ? null : <FormHintModal bit="shareCVMessage" />}
        </View>
      </View>
    )
  }

  const addRecipient = () => {
    const { errors, isValid } = validateEmailInput(email)
    if (!email || !email.replace(/\s/g, '').length) {
      return null
    }
    if (!isValid) {
      addError({ email: errors.email })
      Keyboard.dismiss()
    } else {
      const queryUnique = recipientArray.filter((rec) => {
        return rec.email === email
      })
      if (queryUnique.length !== 0) {
        return null
      } else {
        return setRecipientsArray([...recipientArray, { email, key: uuid() }])
      }
    }
  }

  const removeArrayItem = (key) => {
    const newArray = recipientArray.filter((rec) => rec.key !== key)
    setRecipientsArray(newArray)
  }

  const recipientInputNext = () => {
    if (!recipientArray || recipientArray.length < 1) {
      addError({ recipient: `'Recipients email address' is required` })
      Keyboard.dismiss()
    } else {
      setRecipientInputShow(false)
      setSendButtonShow(true)
    }
  }

  const recipientInputBack = () => {
    if (!assignedPhotoId) {
      setRecipientInputShow(false)
      setMessageInputShow(true)
    } else {
      setRecipientInputShow(false)
      setIncludePhotoInputShow(true)
    }
  }

  const recipientInput = () => {
    if (!recipientInputShow) return null
    return (
      <View>
        {renderRecipientsArray()}
        {!recipientArray || recipientArray.length < 1 ? (
          <Text style={styles.inputHeader}>Recipient email address</Text>
        ) : null}
        <TextInput
          style={styles.inputRecipient}
          onSubmitEditing={() => {
            addRecipient()
            setEmail(null)
          }}
          returnKeyLabel="add"
          blurOnSubmit={false}
          keyboardType="email-address"
          textAlign="center"
          placeholder="recipients email address"
          value={email}
          autoFocus={!error ? true : false}
          onChangeText={setEmail}
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={() => clearShareCVErrors()}
        />
        {error === null ? null : (
          <>
            {error.recipient ? (
              <Text style={styles.error}>{error.recipient}</Text>
            ) : null}
          </>
        )}
        {error === null ? null : (
          <>
            {error.email ? (
              <Text style={styles.error}>{error.email}</Text>
            ) : null}
          </>
        )}
        {!keyboard.keyboardShown ? (
          <View style={styles.nextBackButtonsBed}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => recipientInputBack()}
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
            {!recipientArray || recipientArray.length < 1 ? null : (
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => recipientInputNext()}
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
            )}
          </View>
        ) : (
          <View style={styles.nextBackButtonsBed}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => {
                addRecipient()
                setEmail(null)
                Keyboard.dismiss()
              }}
            >
              <MaterialIcons name="check-circle" style={styles.addButtonIcon} />
              <Text
                style={
                  Platform.OS === 'ios'
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
                addRecipient()
                setEmail(null)
              }}
            >
              <AntDesign name="plus" style={styles.addButtonIcon} />
              <Text
                style={
                  Platform.OS === 'ios'
                    ? styles.addButtonTextIos
                    : styles.addButtonText
                }
              >
                add
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  const renderRecipientsArray = () => {
    if (!recipientArray || recipientArray.length < 1) return null
    return recipientArray.map((rec) => {
      return (
        <View style={styles.itemListBed} key={rec.key}>
          <Text style={styles.itemList}>{rec.email}</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <MaterialCommunityIcons
              style={styles.deleteButtonIcon}
              name="delete"
              onPress={() => removeArrayItem(rec.key)}
            />
          </TouchableOpacity>
        </View>
      )
    })
  }

  const renderPreview = () => {
    if (!sendButtonShow) return null
    return (
      <View>
        <View style={styles.previewBed}>
          {!includePhoto ? null : (
            <Image
              style={styles.previewPhoto}
              source={{
                uri: assignedPhotoUrl,
              }}
            />
          )}
          {!subject ? null : (
            <View>
              <Text style={styles.previewLabel}>Subject</Text>
              <Text style={styles.previewText}>{subject}</Text>
            </View>
          )}
          {!message ? null : (
            <View>
              <Text style={styles.previewLabel}>Message</Text>
              <Text style={styles.previewText}>{message}</Text>
            </View>
          )}
          <View>
            <Text style={styles.previewLabel}>Recipients</Text>
            {recipientArray.map((rec) => {
              return (
                <Text key={rec.key} style={styles.previewText}>
                  {rec.email}
                </Text>
              )
            })}
          </View>
        </View>
        {sendButton()}
      </View>
    )
  }

  const includePhotoInput = () => {
    if (!includePhotoInputShow) return null
    return (
      <View>
        {!includePhoto ? null : (
          <Image
            style={styles.photo}
            source={{
              uri: assignedPhotoUrl,
            }}
          />
        )}
        <View style={styles.checkBed}>
          <CheckBox
            onPress={() => setIncludePhoto(!includePhoto)}
            title="Include photo in message"
            iconRight
            checked={includePhoto}
            textStyle={styles.checkText}
            containerStyle={styles.checkBed}
          />
        </View>
        <View style={styles.nextBackButtonsBed}>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setIncludePhotoInputShow(false)
              setMessageInputShow(true)
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
              setIncludePhotoInputShow(false)
              setRecipientInputShow(true)
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

  const sendButton = () => {
    return (
      <View style={styles.nextBackButtonsBed}>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            setSendButtonShow(false)
            setRecipientInputShow(true)
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
          style={styles.shareButtonContainer}
          onPress={async () => {
            toggleHideNavLinks(true)
            // Fetch the latest assigned photo directly from API to ensure we have the most current one
            let currentAssignedPhotoUrl = assignedPhotoUrl
            try {
              const photoResponse = await ngrokApi.get('/api/photo/assigned')
              // The API returns the photoUrl string directly, not an object
              // It can also return 'noneAssigned' if no photo is assigned
              if (photoResponse.data && 
                  typeof photoResponse.data === 'string' && 
                  photoResponse.data.trim() !== '' && 
                  photoResponse.data !== 'noneAssigned') {
                currentAssignedPhotoUrl = photoResponse.data
                console.log('✅ Using latest assigned photo from API:', currentAssignedPhotoUrl)
              } else {
                console.log('⚠️ No valid assigned photo from API, using context value')
              }
            } catch (error) {
              // If fetch fails, use the photo from context
              console.log('❌ Could not fetch latest assigned photo, using context value:', error.message)
            }
            
            console.log('📤 Sharing CV with assignedPhotoUrl:', currentAssignedPhotoUrl)
            
            const formValues = {
              curriculumVitaeID,
              subject,
              assignedPhotoUrl: currentAssignedPhotoUrl,
              message,
              recipients: recipientArray,
            }
            createShareCV(formValues, () => {
              setSentMessage(true)
              // Reset to default values
              const fullName = personalInfo && personalInfo.length > 0 ? personalInfo[0]?.fullName || '' : ''
              setSubject(
                fullName
                  ? `CV Application - ${fullName}`
                  : 'CV Application - Professional Opportunity'
              )
              if (fullName) {
                const defaultMessage = `Dear Hiring Manager,

I am writing to express my interest in potential opportunities within your organization. Please find my CV attached for your review.

I would welcome the opportunity to discuss how my skills and experience could contribute to your team.

Thank you for your consideration.

Best regards,
${fullName}`
                setMessage(defaultMessage)
              } else {
                setMessage('')
              }
              setEmail(null)
              toggleHideNavLinks(false)
            })
          }}
        >
          <MaterialCommunityIcons style={styles.shareButtonIcon} name="send" />
          <Text
            style={
              Platform.OS === 'ios'
                ? styles.shareButtonTextIos
                : styles.shareButtonText
            }
          >
            send CV
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderForm = () => {
    if (sentMessage) return null
    return (
      <>
        {subjectInput()}
        {messageInput()}
        {includePhotoInput()}
        {recipientInput()}
        {renderPreview()}
      </>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <LoaderFullScreen />
    }
    return (
      <KeyboardAvoidingView
        style={
          Platform.OS === 'ios' && keyboard.keyboardShown === false
            ? styles.bedIos
            : styles.bedAndroid
        }
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderSentMessage()}
        {errorHeading()}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="always"
        >
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
  cancelButton: {
    flexDirection: 'row',
    margin: 20,
  },
  cancelButtonIconIos: {
    color: '#F9B321',
    paddingRight: 5,
    fontSize: 18,
  },
  cancelButtonIcon: {
    color: '#F9B321',
    paddingRight: 5,
    paddingTop: 2,
    fontSize: 18,
  },
  cancelButtonText: {
    color: '#F9B321',
    fontSize: 16,
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
  headerMessagebed: {
    paddingBottom: 20,
  },
  headerMessageText: {
    color: '#ffff',
    paddingHorizontal: 40,
    paddingTop: 5,
    textAlign: 'center',
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
  recipientInstuction: {
    color: '#F9B321',
    width: '75%',
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 10,
  },
  inputRecipient: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    textAlign: 'center',
    borderRadius: 7,
    margin: 5,
  },
  photo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 7,
  },
  previewPhoto: {
    width: 75,
    height: 75,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 7,
  },
  checkBed: {
    backgroundColor: '#232936',
    borderColor: '#232936',
    alignSelf: 'center',
  },
  checkText: {
    color: '#ffff',
  },
  errorHeadingBed: {
    backgroundColor: '#ffcfd8',
    borderColor: '#ff0033',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    width: '85%',
    marginTop: 10,
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
  hintModalBed: {
    paddingBottom: 10,
  },
  nextBackButtonsBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 15,
  },
  nextButtonIcon: {
    color: '#ffff',
    fontSize: 18,
    paddingLeft: 5,
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
    paddingBottom: 4,
  },
  shareButtonContainer: {
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    width: 120,
    height: 40,
    marginHorizontal: 5,
  },
  shareButtonIcon: {
    color: '#ffff',
    fontSize: 22,
    paddingRight: 5,
  },
  shareButtonTextIos: {
    color: '#ffff',
    fontSize: 18,
  },
  shareButtonText: {
    color: '#ffff',
    fontSize: 18,
    marginBottom: 4,
  },
  sentMessageBed: {
    width: '95%',
    justifyContent: 'center',
  },
  sentMessageContainer: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sentMessageTextBed: {
    paddingBottom: 20,
  },
  sentMessageTextIos: {
    color: '#ffff',
    fontSize: 24,
    fontWeight: '100',
    textAlign: 'center',
  },
  sentMessageTextAndroid: {
    color: '#ffff',
    fontFamily: 'sourceSansProLight',
    fontSize: 24,
    fontWeight: '100',
    textAlign: 'center',
  },
  sentMessageButton: {
    alignSelf: 'center',
  },
  sentMessageIcon: {
    color: '#ffff',
    fontSize: 40,
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

export default ShareCVForm
