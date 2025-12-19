import React, { useContext } from 'react'
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { Context as NavContext } from '../../../../../context/NavContext'

const FirstImpressionPermissions = () => {
  const { setCVBitScreenSelected } = useContext(NavContext)
  const noCameraPermissions = () => {
    return (
      <View style={styles.noPermissionsBed}>
        <View style={styles.noPermissionsContainer}>
          <FontAwesome
            style={styles.noPermissionsSubIcon}
            name="exclamation-triangle"
          />
          <Text style={styles.noPermissionsHeading}>Camera access denied</Text>
          <Text style={styles.noPermissionsSubHeading}>To fix this:</Text>
          {Platform.OS === 'ios' ? (
            <>
              <Text style={styles.noPermissionsStep}>Step 1</Text>
              <Text style={styles.noPermissionsText}>
                Launch setting from home screen
              </Text>
              <Text style={styles.noPermissionsStep}>Step 2</Text>
              <Text style={styles.noPermissionsText}>
                Search for 'CV Cloud' select it
              </Text>
              <Text style={styles.noPermissionsStep}>Step 3</Text>
              <Text style={styles.noPermissionsText}>Enable Camera</Text>
              <Text style={styles.noPermissionsStep}>Step 4</Text>
              <Text style={styles.noPermissionsText}>Return to CV Cloud</Text>
            </>
          ) : (
            <>
              <Text style={styles.noPermissionsStep}>Step 1</Text>
              <Text style={styles.noPermissionsText}>Go to setting </Text>
              <Text style={styles.noPermissionsStep}>Step 2</Text>
              <Text style={styles.noPermissionsText}>
                Search for 'Apps & notifications' and select it
              </Text>
              <Text style={styles.noPermissionsStep}>Step 3</Text>
              <Text style={styles.noPermissionsText}>
                Find 'CV Cloud' and select it
              </Text>
              <Text style={styles.noPermissionsStep}>Step 4</Text>
              <Text style={styles.noPermissionsText}>Tap on 'Permissions'</Text>
              <Text style={styles.noPermissionsStep}>Step 5</Text>
              <Text style={styles.noPermissionsText}>
                Tap on 'Camera' and enable 'Allow while using app'
              </Text>
              <Text style={styles.noPermissionsStep}>Step 6</Text>
              <Text style={styles.noPermissionsText}>Return to CV Cloud</Text>
            </>
          )}
        </View>
      </View>
    )
  }

  return (
    <>
      {noCameraPermissions()}
      <View style={styles.closeButtonBed}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setCVBitScreenSelected('firstImpression')}
        >
          <MaterialIcons name="arrow-back" style={styles.closeIcon} />
          <Text style={styles.closeText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  noPermissionsBed: {
    flex: 1,
    backgroundColor: '#232936',
    justifyContent: 'center',
  },
  noPermissionsContainer: {
    color: '#f9b321',
    backgroundColor: '#394048',
    borderRadius: 5,
    padding: 15,
    width: '80%',
    alignSelf: 'center',
  },
  noPermissionsSubIcon: {
    color: '#f9b321',
    fontSize: 30,
    alignSelf: 'center',
  },

  noPermissionsHeading: {
    color: '#f9b321',
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 5,
  },

  noPermissionsSubHeading: {
    color: '#f9b321',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 5,
  },

  noPermissionsStep: {
    color: '#f9b321',
    fontFamily: 'sourceSansProBold',
    fontSize: 16,
    marginBottom: 1,
  },

  noPermissionsText: {
    color: '#f9b321',
    fontSize: 14,
    marginBottom: 7,
  },
  closeButtonBed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#232936',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  closeButton: {
    backgroundColor: '#278acd',
    borderColor: '#ffff',
    borderWidth: 2,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    marginVertical: 5,
  },
  closeIcon: {
    color: '#ffff',
    fontSize: 16,
    marginTop: 2,
    marginRight: 5,
  },
  closeText: {
    color: '#ffff',
    fontSize: 16,
  },
})

export default FirstImpressionPermissions
