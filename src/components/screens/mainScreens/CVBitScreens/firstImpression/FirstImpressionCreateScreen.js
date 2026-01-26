import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import { CameraView, Camera } from 'expo-camera'
import { Audio } from 'expo-audio'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as FileSystemLegacy from 'expo-file-system/legacy'

import { Context as FirstImpressionContext } from '../../../../../context/FirstImpressionContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'
import VideoPlaybackUpload from './video/VideoPlaybackUpload'
import InstructionModal from '../../../../common/modals/InstructionModal'
import FirstImpressionPermissions from './FirstImpressionPermissions'
import VideoSample from './video/VideoSample'

const FirstImpressionCreateScreen = () => {
  const [time, setTime] = useState(30)
  const [blink, setBlink] = useState(false)
  const [runTimer, setRunTimer] = useState(false)
  const [recording, setRecording] = useState(false)
  const [cameraPermission, setCameraPermission] = useState(null)
  const [audioPermission, setAudioPermission] = useState(null)
  const [type, setType] = useState('back')
  const [view, setView] = useState('record')

  const cameraRef = useRef(null)

  const {
    state: { videoObject, videoDemoShow },
    addVideoObject,
  } = useContext(FirstImpressionContext)

  const { toggleInstructionModal } = useContext(UniversalContext)
  const { setCVBitScreenSelected } = useContext(NavContext)

  const ensureFirstImpressionRecordingDir = async () => {
    const baseDir = FileSystemLegacy.documentDirectory
    if (!baseDir) return null
    const recordingsDir = `${baseDir}first-impression-recordings/`
    try {
      await FileSystemLegacy.makeDirectoryAsync(recordingsDir, {
        intermediates: true,
      })
    } catch (err) {
      // Directory may already exist; ignore.
    }
    return recordingsDir
  }

  const persistRecordedVideoAsync = async (video) => {
    const sourceUri = video?.uri
    if (!sourceUri || typeof sourceUri !== 'string') return null

    const recordingsDir = await ensureFirstImpressionRecordingDir()
    if (!recordingsDir) return null

    const extension = sourceUri.split('.').pop() || 'mp4'
    const safeExt = extension.toLowerCase()
    const fileName = `first-impression-${Date.now()}.${safeExt}`
    const destUri = `${recordingsDir}${fileName}`

    try {
      // Copy to durable app storage so we can retry uploads after network failures.
      await FileSystemLegacy.copyAsync({ from: sourceUri, to: destUri })
      return destUri
    } catch (err) {
      // If persistence fails, we still return null and keep original URI.
      return null
    }
  }

  useEffect(() => {
    if (!videoObject) setView('record')
    if (videoObject) setView('play')
  }, [videoObject])

  useEffect(() => {
    toggleInstructionModal(true)
    cameraPermissionsRequest()
    if (Platform.OS === 'android') audioPermissionsRequest()
  }, [])

  useEffect(() => {
    timer()
    autoStopRecording()
  }, [time, runTimer])

  useEffect(() => {
    runCameraPermissions()
  }, [cameraPermission, audioPermission])

  const autoStopRecording = () => {
    if (time === 0) {
      setRecording(false)
      setRunTimer(false)
      setTime(30)
      if (cameraRef.current) {
        cameraRef.current.stopRecording()
      }
    }
  }

  const timer = () => {
    if (!runTimer) return null
    setTimeout(() => {
      setTime(time - 1)
      setBlink(!blink)
    }, 1000)
  }

  const cameraPermissionsRequest = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setCameraPermission(status === 'granted')
      if (status === 'granted') {
        setType('back')
      }
    } catch (error) {
      console.error('Camera permission error:', error)
    }
  }

  const audioPermissionsRequest = async () => {
    try {
      // Request microphone permissions for video recording
      const { status } = await Camera.requestMicrophonePermissionsAsync()
        setAudioPermission(status === 'granted')
    } catch (error) {
      console.error('Audio permission error:', error)
      // If permission request fails, default to false so user sees permission screen
      setAudioPermission(false)
    }
  }

  const runCameraPermissions = () => {
    if (cameraPermission === null)
      return (
        <View>
          <Text></Text>
        </View>
      )
    if (cameraPermission === false) return <FirstImpressionPermissions />
    if (audioPermission === false && Platform.OS === 'android')
      return <FirstImpressionPermissions />
  }

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        // Very aggressive settings for Android to reduce file size (similar to iOS ~0.8MB)
        const recordOptions = Platform.OS === 'android' 
          ? {
              quality: '360p', // Lower resolution
              videoBitrate: 800000, // 800 kbps (very low bitrate)
              maxDuration: 30,
            }
          : {
              quality: '480p',
              maxDuration: 30,
            }
        
        console.log('📹 Recording with options:', recordOptions)
        const video = await cameraRef.current.recordAsync(recordOptions)
        // Show the recorded video immediately (fast path)
        addVideoObject(video)

        // Persist it in the background so upload retries won't lose the recording.
        // (Cache URIs can be cleaned by the OS; documentDirectory is durable.)
        const persistedUri = await persistRecordedVideoAsync(video)
        if (persistedUri) {
          addVideoObject({
            ...video,
            // Keep playback URI stable to avoid `expo-video` churn/release issues.
            // We'll use `persistedUri` for uploading + durability.
            uri: video?.uri,
            persistedUri,
            persisted: true,
          })
        }
      } catch (error) {
        console.error('Recording error:', error)
      }
    }
  }

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording()
    }
  }

  const openCamera = () => {
    if (view === 'record' && type) {
      return (
        <View style={styles.videoRecorderBed}>
          <CameraView
            style={styles.cameraBed}
            facing={type}
            ref={cameraRef}
            mode="video"
            video={true}
            audio={true}
          />
          {/* Cancel/Exit button - only show when not recording */}
          {!recording && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCVBitScreenSelected('firstImpression')}
            >
              <Ionicons name="close" style={styles.cancelButtonIcon} />
            </TouchableOpacity>
          )}
          <View style={styles.cameraContainer}>
            {!runTimer ? null : (
              <>
                <MaterialCommunityIcons
                  name="record"
                  style={!blink ? styles.recondDotOff : styles.recondDotOn}
                />
                <Text style={styles.timeText}>{time}</Text>
              </>
            )}
            <View style={styles.buttonsBed}>
              {runTimer ? null : (
                <TouchableOpacity
                  style={styles.cameraSelectButton}
                  onPress={() => {
                    setType(type === 'back' ? 'front' : 'back')
                  }}
                >
                  <Ionicons
                    name="camera-reverse-sharp"
                    style={styles.cameraSelectButtonIcon}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.recordButtonBed}
                onPress={async () => {
                  if (time === 1) return null
                  if (!recording) {
                    setRecording(true)
                    setRunTimer(true)
                    setTime(29)
                    await startRecording()
                  } else {
                    setRecording(false)
                    setRunTimer(false)
                    setTime(30)
                    stopRecording()
                  }
                }}
              >
                <View style={styles.recordButtonOuter}>
                  <View
                    style={
                      recording
                        ? styles.recordButtonInnerActive
                        : styles.recordButtonInner
                    }
                  ></View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
  }

  const playbackAndUpload = () => {
    if (view === 'play') {
      return <VideoPlaybackUpload videoObject={videoObject} />
    }
  }

  const renderContent = () => {
    if (videoDemoShow) {
      return <VideoSample />
    }

    // Check permissions first
    const permissionCheck = runCameraPermissions()
    if (permissionCheck) {
      return permissionCheck
    }

    return (
      <>
        <InstructionModal bit="firstImpression" />
        {view === 'play' ? playbackAndUpload() : openCamera()}
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
  videoRecorderBed: {
    flex: 1,
  },
  cameraBed: {
    flex: 1,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  buttonsBed: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 30,
  },
  cameraSelectButton: {
    alignSelf: 'flex-end',
  },
  cameraSelectButtonIcon: {
    color: '#ffff',
    fontSize: 40,
  },
  recordButtonBed: {
    alignSelf: 'center',
  },
  recordButtonOuter: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: 'red',
    height: 50,
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInnerActive: {
    backgroundColor: 'red',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: 'red',
    height: 40,
    width: 40,
  },
  recordButtonInner: {
    backgroundColor: '#ffff',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#ffff',
    height: 40,
    width: 40,
  },
  timerBed: {
    display: 'flex',
    justifyContent: 'center',
  },
  timeText: {
    color: 'red',
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '900',
    paddingBottom: 20,
  },
  recondDotOn: {
    color: 'red',
    alignSelf: 'center',
    fontSize: 25,
    paddingBottom: 10,
  },
  recondDotOff: {
    color: '#0000',
    alignSelf: 'center',
    fontSize: 25,
    paddingBottom: 10,
  },
  cancelButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cancelButtonIcon: {
    color: '#ffff',
    fontSize: 28,
  },
})

export default FirstImpressionCreateScreen
