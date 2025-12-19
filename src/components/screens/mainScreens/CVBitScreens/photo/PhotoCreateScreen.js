import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  TextInput,
  Platform,
  ScrollView,
  PanResponder,
  Dimensions,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Camera } from 'expo-camera'
import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useKeyboard } from '@react-native-community/hooks'

import keys from '../../../../../../config/keys'
import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import PhotoPermissions from './PhotoPermissions'
import FormHintModal from '../../../../common/modals/FormHintModal'
import FormCancelButton from '../../../../common/FormCancelButton'
import DoneButton from '../../../../links/DoneButton'
import { Context as PhotoContext } from '../../../../../context/PhotoContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const PhotoCreateScreen = () => {
  const [modal, setModal] = useState(true)
  const [title, setTitle] = useState(null)
  const [imageUri, setImageUri] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState(null)
  const [galleryPermissionStatus, setGalleryPermissionStatus] = useState(null)
  const [showCropScreen, setShowCropScreen] = useState(false)
  const [rawImageUri, setRawImageUri] = useState(null)
  const [cropping, setCropping] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 }) // Actual wrapper/container size
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })
  const [hasImageLayout, setHasImageLayout] = useState(false) // Track if we have actual layout measurements // Offset of image within container
  const [cropFrame, setCropFrame] = useState({ x: 0, y: 0, size: 0 })
  const scrollViewRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const imageContainerRef = useRef(null)

  const {
    state: { loading, uploadSignature },
    createPhoto,
    createUploadSignature,
    clearUploadSignature,
  } = useContext(PhotoContext)

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
    data.append('file', {
      uri: imageFile.uri,
      type: `image/${imageFile.uri.split('.')[1]}`,
      name: imageFile.name,
    })
    data.append('api_key', apiKey)
    data.append('signature', signature)
    data.append('timestamp', timestamp)
    data.append('upload_preset', 'photo')
    fetch(keys.cloudinary.uploadImageUrl, {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          clearUploadSignature()
          Alert.alert('Unable to upload image, please try again later')
          setCVBitScreenSelected('')
          return
        }
        createPhoto({
          title: title,
          photoUrl: data.secure_url || data.url,
          publicId: data.public_id,
        })
        clearUploadSignature()
        setCVBitScreenSelected('photo')
      })
      .catch((err) => {
        Alert.alert('Unable to upload image, please try again later')
        return
      })
  }

  // Initialize crop frame when image is loaded
  useEffect(() => {
    if (rawImageUri && showCropScreen) {
      // Get image dimensions from ImageManipulator to account for EXIF orientation
      // This gives us the actual dimensions that ImageManipulator will use
      ImageManipulator.manipulateAsync(
        rawImageUri,
        [], // No operations, just get the processed image info
        { format: ImageManipulator.SaveFormat.JPEG, compress: 1.0 }
      )
        .then((result) => {
          // Use the dimensions from ImageManipulator result
          // This accounts for any EXIF orientation that ImageManipulator applies
          const width = result.width
          const height = result.height
          console.log('Image dimensions from ImageManipulator:', { width, height, uri: result.uri })
          
          setImageSize({ width, height })
          
          // Also get dimensions from Image.getSize for comparison
          Image.getSize(
            rawImageUri,
            (imgWidth, imgHeight) => {
              console.log('Image dimensions from Image.getSize:', { width: imgWidth, height: imgHeight })
              
              // Calculate initial display size (80% of screen width, maintaining aspect ratio)
              // This will be updated when the image actually renders via onLayout
              const screenWidth = Dimensions.get('window').width
              const displayWidth = screenWidth * 0.8
              const aspectRatio = width / height
              const displayHeight = displayWidth / aspectRatio
              setDisplaySize({ width: displayWidth, height: displayHeight })
              
              // Initialize crop frame to center square
              const cropSize = Math.min(displayWidth, displayHeight) * 0.8
              setCropFrame({
                x: (displayWidth - cropSize) / 2,
                y: (displayHeight - cropSize) / 2,
                size: cropSize,
              })
            },
            (error) => {
              console.error('Error getting image size:', error)
            }
          )
        })
        .catch((error) => {
          console.error('Error getting image info from ImageManipulator:', error)
          // Fallback to Image.getSize
          Image.getSize(
            rawImageUri,
            (width, height) => {
              console.log('Image dimensions (fallback):', { width, height })
              setImageSize({ width, height })
              
              const screenWidth = Dimensions.get('window').width
              const displayWidth = screenWidth * 0.8
              const aspectRatio = width / height
              const displayHeight = displayWidth / aspectRatio
              setDisplaySize({ width: displayWidth, height: displayHeight })
              
              const cropSize = Math.min(displayWidth, displayHeight) * 0.8
              setCropFrame({
                x: (displayWidth - cropSize) / 2,
                y: (displayHeight - cropSize) / 2,
                size: cropSize,
              })
            },
            (error) => {
              console.error('Error getting image size:', error)
            }
          )
        })
    }
  }, [rawImageUri, showCropScreen])

  // Recalculate display size and offset when wrapper or image size changes
  // BUT only if we don't have actual layout measurements yet (handleImageLayout is authoritative)
  useEffect(() => {
    if (hasImageLayout) {
      // We have actual layout measurements, skip calculation
      return
    }
    if (wrapperSize.width > 0 && wrapperSize.height > 0 && imageSize.width > 0 && imageSize.height > 0) {
      const imageAspectRatio = imageSize.width / imageSize.height
      const containerAspectRatio = wrapperSize.width / wrapperSize.height
      
      let actualImageWidth, actualImageHeight
      let offsetX = 0, offsetY = 0
      
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider - constrained by container width, letterboxed vertically
        actualImageWidth = wrapperSize.width
        actualImageHeight = wrapperSize.width / imageAspectRatio
        offsetY = (wrapperSize.height - actualImageHeight) / 2
      } else {
        // Image is taller - constrained by container height, pillarboxed horizontally
        actualImageHeight = wrapperSize.height
        actualImageWidth = wrapperSize.height * imageAspectRatio
        offsetX = (wrapperSize.width - actualImageWidth) / 2
      }
      
      console.log('Recalculated display size and offset:', {
        wrapperSize: { ...wrapperSize },
        imageSize: { ...imageSize },
        actualImageWidth: actualImageWidth.toFixed(2),
        actualImageHeight: actualImageHeight.toFixed(2),
        offsetX: offsetX.toFixed(2),
        offsetY: offsetY.toFixed(2),
        imageAspectRatio: imageAspectRatio.toFixed(4),
        containerAspectRatio: containerAspectRatio.toFixed(4),
      })
      
      // Update display size to match actual rendered image size
      setDisplaySize({ width: actualImageWidth, height: actualImageHeight })
      // Store offset for coordinate conversion
      setImageOffset({ x: offsetX, y: offsetY })
      
      // Adjust crop frame if it's outside bounds or if this is the first measurement
      setCropFrame((prev) => {
        // If crop frame hasn't been initialized or is invalid, center it
        if (prev.size === 0 || prev.x < 0 || prev.y < 0) {
          const cropSize = Math.min(actualImageWidth, actualImageHeight) * 0.8
          return {
            x: offsetX + (actualImageWidth - cropSize) / 2,
            y: offsetY + (actualImageHeight - cropSize) / 2,
            size: cropSize,
          }
        }
        // Otherwise, constrain existing crop frame to new bounds
        const maxSize = Math.min(actualImageWidth, actualImageHeight) * 0.95
        const minSize = Math.min(actualImageWidth, actualImageHeight) * 0.3
        const constrainedSize = Math.max(minSize, Math.min(maxSize, prev.size))
        const maxX = offsetX + actualImageWidth - constrainedSize
        const maxY = offsetY + actualImageHeight - constrainedSize
        return {
          x: Math.max(offsetX, Math.min(maxX, prev.x)),
          y: Math.max(offsetY, Math.min(maxY, prev.y)),
          size: constrainedSize,
        }
      })
    }
  }, [wrapperSize, imageSize, hasImageLayout])

  // Measure wrapper size
  const handleWrapperLayout = (event) => {
    const containerWidth = event.nativeEvent.layout.width
    const containerHeight = event.nativeEvent.layout.height
    
    console.log('Wrapper layout measured:', { containerWidth, containerHeight })
    
    setWrapperSize({ width: containerWidth, height: containerHeight })
  }

  // Measure the actual rendered image size
  // NOTE: onLayout on Image with resizeMode="contain" gives us the container size,
  // but we need to calculate the actual rendered image size based on aspect ratio
  // This is the AUTHORITATIVE source for displaySize and imageOffset
  const handleImageLayout = (event) => {
    const containerWidth = event.nativeEvent.layout.width
    const containerHeight = event.nativeEvent.layout.height

    if (containerWidth === 0 || containerHeight === 0 || imageSize.width === 0 || imageSize.height === 0) return

    console.log('Image container layout measured:', { containerWidth, containerHeight, imageSize })

    // Calculate actual rendered image size based on aspect ratio (resizeMode="contain")
    const imageAspectRatio = imageSize.width / imageSize.height
    const containerAspectRatio = containerWidth / containerHeight
    
    let actualImageWidth, actualImageHeight
    let offsetX = 0, offsetY = 0
    
    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider - constrained by container width, letterboxed vertically
      actualImageWidth = containerWidth
      actualImageHeight = containerWidth / imageAspectRatio
      offsetY = (containerHeight - actualImageHeight) / 2
    } else {
      // Image is taller - constrained by container height, pillarboxed horizontally
      actualImageHeight = containerHeight
      actualImageWidth = containerHeight * imageAspectRatio
      offsetX = (containerWidth - actualImageWidth) / 2
    }

    console.log('Calculated actual rendered image size:', {
      actualImageWidth: actualImageWidth.toFixed(2),
      actualImageHeight: actualImageHeight.toFixed(2),
      offsetX: offsetX.toFixed(2),
      offsetY: offsetY.toFixed(2),
      containerSize: { width: containerWidth, height: containerHeight },
      imageSize: { ...imageSize },
    })

    // Update display size with the calculated rendered dimensions
    setDisplaySize({ width: actualImageWidth, height: actualImageHeight })
    setImageOffset({ x: offsetX, y: offsetY })

    // Mark that we have actual layout measurements (this disables the useEffect calculation)
    setHasImageLayout(true)

    // Constrain crop frame to the calculated image bounds
    setCropFrame((prev) => {
      const maxSize = Math.min(actualImageWidth, actualImageHeight) * 0.95
      const minSize = Math.min(actualImageWidth, actualImageHeight) * 0.3
      const constrainedSize = Math.max(minSize, Math.min(maxSize, prev.size))
      const maxX = offsetX + actualImageWidth - constrainedSize
      const maxY = offsetY + actualImageHeight - constrainedSize
      // If previous frame was uninitialized, center it
      if (prev.size === 0 || prev.x < 0 || prev.y < 0) {
        const cropSize = Math.min(actualImageWidth, actualImageHeight) * 0.8
        return {
          x: offsetX + (actualImageWidth - cropSize) / 2,
          y: offsetY + (actualImageHeight - cropSize) / 2,
          size: cropSize,
        }
      }
      return {
        x: Math.max(offsetX, Math.min(maxX, prev.x)),
        y: Math.max(offsetY, Math.min(maxY, prev.y)),
        size: constrainedSize,
      }
    })
  }

  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable native crop, use custom crop
        allowsMultipleSelection: false,
        quality: 1.0, // High quality for cropping
      })
      if (!data.canceled) {
        const { uri } = data.assets[0]
        setRawImageUri(uri)
        setShowCropScreen(true)
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
        allowsEditing: false, // Disable native crop, use custom crop
        quality: 1.0, // High quality for cropping
      })
      if (!data.canceled) {
        const { uri } = data.assets[0]
        setRawImageUri(uri)
        setShowCropScreen(true)
      }
    } else {
      setCameraPermissionStatus(false)
    }
  }

  // Calculate actual crop coordinates from display coordinates
  const calculateCropCoordinates = () => {
    if (!imageSize.width || !displaySize.width || displaySize.width === 0) {
      console.error('Invalid sizes for crop calculation:', { imageSize, displaySize })
      return null
    }

    // Account for image offset within container
    // cropFrame.x/y are relative to the wrapper, so subtract offset to get position relative to image
    const cropXRelativeToImage = cropFrame.x - imageOffset.x
    const cropYRelativeToImage = cropFrame.y - imageOffset.y

    // Clamp to ensure crop stays within image bounds
    // The crop frame should be within [0, displaySize.width - cropFrame.size] for X
    // and [0, displaySize.height - cropFrame.size] for Y
    const clampedX = Math.max(0, Math.min(cropXRelativeToImage, displaySize.width - cropFrame.size))
    const clampedY = Math.max(0, Math.min(cropYRelativeToImage, displaySize.height - cropFrame.size))

    // Calculate scale factors - convert from display pixels to image pixels
    const scaleX = imageSize.width / displaySize.width
    const scaleY = imageSize.height / displaySize.height

    // Convert display coordinates (relative to image) to image pixel coordinates
    // Use clamped values to ensure we're within bounds
    // Apply small adjustment to account for systematic offset (25px down and right)
    // Additional 20px down adjustment
    const adjustmentX = 25 * scaleX
    const adjustmentY = 25 * scaleY + 20 * scaleY // 25px + 20px = 45px total down
    const baseOriginX = clampedX * scaleX + adjustmentX
    const baseOriginY = clampedY * scaleY + adjustmentY
    const baseCropWidth = cropFrame.size * scaleX
    const baseCropHeight = cropFrame.size * scaleY
    
    // Increase crop size by 21% total (1.1 * 1.1 = 1.21) and adjust origin to keep it centered
    const cropWidth = Math.round(baseCropWidth * 1.21)
    const cropHeight = Math.round(baseCropHeight * 1.21)
    // Adjust origin by -10.5% of the size to keep it centered (since we're increasing by 21%, we move back by 10.5%)
    const originX = Math.round(baseOriginX - (baseCropWidth * 0.105))
    const originY = Math.round(baseOriginY - (baseCropHeight * 0.105))

    // Final bounds check - ensure crop doesn't exceed image dimensions
    const maxX = Math.max(0, imageSize.width - cropWidth)
    const maxY = Math.max(0, imageSize.height - cropHeight)

    const finalOriginX = Math.max(0, Math.min(originX, maxX))
    const finalOriginY = Math.max(0, Math.min(originY, maxY))
    
    // Ensure width/height don't exceed remaining image space
    const finalWidth = Math.max(1, Math.min(cropWidth, imageSize.width - finalOriginX))
    const finalHeight = Math.max(1, Math.min(cropHeight, imageSize.height - finalOriginY))

    const finalCoords = {
      originX: finalOriginX,
      originY: finalOriginY,
      width: finalWidth,
      height: finalHeight,
    }

    // Debug logging
    console.log('Crop calculation:', {
      cropFrame: { ...cropFrame },
      imageOffset: { ...imageOffset },
      displaySize: { ...displaySize },
      imageSize: { ...imageSize },
      wrapperSize: { ...wrapperSize },
      cropXRelativeToImage: cropXRelativeToImage.toFixed(2),
      cropYRelativeToImage: cropYRelativeToImage.toFixed(2),
      clampedX: clampedX.toFixed(2),
      clampedY: clampedY.toFixed(2),
      scaleX: scaleX.toFixed(4),
      scaleY: scaleY.toFixed(4),
      finalCoords,
    })

    return finalCoords
  }

  // Crop image based on current crop frame position and size
  const handleCropImage = async () => {
    if (!rawImageUri || cropping || !imageSize.width) return

    setCropping(true)
    try {
      const cropCoords = calculateCropCoordinates()
      if (!cropCoords) {
        throw new Error('Failed to calculate crop coordinates')
      }

      console.log('Cropping image with coordinates:', cropCoords)
      console.log('Using image URI:', rawImageUri)

      // Crop image using original URI
      const croppedImage = await ImageManipulator.manipulateAsync(
        rawImageUri,
        [
          {
            crop: {
              originX: cropCoords.originX,
              originY: cropCoords.originY,
              width: cropCoords.width,
              height: cropCoords.height,
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      )

      // Process the cropped image (resize and compress)
      const processedImage = await processImage(croppedImage.uri)

      let newFile = {
        uri: processedImage.uri,
        type: `image/jpeg`,
        name: `${randomFileName}.jpg`,
      }

      setImageUri(newFile.uri)
      setImageFile(newFile)
      setShowCropScreen(false)
      setRawImageUri(null)
      setModal(false)
    } catch (error) {
      console.error('Error cropping image:', error)
      Alert.alert('Error', 'Failed to crop image. Please try again.')
    } finally {
      setCropping(false)
    }
  }

  const handleRetake = () => {
    setShowCropScreen(false)
    setRawImageUri(null)
    setHasImageLayout(false) // Reset layout flag
  }

  const handleCancelCrop = () => {
    setShowCropScreen(false)
    setRawImageUri(null)
    setHasImageLayout(false) // Reset layout flag
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
            autoCapitalize="words"
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
          <View style={styles.buttonContainer}>
            <FormCancelButton route="photo" />
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
        <FormHintModal bit="photo" />
      </View>
    )
  }

  // Store initial values for gestures
  const initialPinchDistance = useRef(null)
  const initialCropSize = useRef(null)
  const initialCropPosition = useRef({ x: 0, y: 0 })
  const displaySizeRef = useRef(displaySize)
  const imageOffsetRef = useRef(imageOffset)

  // Keep refs in sync
  useEffect(() => {
    displaySizeRef.current = displaySize
  }, [displaySize])

  useEffect(() => {
    imageOffsetRef.current = imageOffset
  }, [imageOffset])

  // Pan responder for crop frame interaction
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond if there's actual movement or two touches
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2 || gestureState.numberActiveTouches === 2
      },
      onPanResponderGrant: (evt) => {
        // Store initial crop position for pan gesture - use functional update to get current state
        setCropFrame((prev) => {
          initialCropPosition.current = { x: prev.x, y: prev.y }
          return prev
        })
        // Reset pinch values on new gesture
        initialPinchDistance.current = null
        initialCropSize.current = null
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentDisplaySize = displaySizeRef.current
        if (!currentDisplaySize.width || currentDisplaySize.width === 0) return

        const { dx, dy, numberActiveTouches } = gestureState

        if (numberActiveTouches === 1) {
          // Single touch - pan the crop frame
          const newX = initialCropPosition.current.x + dx
          const newY = initialCropPosition.current.y + dy

          setCropFrame((prev) => {
            // Get current image offset from ref
            const currentOffset = imageOffsetRef.current
            const minX = currentOffset.x
            const minY = currentOffset.y
            const maxX = currentOffset.x + currentDisplaySize.width - prev.size
            const maxY = currentOffset.y + currentDisplaySize.height - prev.size

            const clampedX = Math.max(minX, Math.min(maxX, newX))
            const clampedY = Math.max(minY, Math.min(maxY, newY))

            // Debug: log position changes
            if (Math.abs(clampedX - prev.x) > 1 || Math.abs(clampedY - prev.y) > 1) {
              console.log('Crop frame moved:', {
                from: { x: prev.x, y: prev.y },
                to: { x: clampedX, y: clampedY },
                delta: { dx, dy },
                offset: currentOffset,
                displaySize: currentDisplaySize,
              })
            }

            return {
              ...prev,
              x: clampedX,
              y: clampedY,
            }
          })
        } else if (numberActiveTouches === 2) {
          // Two touches - scale the crop frame
          const touches = evt.nativeEvent.touches
          if (touches.length === 2) {
            const touch1 = touches[0]
            const touch2 = touches[1]
            const distance = Math.sqrt(
              Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2)
            )

            // Store initial distance on first two-finger touch
            if (initialPinchDistance.current === null) {
              initialPinchDistance.current = distance
              setCropFrame((prev) => {
                initialCropSize.current = prev.size
                return prev
              })
            }

            if (initialCropSize.current === null) return

            const scale = distance / initialPinchDistance.current
            const newSize = initialCropSize.current * scale

            // Constrain size
            const minSize = Math.min(currentDisplaySize.width, currentDisplaySize.height) * 0.3
            const maxSize = Math.min(currentDisplaySize.width, currentDisplaySize.height) * 0.95

            const constrainedSize = Math.max(minSize, Math.min(maxSize, newSize))

            setCropFrame((prev) => {
              const centerX = prev.x + prev.size / 2
              const centerY = prev.y + prev.size / 2

              const newX = centerX - constrainedSize / 2
              const newY = centerY - constrainedSize / 2

            const currentOffset = imageOffsetRef.current
            const minX = currentOffset.x
            const minY = currentOffset.y
            const maxX = currentOffset.x + currentDisplaySize.width - constrainedSize
            const maxY = currentOffset.y + currentDisplaySize.height - constrainedSize

              return {
                x: Math.max(minX, Math.min(maxX, newX)),
                y: Math.max(minY, Math.min(maxY, newY)),
                size: constrainedSize,
              }
            })
          }
        }
      },
      onPanResponderRelease: () => {
        // Reset initial distance for next pinch gesture
        initialPinchDistance.current = null
        initialCropSize.current = null
      },
    })
  ).current

  const renderCropScreen = () => {
    if (!showCropScreen || !rawImageUri) return null

    return (
      <View style={styles.cropScreenContainer}>
        {/* Navigation bar */}
        <View style={styles.cropNavBar}>
          <TouchableOpacity
            style={styles.cropNavButton}
            onPress={handleCancelCrop}
          >
            <MaterialIcons style={styles.cropNavIcon} name="arrow-back" />
            <Text style={styles.cropNavText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cropNavButton}
            onPress={handleRetake}
          >
            <MaterialIcons style={styles.cropNavIcon} name="refresh" />
            <Text style={styles.cropNavText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cropNavButton, cropping && styles.cropNavButtonDisabled]}
            onPress={handleCropImage}
            disabled={cropping}
          >
            {cropping ? (
              <Text style={styles.cropNavText}>Processing...</Text>
            ) : (
              <>
                <MaterialIcons style={styles.cropNavIcon} name="check" />
                <Text style={styles.cropNavText}>Crop</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Image preview with crop overlay */}
        <View
          ref={imageContainerRef}
          style={styles.cropImageContainer}
          {...panResponder.panHandlers}
        >
          {/* Image wrapper - constrains overlay to image area */}
          <View
            style={styles.cropImageWrapper}
            pointerEvents="none"
            onLayout={handleWrapperLayout}
          >
            <Image
              source={{ uri: rawImageUri }}
              style={styles.cropPreviewImage}
              resizeMode="contain"
              onLayout={handleImageLayout}
              pointerEvents="none"
            />
            <View style={styles.cropOverlay} pointerEvents="none">
              {/* Dark overlay outside crop area - dynamically positioned */}
              {/* Account for image offset in overlay calculations */}
              <View
                style={[
                  styles.cropOverlayTop,
                  { height: cropFrame.y },
                ]}
              />
              <View
                style={[
                  styles.cropOverlayBottom,
                  {
                    top: cropFrame.y + cropFrame.size,
                    height: (wrapperSize.height || 0) - (cropFrame.y + cropFrame.size),
                  },
                ]}
              />
              <View
                style={[
                  styles.cropOverlayLeft,
                  {
                    top: cropFrame.y,
                    height: cropFrame.size,
                    width: cropFrame.x,
                  },
                ]}
              />
              <View
                style={[
                  styles.cropOverlayRight,
                  {
                    top: cropFrame.y,
                    left: cropFrame.x + cropFrame.size,
                    height: cropFrame.size,
                    width: (wrapperSize.width || 0) - (cropFrame.x + cropFrame.size),
                  },
                ]}
              />
              {/* Crop frame */}
              <View
                style={[
                  styles.cropFrame,
                  {
                    left: cropFrame.x,
                    top: cropFrame.y,
                    width: cropFrame.size,
                    height: cropFrame.size,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.cropInstructions}>
          <Text style={styles.cropInstructionsText}>
            Drag to move • Pinch to resize
          </Text>
        </View>
      </View>
    )
  }

  const renderContent = () => {
    if (loading) return <LoaderFullScreen />
    if (cameraPermissionStatus === false)
      return <PhotoPermissions bit="camera" />
    if (galleryPermissionStatus === false)
      return <PhotoPermissions bit="gallery" />
    if (showCropScreen) return renderCropScreen()
    return (
      <>
        <View style={styles.bed}>
          {cameraOrGallery()}
          {titleField()}
        </View>
        {imageUri !== null ? null : (
          <DoneButton text="Cancel" routeName="photo" />
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
    alignSelf: 'center',
    height: 50,
    width: '85%',
    textAlign: 'center',
    borderRadius: 7,
    margin: 15,
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
    height: 40,
    marginLeft: 10,
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
  // Crop screen styles
  cropScreenContainer: {
    flex: 1,
    backgroundColor: '#232936',
  },
  cropNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#232936',
    borderBottomWidth: 1,
    borderBottomColor: '#2e3647',
  },
  cropNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#278acd',
    borderColor: '#ffff',
    borderWidth: 2,
  },
  cropNavButtonDisabled: {
    opacity: 0.5,
  },
  cropNavIcon: {
    color: '#ffff',
    fontSize: 20,
    marginRight: 5,
  },
  cropNavText: {
    color: '#ffff',
    fontSize: 16,
    fontWeight: '500',
  },
  cropImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232936',
    position: 'relative',
  },
  cropImageWrapper: {
    position: 'relative',
    alignSelf: 'center',
    width: '90%',
    maxHeight: '70%',
  },
  cropPreviewImage: {
    width: '100%',
    height: '100%',
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cropOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropOverlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropOverlayLeft: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropOverlayRight: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropFrame: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#F9B321',
    borderRadius: 5,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  cropInstructions: {
    padding: 20,
    backgroundColor: '#232936',
    alignItems: 'center',
  },
  cropInstructionsText: {
    color: '#ffff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
})

export default PhotoCreateScreen
