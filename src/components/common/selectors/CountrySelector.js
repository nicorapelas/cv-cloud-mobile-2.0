import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { COUNTRIES } from '../../../utils/countryConfig'

const CountrySelector = ({ selectedCountryCode, onSelect, style }) => {
  const [showModal, setShowModal] = useState(false)

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode)
  const displayValue = selectedCountry
    ? `${selectedCountry.flag} ${selectedCountry.name}`
    : null

  const handleSelect = (country) => {
    console.log('CountrySelector: handleSelect called with:', country)
    if (country) {
      console.log('CountrySelector: Selecting country code:', country.code)
      onSelect(country.code)
    } else {
      // Clear selection - pass null or undefined
      console.log('CountrySelector: Clearing selection')
      onSelect(null)
    }
    setShowModal(false)
  }

  const renderOption = (country, isSelected = false) => {
    const isClearOption = country === null
    const optionText = country
      ? `${country.flag} ${country.name}`
      : 'Clear Selection'

    return (
      <TouchableOpacity
        key={country?.code || 'clear'}
        style={[
          styles.option,
          isSelected && styles.optionSelected,
          isClearOption && styles.optionClear,
        ]}
        onPress={() => handleSelect(country)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && styles.optionTextSelected,
            isClearOption && styles.optionTextClear,
          ]}
        >
          {optionText}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalBed}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <AntDesign name="close" size={24} color="#ffff" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.optionsBedScroll}
              contentContainerStyle={styles.optionsBedContent}
              showsVerticalScrollIndicator={false}
            >
              {renderOption(null)}
              {COUNTRIES.map((country) =>
                renderOption(
                  country,
                  selectedCountryCode === country.code
                )
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={() => {
          console.log('CountrySelector: Button pressed, opening modal')
          setShowModal(true)
        }}
      >
        <Text
          style={
            displayValue ? styles.buttonText : styles.buttonTextPlaceholder
          }
        >
          {displayValue || 'Select Country'}
        </Text>
        <AntDesign name="down" size={16} color="#278acd" />
      </TouchableOpacity>
    </>
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
    maxHeight: '80%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#278acd',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4150',
  },
  modalTitle: {
    color: '#ffff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  optionsBedScroll: {
    maxHeight: 400,
  },
  optionsBedContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  option: {
    backgroundColor: '#1a1d2e',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#3a4150',
  },
  optionSelected: {
    backgroundColor: '#278acd',
    borderColor: '#278acd',
  },
  optionClear: {
    borderColor: '#7a7a7a',
  },
  optionText: {
    color: '#ffff',
    fontSize: 16,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#ffff',
    fontWeight: '600',
  },
  optionTextClear: {
    color: '#B6B8BA',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    height: 50,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 7,
    margin: 5,
  },
  buttonTextPlaceholder: {
    color: '#B6B8BA',
  },
  buttonText: {
    color: '#030303',
  },
})

export default CountrySelector

