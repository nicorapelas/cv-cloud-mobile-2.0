import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { VideoView, useVideoPlayer } from 'expo-video'
import * as FileSystemLegacy from 'expo-file-system/legacy'
import keys from '../../../../../../../config/keys'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import { Context as FirstImpressionContext } from '../../../../../../context/FirstImpressionContext'
import { Context as NavContext } from '../../../../../../context/NavContext'

const VideoPlaybackUpload = ({ videoObject }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoFileName, setVideoFileName] = useState(null)
  const [loaderSubText, setLoaderSubText] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [videoFileSizeBytes, setVideoFileSizeBytes] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({
    percent: 0,
    bytesSent: 0,
    bytesTotal: 0,
  })

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
        setLoaderSubText((prev) => prev + 1)
      }, 40000)
      return () => clearTimeout(t)
    }
  }, [videoUploading, loaderSubText])

  const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return null
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const uploadToCloudinaryWithProgress = async ({
    url,
    formData,
    timeoutMs,
    onProgress,
  }) => {
    // Prefer Expo's native upload task from the LEGACY API.
    // In Expo SDK 54+, legacy methods imported from "expo-file-system" throw at runtime.
    // Using `expo-file-system/legacy` avoids the iOS XHR onprogress limitation (0% forever).
    // Fall back to XHR if unavailable or if task upload fails to start.
    const canUseUploadTask =
      typeof FileSystemLegacy?.createUploadTask === 'function' &&
      FileSystemLegacy?.FileSystemUploadType?.MULTIPART &&
      FileSystemLegacy?.FileSystemSessionType?.FOREGROUND

    if (canUseUploadTask) {
      // We expect `formData` to be a React Native FormData instance whose _parts we can read.
      // We'll convert it to Expo FileSystem multipart parameters + a fileUri.
      try {
        const parts = Array.isArray(formData?._parts) ? formData._parts : []
        let fileUri = null
        let mimeType = null
        const parameters = {}

        for (const part of parts) {
          const key = part?.[0]
          const value = part?.[1]
          if (!key) continue

          if (key === 'file' && value && typeof value === 'object') {
            // value: { uri, type, name }
            if (typeof value.uri === 'string') fileUri = value.uri
            if (typeof value.type === 'string') mimeType = value.type
          } else if (value === null || value === undefined) {
            // skip
          } else {
            // FileSystem multipart parameters must be string values
            parameters[key] = String(value)
          }
        }

        if (typeof fileUri === 'string' && fileUri.length > 0) {
          const uploadTask = FileSystemLegacy.createUploadTask(
            url,
            fileUri,
            {
              httpMethod: 'POST',
              uploadType: FileSystemLegacy.FileSystemUploadType.MULTIPART,
              fieldName: 'file',
              parameters,
              // Ensure progress events fire while app is active (best UX for an in-app progress bar).
              sessionType: FileSystemLegacy.FileSystemSessionType.FOREGROUND,
              ...(mimeType ? { mimeType } : {}),
            },
            (progress) => {
              try {
                if (!onProgress) return
                const loaded = progress?.totalBytesSent ?? 0
                const total = progress?.totalBytesExpectedToSend ?? 0
                // Note: total can be -1 if unknown; treat as not computable and fall back in UI.
                onProgress({
                  loaded,
                  total,
                  lengthComputable: typeof total === 'number' && total > 0,
                })
              } catch (err) {
                // Never fail upload due to progress UI issues
              }
            }
          )

          // Optional timeout: if we can cancel, try to cancel; otherwise just let it run.
          let timeoutId = null
          const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = null
          }

          const uploadPromise = uploadTask.uploadAsync().then((result) => {
            cleanup()
            const status = result?.status ?? 0
            const body = result?.body ?? ''
            if (!status || status < 200 || status >= 300) {
              throw new Error(
                `Upload failed: ${status} ${result?.headers?.statusText || ''}`.trim()
              )
            }
            try {
              return body ? JSON.parse(body) : null
            } catch (err) {
              throw new Error('Upload succeeded but response could not be parsed')
            }
          })

          if (timeoutMs && timeoutMs > 0) {
            timeoutId = setTimeout(async () => {
              try {
                // cancelAsync exists on some SDKs/runtimes; guard it.
                if (typeof uploadTask?.cancelAsync === 'function') {
                  await uploadTask.cancelAsync()
                }
              } catch (err) {
                // ignore
              }
            }, timeoutMs)
          }

          return await uploadPromise
        }
      } catch (err) {
        // Fall back to XHR below
      }
    }

    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      let timeoutId = null

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = null
      }

      try {
        xhr.open('POST', url)
      } catch (err) {
        cleanup()
        reject(err)
        return
      }

      // Upload progress (byte-level)
      if (xhr.upload) {
        xhr.upload.onprogress = (event) => {
          try {
            if (!onProgress) return
            const loaded = event?.loaded ?? 0
            const total = event?.total ?? 0
            const lengthComputable = !!event?.lengthComputable
            onProgress({ loaded, total, lengthComputable })
          } catch (err) {
            // Never fail upload due to progress UI issues
          }
        }
      }

      xhr.onerror = () => {
        cleanup()
        reject(new Error('Network request failed'))
      }

      xhr.onabort = () => {
        cleanup()
        const err = new Error('Upload aborted')
        err.name = 'AbortError'
        reject(err)
      }

      xhr.onload = () => {
        cleanup()
        const status = xhr.status
        const responseText = xhr.responseText

        if (!status || status < 200 || status >= 300) {
          reject(new Error(`Upload failed: ${status} ${xhr.statusText || ''}`.trim()))
          return
        }

        try {
          const parsed = responseText ? JSON.parse(responseText) : null
          resolve(parsed)
        } catch (err) {
          reject(new Error('Upload succeeded but response could not be parsed'))
        }
      }

      // Manual timeout (XHR timeout is inconsistent across RN runtimes)
      timeoutId = setTimeout(() => {
        try {
          xhr.abort()
        } catch (err) {
          // ignore
        }
      }, timeoutMs)

      try {
        xhr.send(formData)
      } catch (err) {
        cleanup()
        reject(err)
      }
    })
  }

  const videoUpload = async () => {
    console.log('[Video Upload] ===== UPLOAD FUNCTION CALLED =====')
    const {
      apiKey,
      signature,
      timestamp,
      uploadPreset,
      eager,
      eagerAsync,
      folder,
    } = uploadSignature

    console.log('[Video Upload] Upload signature received:')
    console.log('[Video Upload] - Has apiKey:', !!apiKey)
    console.log('[Video Upload] - Has signature:', !!signature)
    console.log('[Video Upload] - Timestamp:', timestamp)
    console.log('[Video Upload] - Upload preset:', uploadPreset || 'none (using eager)')
    console.log('[Video Upload] - Eager:', eager || 'none')
    console.log('[Video Upload] - Eager async:', eagerAsync || false)
    console.log('[Video Upload] - Folder:', folder || 'none')

    try {
      // Reset progress UI each upload
      setUploadProgress({ percent: 0, bytesSent: 0, bytesTotal: 0 })
      setUploadComplete(false)

      let videoUri = videoObject.uri
      let videoType = 'video/mp4' // Default to mp4
      let localFileSizeBytes = null

      // On Android, we need to handle the file URI properly
      if (Platform.OS === 'android') {
        // Get file info to determine proper type
        const fileInfo = await FileSystemLegacy.getInfoAsync(videoUri)

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

      // Verify file URI is accessible before upload
      let finalVideoUri = Platform.OS === 'android' ? videoUri : videoObject.uri
      console.log('[Video Upload] Verifying file accessibility...')
      console.log('[Video Upload] Original video URI:', finalVideoUri)
      
      // On Android, ensure the URI is in the correct format
      if (Platform.OS === 'android') {
        // If URI doesn't start with file://, try to normalize it
        if (!finalVideoUri.startsWith('file://') && !finalVideoUri.startsWith('content://')) {
          // Try adding file:// prefix
          if (finalVideoUri.startsWith('/')) {
            finalVideoUri = 'file://' + finalVideoUri
            console.log('[Video Upload] Normalized Android URI to:', finalVideoUri)
          }
        }
      }
      
      console.log('[Video Upload] Final video URI:', finalVideoUri)
      
      try {
        const fileInfo = await FileSystemLegacy.getInfoAsync(finalVideoUri)
          console.log('[Video Upload] File info before upload:', {
            exists: fileInfo.exists,
            size: fileInfo.size,
            isDirectory: fileInfo.isDirectory,
            uri: fileInfo.uri,
          })
          if (!fileInfo.exists) {
            throw new Error('Video file does not exist at the specified URI')
          }
          if (fileInfo.size === 0) {
            throw new Error('Video file is empty (0 bytes)')
          }
        localFileSizeBytes = fileInfo.size
          setVideoFileSizeBytes(fileInfo.size)
          console.log(
            '[Video Upload] File size:',
            (fileInfo.size / (1024 * 1024)).toFixed(2),
            'MB'
          )
      } catch (fileCheckError) {
        console.log('[Video Upload] ❌ ERROR: File check failed:', fileCheckError.message)
        throw new Error('Cannot access video file: ' + fileCheckError.message)
      }

      // Add file last
      const fileData = {
        uri: finalVideoUri,
        type: videoType,
        name: videoFileName,
      }
      console.log('[Video Upload] File data to upload:', {
        uri: fileData.uri,
        type: fileData.type,
        name: fileData.name,
      })
      
      data.append('file', fileData)

      console.log('[Video Upload] Starting upload to Cloudinary...')
      console.log('[Video Upload] Upload URL:', keys.cloudinary.uploadVideoUrl)
      console.log('[Video Upload] FormData entries count:', data._parts?.length || 'unknown')
      console.log('[Video Upload] Video type:', videoType)

      const startTime = Date.now()
      console.log('[Video Upload] Sending upload request (XHR with progress)...')
      
      const responseData = await uploadToCloudinaryWithProgress({
        url: keys.cloudinary.uploadVideoUrl,
        formData: data,
        timeoutMs: 10 * 60 * 1000,
        onProgress: ({ loaded, total, lengthComputable }) => {
          // NOTE:
          // In React Native / Android, `lengthComputable` is often false even when `total` is present.
          // Also, `loaded` can represent multipart request bytes (file + form-data overhead), so it can
          // exceed the raw file size. To avoid "sent > total" we must derive numerator/denominator
          // from the same measurement (prefer XHR totals, fall back to file size).
          const loadedSafe = typeof loaded === 'number' && loaded > 0 ? loaded : 0
          const eventTotalSafe = typeof total === 'number' && total > 0 ? total : 0
          const fileTotalSafe =
            typeof localFileSizeBytes === 'number' && localFileSizeBytes > 0
              ? localFileSizeBytes
              : 0

          setUploadProgress((prev) => {
            const prevTotal =
              typeof prev?.bytesTotal === 'number' && prev.bytesTotal > 0
                ? prev.bytesTotal
                : 0

            // Prefer XHR reported total when available, otherwise fall back to file size.
            const baseTotal =
              eventTotalSafe > 0
                ? Math.max(prevTotal, eventTotalSafe)
                : fileTotalSafe > 0
                  ? Math.max(prevTotal, fileTotalSafe)
                  : prevTotal

            // Final fallback if we have no total yet but do have loaded bytes.
            const bytesTotal = baseTotal > 0 ? baseTotal : loadedSafe

            // Clamp for UI sanity: never show sent > total.
            const bytesSent =
              bytesTotal > 0 ? Math.min(loadedSafe, bytesTotal) : loadedSafe

            const percent =
              bytesTotal > 0
                ? Math.min(
                    99,
                    Math.max(0, Math.floor((bytesSent / bytesTotal) * 100))
                  )
                : 0

            return {
              percent,
              bytesSent,
              bytesTotal,
            }
          })
        },
      })

      const uploadDuration = ((Date.now() - startTime) / 1000).toFixed(2)
      console.log('[Video Upload] Upload completed in', uploadDuration, 'seconds')
      setUploadProgress((prev) => ({
        ...prev,
        percent: 100,
        // Keep the final "sent / total" display consistent.
        bytesSent:
          typeof prev?.bytesTotal === 'number' && prev.bytesTotal > 0
            ? prev.bytesTotal
            : prev?.bytesSent ?? 0,
      }))
      console.log('[Video Upload] Cloudinary response received:')
      console.log('[Video Upload] - Has secure_url:', !!responseData.secure_url)
      console.log('[Video Upload] - Has public_id:', !!responseData.public_id)
      console.log('[Video Upload] - Has eager:', !!responseData.eager)
      console.log('[Video Upload] - Eager count:', responseData.eager?.length || 0)

      if (responseData) setVideoUploading(false)

      if (responseData.error) {
        console.log('[Video Upload] ❌ ERROR: Cloudinary returned error')
        console.log('[Video Upload] Error details:', JSON.stringify(responseData.error))
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
      console.log('[Video Upload] Initial video URL:', videoUrl)

      // For large videos: use eager transformation URL (if available)
      if (responseData.eager && responseData.eager.length > 0) {
        const eagerItem = responseData.eager[0]
        console.log('[Video Upload] Eager transformation found:')
        console.log('[Video Upload] - Status:', eagerItem.status)
        console.log('[Video Upload] - Secure URL:', eagerItem.secure_url)
        // Use secure_url from eager item (includes version and .mov extension)
        // Cloudinary provides this URL even when status is "processing"
        videoUrl = eagerItem.secure_url || eagerItem.url
        console.log('[Video Upload] Using eager transformation URL:', videoUrl)
      } else {
        console.log('[Video Upload] No eager transformation, using original URL')
      }

      console.log('[Video Upload] Final video URL:', videoUrl)
      console.log('[Video Upload] Creating first impression record...')
      createFirstImpression(
        {
          videoUrl: videoUrl,
          publicId: responseData.public_id,
        },
        () => {
          console.log('[Video Upload] ✅ First impression created successfully')
          console.log('[Video Upload] ===== UPLOAD COMPLETE =====')
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
      console.log('[Video Upload] ❌ ERROR: Exception during upload')
      console.log('[Video Upload] Error name:', err.name)
      console.log('[Video Upload] Error message:', err.message)
      console.log('[Video Upload] Error stack:', err.stack)
      console.log('[Video Upload] Error type:', typeof err)
      console.log('[Video Upload] Error keys:', Object.keys(err))
      
      // Check if it's a timeout/abort error
      if (err.name === 'AbortError' || err.message.includes('timeout')) {
        console.log('[Video Upload] Timeout error detected')
        Alert.alert(
          'Upload timeout',
          'The video upload took too long. Please check your internet connection and try again with a shorter video or better network connection.'
        )
      } else if (err.message.includes('Network') || err.message.includes('network')) {
        console.log('[Video Upload] Network error detected')
        Alert.alert(
          'Network error',
          err.message || 'Please check your internet connection and try again. If the video is very large, try recording a shorter video.'
        )
      } else if (err.message.includes('file') || err.message.includes('File')) {
        console.log('[Video Upload] File access error detected')
        Alert.alert(
          'File error',
          err.message || 'There was a problem accessing the video file. Please try recording again.'
        )
      } else {
        console.log('[Video Upload] Other error detected')
        Alert.alert(
          'Unable to upload video',
          err.message || 'Please check your internet connection and try again'
        )
      }
      
      setVideoUploading(false)
      clearVideoObject()
      setLoaderSubText(0)
      clearUploadSignature()
      setCVBitScreenSelected('')
      console.log('[Video Upload] ===== UPLOAD FAILED =====')
    }
  }

  const renderLoaderSubText = () => {
    if (loaderSubText === 0)
      return 'this may take 2 minutes or so depending on the speed of your network connection'
    if (loaderSubText === 1) return 'still uploading video, please be patient'
    if (loaderSubText > 1)
      return 'slow network detected... please be patient, almost done'
  }

  const renderUploadProgress = () => {
    const pct = uploadProgress?.percent ?? 0
    const sent = uploadProgress?.bytesSent ?? 0
    const total = uploadProgress?.bytesTotal ?? 0

    const sentText = formatBytes(sent)
    const totalText = formatBytes(total || videoFileSizeBytes)
    const fileSizeText = formatBytes(videoFileSizeBytes)
    const mainStatusText = pct >= 99 && pct < 100 ? 'Verifying upload' : 'uploading video'

    return (
      <View style={styles.uploadProgressBed}>
        <ActivityIndicator size="small" color="#ededed" />
        <Text style={styles.uploadMainText}>{mainStatusText}</Text>
        <Text style={styles.uploadSubText}>{renderLoaderSubText()}</Text>

        <View style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarInner,
              { width: `${Math.max(0, Math.min(100, pct))}%` },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {pct}%{sentText ? ` • ${sentText}` : ''}{totalText ? ` / ${totalText}` : ''}
        </Text>
        {fileSizeText ? (
          <Text style={styles.progressMetaText}>file size: {fileSizeText}</Text>
        ) : null}
      </View>
    )
  }

  const renderContent = () => {
    if (!videoObject) return null
    if (videoUploading)
      return renderUploadProgress()
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

              console.log('[Video Upload] ===== UPLOAD INITIATED =====')
              console.log('[Video Upload] Platform:', Platform.OS)
              console.log('[Video Upload] Video URI:', videoObject?.uri)
              console.log('[Video Upload] Video file name:', videoFileName)

              if (Platform.OS === 'android' && videoObject?.uri) {
                try {
                  console.log('[Video Upload] Checking file size on Android...')
                  const fileInfo = await FileSystemLegacy.getInfoAsync(
                    videoObject.uri
                  )
                  console.log('[Video Upload] File info:', JSON.stringify(fileInfo))
                  
                  if (fileInfo?.size) {
                    console.log('[Video Upload] File size:', fileInfo.size, 'bytes (', (fileInfo.size / (1024 * 1024)).toFixed(2), 'MB)')
                    console.log('[Video Upload] Threshold:', LARGE_VIDEO_THRESHOLD, 'bytes (10MB)')
                    
                    if (fileInfo.size > LARGE_VIDEO_THRESHOLD) {
                      useEagerAsync = true
                      console.log('[Video Upload] ✅ Large video detected - will use eager async transformation')
                    } else {
                      console.log('[Video Upload] ✅ Small video detected - will use preset transformation')
                    }
                  } else {
                    console.log('[Video Upload] ⚠️  WARNING: File size not available, defaulting to small video strategy')
                  }
                } catch (error) {
                  console.log('[Video Upload] ❌ ERROR: Failed to check file size:', error.message)
                  console.log('[Video Upload] ⚠️  WARNING: Defaulting to small video strategy due to error')
                  // Default to small video strategy if size check fails
                }
              } else if (Platform.OS === 'ios') {
                console.log('[Video Upload] iOS platform - skipping file size check (will use small video strategy)')
              } else {
                console.log('[Video Upload] Unknown platform - defaulting to small video strategy')
              }

              console.log('[Video Upload] Upload strategy:', useEagerAsync ? 'LARGE (eager async)' : 'SMALL (preset)')
              console.log('[Video Upload] Requesting upload signature...')
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
  uploadProgressBed: {
    backgroundColor: '#232936',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 22,
  },
  uploadMainText: {
    color: '#278ACD',
    fontSize: 18,
    marginTop: 12,
    alignSelf: 'center',
  },
  uploadSubText: {
    width: '85%',
    color: '#278ACD',
    fontSize: 15,
    marginTop: 13,
    alignSelf: 'center',
    textAlign: 'center',
  },
  progressBarOuter: {
    height: 10,
    width: '100%',
    marginTop: 18,
    borderRadius: 8,
    backgroundColor: '#1a1f2a',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#278ACD',
    borderRadius: 8,
  },
  progressText: {
    marginTop: 10,
    color: '#ededed',
    alignSelf: 'center',
    fontSize: 13,
  },
  progressMetaText: {
    marginTop: 6,
    color: 'rgba(237,237,237,0.75)',
    alignSelf: 'center',
    fontSize: 12,
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
