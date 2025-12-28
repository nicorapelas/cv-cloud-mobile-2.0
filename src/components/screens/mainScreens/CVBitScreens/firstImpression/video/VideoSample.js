import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { VideoView, useVideoPlayer } from 'expo-video'

import LoaderFullScreen from '../../../../../common/LoaderFullScreen'
import { Context as FirstImpressionContext } from '../../../../../../context/FirstImpressionContext'

const VideoSample = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    state: { loading, videoDemoUrl },
    setVideoDemoShow,
    fetchDemoVideoUrl,
  } = useContext(FirstImpressionContext)

  const player = useVideoPlayer(
    videoDemoUrl?.url ? { uri: videoDemoUrl.url } : undefined
  )

  useEffect(() => {
    fetchDemoVideoUrl()
  }, [])

  useEffect(() => {
    if (videoDemoUrl?.url && player) {
      // Check if player is still valid before using it
      try {
        player.replaceAsync({ uri: videoDemoUrl.url }).then(() => {
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
  }, [videoDemoUrl?.url, player])

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

  const renderContent = () => {
    if (loading) return <LoaderFullScreen />
    if (!videoDemoUrl || !player) return null
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
            style={styles.backButton}
            onPress={() => setVideoDemoShow(false)}
          >
            <MaterialIcons style={styles.backButtonIcon} name="cancel" />
            <Text style={styles.backButtonText}>close</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  playButton: {
    paddingBottom: 20,
  },
  playButtonIcon: {
    color: '#ffff',
    fontSize: 42,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButtonIcon: {
    color: '#F9B321',
    paddingRight: 7,
    paddingTop: 2,
    fontSize: 20,
  },
  backButtonText: {
    color: '#F9B321',
    fontSize: 18,
  },
})

export default VideoSample
