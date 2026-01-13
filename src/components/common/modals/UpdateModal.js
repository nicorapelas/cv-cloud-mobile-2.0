import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Linking,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const UpdateModal = ({ visible, onDismiss, isForceUpdate = false, updateUrl, updateUrlWeb }) => {
  const handleUpdate = async () => {
    try {
      // Try to open Play Store app first
      const canOpen = await Linking.canOpenURL(updateUrl)
      if (canOpen) {
        await Linking.openURL(updateUrl)
      } else {
        // Fallback to web Play Store
        await Linking.openURL(updateUrlWeb)
      }
    } catch (error) {
      console.error('Error opening update URL:', error)
      // Fallback to web if deep link fails
      try {
        await Linking.openURL(updateUrlWeb)
      } catch (fallbackError) {
        console.error('Error opening fallback URL:', fallbackError)
      }
    }
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={isForceUpdate ? undefined : onDismiss} // Prevent dismiss on force update
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalBed}>
          <View style={styles.header}>
            <MaterialIcons name="system-update" style={styles.icon} />
            <Text style={styles.title}>
              {isForceUpdate ? 'Update Required' : 'Update Available'}
            </Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.message}>
              {isForceUpdate
                ? 'A new version of CV Cloud is required. Please update to continue using the app.'
                : 'A new version of CV Cloud is available. Update now to get the latest features and improvements.'}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {!isForceUpdate && (
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={onDismiss}
              >
                <Text style={styles.buttonTextSecondary}>Later</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonTextPrimary}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalBed: {
    backgroundColor: '#232936',
    width: '85%',
    maxWidth: 400,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#278acd',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4150',
  },
  icon: {
    color: '#F9B321',
    fontSize: 28,
    marginRight: 10,
  },
  title: {
    color: '#ffff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  message: {
    color: '#ffff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#278acd',
    borderWidth: 2,
    borderColor: '#ffff',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#7a7a7a',
  },
  buttonTextPrimary: {
    color: '#ffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#B6B8BA',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default UpdateModal
