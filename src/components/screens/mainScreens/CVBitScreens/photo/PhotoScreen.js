import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import BitNoData from '../../../../common/BitNoData'
import AddContentButtonLink from '../../../../links/AddContentButtonLink'
import DoneButton from '../../../../links/DoneButton'
import DeleteModal from '../../../../common/modals/DeleteModal'
import { Context as PhotoContext } from '../../../../../context/PhotoContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'
import { useRealTime } from '../../../../../context/RealTimeContext'

const PhotoScreen = () => {
  const [photoSelected, setPhotoSelected] = useState(null)
  const [documentId, setDocumentId] = useState('')
  const [documentSelected, setDocumentSelected] = useState('')
  const [photoPublicId, setPhotoPublicId] = useState(null)
  const autoAssignAttempted = useRef(false)

  const { showDeleteModal } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const {
    state: { loading, photos, photoAssignLoading },
    assignPhoto,
    fetchPhotos,
    setPhotoToEdit,
    setAssignedPhotoId,
  } = useContext(PhotoContext)

  const { lastUpdate } = useRealTime()
  const lastRefreshTimestamp = useRef(null)
  const fetchPhotosRef = useRef(fetchPhotos)
  const assignPhotoRef = useRef(assignPhoto)
  const setAssignedPhotoIdRef = useRef(setAssignedPhotoId)
  
  // Keep refs updated with latest functions
  useEffect(() => {
    fetchPhotosRef.current = fetchPhotos
    assignPhotoRef.current = assignPhoto
    setAssignedPhotoIdRef.current = setAssignedPhotoId
  }, [fetchPhotos, assignPhoto, setAssignedPhotoId])
  
  useEffect(() => {
    // Don't run auto-assign if we're in any loading state
    if (loading || photoAssignLoading) return
    
    if (photos && photos.length > 0) {
      const photoAssigned = photos.filter(ph => {
        return ph && ph.assigned === true && ph._id
      })
      if (photoAssigned.length > 0 && photoAssigned[0] && photoAssigned[0]._id) {
        setAssignedPhotoIdRef.current(photoAssigned[0]._id)
        autoAssignAttempted.current = false // Reset if we find an assigned photo
      } else if (!autoAssignAttempted.current) {
        // If no photo is assigned and we haven't attempted yet, auto-assign the first photo
        const firstPhoto = photos.find(ph => ph && ph._id)
        if (firstPhoto && firstPhoto._id) {
          autoAssignAttempted.current = true
          assignPhotoRef.current(firstPhoto._id)
        }
      }
    }
  }, [photos, photoAssignLoading, loading])

  // Handle real-time updates - only run when lastUpdate changes, not when fetchPhotos changes
  useEffect(() => {
    // Don't fetch if we're in any loading state or if photos haven't loaded yet
    if (loading || photoAssignLoading || photos === null) {
      return
    }

    if (lastUpdate && lastUpdate.dataType === 'photo') {
      const now = Date.now()
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return
      }

      lastRefreshTimestamp.current = now
      setTimeout(() => {
        fetchPhotosRef.current()
      }, 500)
    }
  }, [lastUpdate, photoAssignLoading, loading, photos])

  const handlePressUsePhoto = (data) => {
    if (data && data._id) {
      setPhotoSelected(data._id)
      assignPhoto(data._id)
    }
  }

  const handlePressEdit = (data) => {
    if (data) {
      setPhotoToEdit(data)
      setCVBitScreenSelected('photoEdit')
    }
  }

  const handlePressDelete = (data) => {
    if (data && data._id) {
      setDocumentId(data._id)
      setDocumentSelected(data.title || '')
      setPhotoPublicId(data.publicId || null)
      showDeleteModal()
    }
  }

  const renderList = () => {
    // Wait for all loading to complete before rendering
    if (loading || photoAssignLoading || photos === null) return <LoaderFullScreen />
    if (photos.length < 1)
      return (
        <BitNoData
          cvBit="Photo"
          routeName="photoCreate"
          buttonText="add photo"
        />
      )
    return (
      <>
        <AddContentButtonLink routeName="photoCreate" text="upload photo" />
        <FlatList
          keyExtractor={(photo) => photo && photo._id ? photo._id : Math.random().toString()}
          data={photos}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <View>
                  {
                    photoAssignLoading ? (
                      <View
                      style={styles.assignImageButton}
                      onPress={() => handlePressUsePhoto(item)}
                    >
                      <Text style={styles.assignImageButtonText}>
                        updating...
                      </Text>
                    </View>
                    ) : (
                      item.assigned || item._id === photoSelected ? (
                        <View style={styles.assignedImage}>
                          <Feather
                            style={styles.assignedImageIcon}
                            name="check-circle"
                            size={24}
                          />
                          <Text style={styles.assignedImageText}>assigned</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.assignImageButton}
                          onPress={() => handlePressUsePhoto(item)}
                        >
                          <Text style={styles.assignImageButtonText}>
                            use photo
                          </Text>
                        </TouchableOpacity>
                      )
                    )
                  }
                  <View style={styles.imageBed}>
                    <Image
                      style={styles.photo}
                      source={{
                        uri: `${item.photoUrl}`,
                      }}
                    />
                  </View>
                  <View style={styles.titleBed}>
                    <Text style={styles.title}>{item.title}</Text>
                  </View>
                  <View style={styles.buttonBed}>
                    <TouchableOpacity
                      style={styles.editButtonBed}
                      onPress={() => handlePressEdit(item)}
                    >
                      <MaterialCommunityIcons
                        style={styles.actionButton}
                        name="pencil"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButtonBed}
                      onPress={() => handlePressDelete(item)}
                    >
                      <MaterialCommunityIcons
                        style={styles.actionButton}
                        name="delete"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          }}
        />
      </>
    )
  }



  return (
    <>
      <DeleteModal
        id={documentId}
        documentSelected={documentSelected}
        publicId={photoPublicId}
        bit="photo"
      />
      <View style={styles.bed}>{renderList()}</View>
      {loading || !photos || photos.length < 1 ? null : (
        <DoneButton text="Done" routeName="" />
      )}
    </>
  )
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
    paddingBottom: 60,
  },
  container: {
    backgroundColor: '#2e3647',
    margin: 10,
    padding: 10,
    borderRadius: 7,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  assignImageButton: {
    backgroundColor: '#278ACD',
    borderColor: '#ffff',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
  },
  assignImageButtonText: {
    color: '#ffff',
  },
  assignedImage: {
    backgroundColor: '#0ca302',
    borderColor: '#ffff',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
  },
  assignedImageIcon: {
    color: '#ffff',
    paddingTop: 3,
  },
  assignedImageText: {
    color: '#ffff',
    paddingLeft: 5,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 7,
  },
  titleBed: {
    alignSelf: 'center',
    paddingTop: 5,
  },
  title: {
    color: '#ffff',
    fontSize: 17,
  },
  buttonBed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: 120,
    paddingTop: 5,
  },
  editButtonBed: {
    backgroundColor: '#558dd8',
    borderRadius: 25,
  },
  deleteButtonBed: {
    backgroundColor: '#c35a44',
    borderRadius: 25,
  },
  actionButton: {
    fontSize: 22,
    color: '#ffff',
    padding: 7,
  },
})

export default PhotoScreen
