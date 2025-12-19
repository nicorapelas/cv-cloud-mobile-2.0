import React, { useContext } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { View } from 'react-native'

import { Context as NavContext } from '../../context/NavContext'

const DoneButton = ({ routeName, text }) => {
  const { setCVBitScreenSelected } = useContext(NavContext)

  return (
    <View style={styles.bed}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCVBitScreenSelected(routeName)}
      >
        {routeName === 'photo' ? (
          <MaterialIcons name="arrow-back" style={styles.icon} />
        ) : (
          <MaterialIcons name="check-circle" style={styles.icon} />
        )}

        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  bed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#232936',
    justifyContent: 'center',
    zIndex: 10, // Ensure button is above content
    elevation: 10, // Android elevation
    // NOTE: Parent ScrollViews must have contentContainerStyle with paddingBottom: 60
    // to prevent this button from overlaying scrollable content
  },
  button: {
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
  icon: {
    color: '#ffff',
    fontSize: 16,
    marginTop: 2,
    marginRight: 5,
  },
  text: {
    color: '#ffff',
    fontSize: 16,
  },
})

export default DoneButton
