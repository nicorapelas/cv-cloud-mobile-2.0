import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { VideoView, useVideoPlayer } from 'expo-video'
import * as FileSystem from 'expo-file-system/legacy'
import keys from '../../../../../../../config/keys'

import LoaderWithText from '../../../../../common/LoaderWithText'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import { Context as FirstImpressionContext } from '../../../../../../context/FirstImpressionContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const VideoPlaybackUpload = ({ videoObject }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoFileName, setVideoFileName] = useState(null)
  const [loaderSubText, setLoaderSubText] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  const {
    state: { loading, uploadSignature, videoUploading },
    clearVideoObject,
    createFirstImpression,
    createUploadSignature,
    clearUploadSignature,
    setVideoUploading,
  } = useContext(FirstImpressionContext)

  const { setCVBitScreenSelected, setNavTabSelected } = useContext(NavContext)

  const player = useVideoPlayer(
    videoObject?.uri ? { uri: videoObject.uri } : undefined
  )

  useEffect(() => {
    if (videoObject?.uri) {
      const randomFileName =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString()
      setVideoFileName(`${randomFileName}.${videoObject.uri.split('.')[1]}`)
      if (player) {
        // Check if player is still valid before using it
        try {
          player.replaceAsync({ uri: videoObject.uri }).then(() => {
            if (player) {
              player.loop = true
            }
          }).catch((error) => {
            console.log('Error replacing video:', error)
          })
        } catch (error) {
          console.log('Error accessing player:', error)
        }
      }
    }
    return () => {
      setVideoUploading(false)
      // Cleanup: pause player if it exists
      if (player) {
        try {
          player.pause()
        } catch (error) {
          console.log('Error pausing player on cleanup:', error)
        }
      }
    }
  }, [videoObject?.uri, player])

  useEffect(() => {
    if (!player) return

    let subscription = null
    try {
      subscription = player.addListener('playingChange', (newIsPlaying) => {
        setIsPlaying(newIsPlaying)
      })
    } catch (error) {
      console.log('Error adding player listener:', error)
    }

    return () => {
      if (subscription) {
        try {
          subscription.remove()
        } catch (error) {
          console.log('Error removing player listener:', error)
        }
      }
    }
  }, [player])

  useEffect(() => {
    if (uploadSignature) {
      videoUpload()
      setVideoUploading(true)
    }
  }, [uploadSignature])

  useEffect(() => {
    if (videoUploading) {
      const t = setTimeout(() => {
        setLoaderSubText(loaderSubText + 1)
      }, 40000)
      return () => clearTimeout(t)
    }
  }, [videoUploading])

  const videoUpload = async () => {
    const {
      apiKey,
      signature,
      timestamp,
      uploadPreset,
      eager,
      eagerAsync,
      folder,
    } = uploadSignature

    try {
      let videoUri = videoObject.uri
      let videoType = 'video/mp4' // Default to mp4

      // On Android, we need to handle the file URI properly
      if (Platform.OS === 'android') {
        // Get file info to determine proper type
        const fileInfo = await FileSystem.getInfoAsync(videoUri)

        // Determine video type from URI
        const uriParts = videoUri.split('.')
        const fileExtension = uriParts[uriParts.length - 1].toLowerCase()

        switch (fileExtension) {
          case 'mp4':
            videoType = 'video/mp4'
            break
          case 'mov':
            videoType = 'video/quicktime'
            break
          case '3gp':
            videoType = 'video/3gpp'
            break
          case 'webm':
            videoType = 'video/webm'
            break
          default:
            videoType = 'video/mp4'
        }
      } else {
        // iOS
        const extension = videoObject.uri.split('.').pop()
        videoType = `video/${extension}`
      }

      const data = new FormData()

      // IMPORTANT: Parameters must be in the same order as they appear in the signature
      // For small videos: timestamp, upload_preset
      // For large videos: timestamp, eager, eager_async, folder (NO upload_preset to avoid conflicts)
      // So we send: api_key, timestamp, signature, upload_preset (if small), eager (if large), eager_async (if large), folder (if large), file

      // Add metadata first (important for Cloudinary signature validation)
      data.append('api_key', apiKey)
      data.append('timestamp', timestamp.toString()) // Ensure it's a string
      data.append('signature', signature)

      // For small videos: add upload preset (includes incoming transformation)
      if (uploadPreset) {
        data.append('upload_preset', uploadPreset)
      }

      // For large videos: add eager transformations (NO preset to avoid conflicts)
      if (eager) {
        data.append('eager', eager)
      }
      if (eagerAsync === true) {
        data.append('eager_async', 'true')
      }

      // For large videos: add folder manually (not from preset)
      if (folder) {
        data.append('folder', folder)
      }

      // Add file last
      data.append('file', {
        uri: Platform.OS === 'android' ? videoUri : videoObject.uri,
        type: videoType,
        name: videoFileName,
      })

      const response = await fetch(keys.cloudinary.uploadVideoUrl, {
        method: 'POST',
        body: data,
        // Don't set Content-Type - React Native will set it with boundary automatically
      })

      const responseData = await response.json()

      if (responseData) setVideoUploading(false)

      if (responseData.error) {
        setVideoUploading(false)
        clearVideoObject()
        setLoaderSubText(0)
        clearUploadSignature()
        Alert.alert(
          'Unable to upload video',
          responseData.error.message || 'Please try again later'
        )
        setCVBitScreenSelected('')
        return
      }

      // Determine video URL based on upload strategy
      let videoUrl = responseData.secure_url || responseData.url

      // For large videos: use eager transformation URL (if available)
      if (responseData.eager && responseData.eager.length > 0) {
        const eagerItem = responseData.eager[0]
        // Use secure_url from eager item (includes version and .mov extension)
        // Cloudinary provides this URL even when status is "processing"
        videoUrl = eagerItem.secure_url || eagerItem.url
      }

      createFirstImpression(
        {
          videoUrl: videoUrl,
          publicId: responseData.public_id,
        },
        () => {
          setVideoUploading(false)
          clearVideoObject()
          setLoaderSubText(0)
          clearUploadSignature()
          setUploadComplete(true)
          // Navigate to Dashboard after successful upload
          setCVBitScreenSelected('') // Clear first impression screen
          setNavTabSelected('dashboard') // Navigate to Dashboard
        }
      )
    } catch (err) {
      setVideoUploading(false)
      clearVideoObject()
      setLoaderSubText(0)
      clearUploadSignature()
      Alert.alert(
        'Unable to upload video',
        'Please check your internet connection and try again'
      )
      setCVBitScreenSelected('')
    }
  }

  const renderLoaderSubText = () => {
    if (loaderSubText === 0)
      return 'this may take 2 minutes or so depending on the speed of your network connection'
    if (loaderSubText === 1) return 'still uploading video, please be patient'
    if (loaderSubText > 1)
      return 'slow network detected... please be patient, almost done'
  }

  const renderContent = () => {
    if (!videoObject) return null
    if (videoUploading)
      return (
        <LoaderWithText
          mainText="uploading video"
          subText={renderLoaderSubText()}
        />
      )
    if (loading) return <LoaderFullScreen />
    if (!player) return null
    return (
      <View style={styles.videoBed}>
        <VideoView
          player={player}
          style={styles.video}
          nativeControls
          contentFit="contain"
          fullscreenOptions={{ enterFullscreenButtonVisible: true }}
        />
        <View style={styles.buttonsBed}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (!player) return
              try {
                if (isPlaying) {
                  player.pause()
                } else {
                  player.play()
                }
              } catch (error) {
                console.log('Error controlling player:', error)
              }
            }}
          >
            {isPlaying ? (
              <MaterialIcons
                name="pause-circle"
                style={styles.playButtonIcon}
              />
            ) : (
              <MaterialIcons name="play-circle" style={styles.playButtonIcon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => clearVideoObject()}
          >
            <MaterialCommunityIcons
              name="delete-circle"
              style={styles.deleteButtonIcon}
            />
          </TouchableOpacity>
          {uploadComplete && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setCVBitScreenSelected('')}
            >
              <Text style={styles.doneButtonText}>done</Text>
            </TouchableOpacity>
          )}
        </View>
        {!videoUploading && !uploadComplete && (
          <TouchableOpacity
            onPress={async () => {
              // Pause video when upload starts
              if (player && isPlaying) {
                try {
                  player.pause()
                } catch (error) {
                  console.log('Error pausing player:', error)
                }
              }

              // Check video size to determine upload strategy
              // Large videos need eager transformations with async (can't use incoming transformation)
              const LARGE_VIDEO_THRESHOLD = 10 * 1024 * 1024 // 10MB
              let useEagerAsync = false

              if (Platform.OS === 'android' && videoObject?.uri) {
                try {
                  const fileInfo = await FileSystem.getInfoAsync(
                    videoObject.uri
                  )
                  if (fileInfo?.size) {
                    if (fileInfo.size > LARGE_VIDEO_THRESHOLD) {
                      useEagerAsync = true
                    }
                  }
                } catch (error) {
                  // Error checking file size
                }
              }
              await createUploadSignature(useEagerAsync)
            }}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadButtonText}>upload video</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return renderContent()
}

const styles = StyleSheet.create({
  videoBed: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#232936',
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '60%',
  },
  buttonsBed: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  playButton: {
    paddingRight: 25,
  },
  playButtonIcon: {
    color: '#ffff',
    fontSize: 42,
  },
  deleteButton: {
    paddingLeft: 25,
  },
  deleteButtonIcon: {
    color: 'red',
    fontSize: 42,
  },
  uploadButton: {
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    borderRadius: 7,
    alignSelf: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#ffff',
    padding: 15,
  },
  doneButton: {
    marginLeft: 25,
    borderColor: '#ffff',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  doneButtonText: {
    color: '#ffff',
    fontSize: 14,
  },
})

export default VideoPlaybackUpload
