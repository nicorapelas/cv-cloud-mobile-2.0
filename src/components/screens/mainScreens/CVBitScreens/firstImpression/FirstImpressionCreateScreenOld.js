import React, { useState, useEffect, useContext } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import { Audio } from 'expo-audio'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

import { Context as FirstImpressionContext } from '../../../../../context/FirstImpressionContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
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
  const [cameraRef, setCameraRef] = useState(null)
  const [type, setType] = useState(CameraType.back)
  const [view, setView] = useState('record')

  const {
    state: { videoObject, videoDemoShow },
    addVideoObject,
  } = useContext(FirstImpressionContext)

  const { toggleInstructionModal } = useContext(UniversalContext)

  console.log('Camera:', Camera)
  console.log('CameraType:', CameraType)

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
      cameraRef.stopRecording()
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
    const { status } = await Camera.requestCameraPermissionsAsync()
    setCameraPermission(status === 'granted')
    if (status === 'granted') {
      setType(CameraType.back) // Set type only after permissions are granted
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
          <Text>.</Text>
        </View>
      )
    if (cameraPermission === false) return <FirstImpressionPermissions />
    if (audioPermission === false && Platform.OS === 'android')
      return <FirstImpressionPermissions />
  }

  const openCamera = () => {
    if (view === 'record' && type) {
      // Ensure type is not null before rendering Camera
      return (
        <View style={styles.videoRecorderBed}>
          <Camera
            VideoQuality="480p"
            style={styles.cameraBed}
            type={type}
            ref={(ref) => setCameraRef(ref)}
          >
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
                      setType(
                        type === CameraType.back
                          ? CameraType.front
                          : CameraType.back
                      )
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
                      let video = await cameraRef.recordAsync()
                      addVideoObject(video)
                    } else {
                      setRecording(false)
                      setRunTimer(false)
                      setTime(30)
                      cameraRef.stopRecording()
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
          </Camera>
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
      // Check permissions first
      const permissionCheck = runCameraPermissions()
      if (permissionCheck) {
        return permissionCheck
      }
      return <VideoSample />
    }
    return (
      <>
        <InstructionModal bit="firstImpression" />
        {playbackAndUpload()}
        {openCamera()}
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
    flex: 1,
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
})

export default FirstImpressionCreateScreen
