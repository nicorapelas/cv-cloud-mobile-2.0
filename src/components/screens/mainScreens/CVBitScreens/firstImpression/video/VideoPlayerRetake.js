import React, { useContext, useEffect, useState, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { VideoView, useVideoPlayer } from 'expo-video'

import DeleteModal from '../../../../../common/modals/DeleteModal'
import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import { Context as FirstImpressionContext } from '../../../../../../context/FirstImpressionContext'
import { Context as UniversalContext } from '../../../../../../context/UniversalContext'

const VideoPlayerRetake = ({ firstImpression }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef(null)

  const {
    state: { loading },
  } = useContext(FirstImpressionContext)

  const { showDeleteModal } = useContext(UniversalContext)

  // Handle firstImpression as array or object
  const firstImpressionData = Array.isArray(firstImpression) 
    ? firstImpression[0] 
    : firstImpression

  // Only create player when we have a valid videoUrl
  const player = useVideoPlayer(
    firstImpressionData?.videoUrl ? { uri: firstImpressionData.videoUrl } : undefined
  )

  // Store player reference and handle updates
  useEffect(() => {
    if (player) {
      playerRef.current = player
      // Set loop when player is ready
      player.loop = true
    }
    return () => {
      playerRef.current = null
    }
  }, [player])

  useEffect(() => {
    if (!player) return

    const subscription = player.addListener('playingChange', (newIsPlaying) => {
      if (playerRef.current === player) {
        setIsPlaying(newIsPlaying)
      }
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return null
    }
  }

  const renderContent = () => {
    // Handle firstImpression as array or object
    const firstImpressionData = Array.isArray(firstImpression) 
      ? firstImpression[0] 
      : firstImpression
    
    if (!firstImpressionData?.videoUrl) return null
    if (loading) return <LoaderFullScreen />
    if (!player) return null
    
    const createdDate = firstImpressionData?.created
    
    return (
      <View style={styles.videoBed}>
        <VideoView
          key={firstImpressionData.videoUrl} // Force remount when videoUrl changes
          player={player}
          style={styles.video}
          nativeControls
          contentFit="contain"
          fullscreenOptions={{ enterFullscreenButtonVisible: true }}
        />
        {createdDate && (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestampText}>
              📅 Created: {formatDate(createdDate)}
            </Text>
          </View>
        )}
        <View style={styles.buttonsBed}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (player && playerRef.current === player) {
                try {
                  isPlaying ? player.pause() : player.play()
                } catch (error) {
                  console.log('[VideoPlayerRetake] Error controlling playback:', error)
                }
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
            onPress={() => showDeleteModal()}
          >
            <MaterialCommunityIcons
              name="delete-circle"
              style={styles.deleteButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Log first impression data for debugging
  useEffect(() => {
    const firstImpressionData = Array.isArray(firstImpression) 
      ? firstImpression[0] 
      : firstImpression
    console.log('[VideoPlayerRetake] First impression data:', {
      id: firstImpressionData?._id,
      publicId: firstImpressionData?.publicId,
      hasVideoUrl: !!firstImpressionData?.videoUrl,
      created: firstImpressionData?.created,
    })
  }, [firstImpression])

  return (
    <>
      <DeleteModal
        id={Array.isArray(firstImpression) ? firstImpression[0]?._id : firstImpression?._id}
        publicId={Array.isArray(firstImpression) ? firstImpression[0]?.publicId : firstImpression?.publicId || null}
        bit="first impression"
      />
      {renderContent()}
    </>
  )
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
  timestampContainer: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  timestampText: {
    color: '#ffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default VideoPlayerRetake
