import React, { useState, useContext, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { Context as UniversalContext } from '../../../context/UniversalContext'

const OptionsModal = ({ bit, incomingValue, optionsArray, selected }) => {
  const [showModal, setShowModal] = useState(false)
  const [placeholder, setPlaceholder] = useState(null)
  const previousBitRef = useRef(bit)

  const {
    state: { optionsModalSelectedOption },
    setOptionsModalSelectedOption,
  } = useContext(UniversalContext)

  // Check if optionsModalSelectedOption is valid for the current bit
  const isValidForCurrentBit = (value) => {
    if (!value) {
      console.log('isValidForCurrentBit: value is falsy, returning false')
      return false
    }
    
    // Convert to string for comparison
    const stringValue = String(value).trim()
    console.log('isValidForCurrentBit: checking value:', stringValue, 'for bit:', bit)
    
    switch (bit) {
      case 'gender':
        // Only accept exact gender values - reject anything else
        // This includes country names, certificate types, etc.
        const isGender = stringValue === 'female' || stringValue === 'male'
        console.log('isValidForCurrentBit (gender): isGender =', isGender)
        if (!isGender) {
          // Explicitly reject country-like values
          const countryNames = [
            'South Africa', 'Philippines', 'Nigeria', 'Kenya', 'Ghana',
            'Zimbabwe', 'Botswana', 'Namibia', 'Mozambique', 'United States',
            'United Kingdom', 'Canada', 'Australia', 'India', 'Other'
          ]
          const containsCountryName = countryNames.some(name => stringValue.includes(name))
          console.log('isValidForCurrentBit (gender): containsCountryName =', containsCountryName)
          if (containsCountryName) {
            console.log('isValidForCurrentBit (gender): REJECTING - contains country name')
            return false
          }
        }
        console.log('isValidForCurrentBit (gender): returning', isGender)
        return isGender
      case 'certificateType':
        // Only accept exact certificate type values
        return (
          stringValue === 'certificate' ||
          stringValue === 'diploma' ||
          stringValue === 'degree'
        )
      case 'country':
        // Country values contain flag emojis (format: "🇿🇦 South Africa")
        // Check if value is in the optionsArray or contains a flag emoji pattern
        if (optionsArray && Array.isArray(optionsArray)) {
          return optionsArray.includes(stringValue)
        }
        // Fallback: check if it looks like a country format (contains flag emoji)
        return typeof stringValue === 'string' && /[\u{1F1E6}-\u{1F1FF}]{2}/u.test(stringValue)
      default:
        return false
    }
  }

  // Clear invalid values immediately when bit changes
  useEffect(() => {
    console.log('=== Cleanup useEffect (bit change) ===')
    console.log('previousBitRef.current:', previousBitRef.current)
    console.log('current bit:', bit)
    console.log('optionsModalSelectedOption:', optionsModalSelectedOption)
    
    if (previousBitRef.current !== bit) {
      console.log('Bit changed from', previousBitRef.current, 'to', bit)
      // Bit changed - clear invalid values immediately
      if (optionsModalSelectedOption) {
        const isValid = isValidForCurrentBit(optionsModalSelectedOption)
        console.log('isValid check result:', isValid)
        if (!isValid) {
          console.log('CLEARING invalid value:', optionsModalSelectedOption)
          setOptionsModalSelectedOption(null)
        }
      }
      previousBitRef.current = bit
    }
  }, [bit, optionsModalSelectedOption, setOptionsModalSelectedOption])

  // Also clear when optionsModalSelectedOption changes and is invalid
  useEffect(() => {
    if (optionsModalSelectedOption && !isValidForCurrentBit(optionsModalSelectedOption)) {
      setOptionsModalSelectedOption(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsModalSelectedOption])

  useEffect(() => {
    if (bit === 'certificateType' && !incomingValue)
      setPlaceholder('certification type')
    if (bit === 'certificateType' && incomingValue)
      setPlaceholder(incomingValue)
    if (bit === 'gender' && !incomingValue) setPlaceholder('gender')
    if (bit === 'gender' && incomingValue) setPlaceholder(incomingValue)
    if (bit === 'country' && !incomingValue && !selected) setPlaceholder('Select Country')
    if (bit === 'country' && (incomingValue || selected)) setPlaceholder(incomingValue || selected)
  }, [bit, incomingValue, selected])

  const getModalTitle = () => {
    switch (bit) {
      case 'gender':
        return 'Select Gender'
      case 'certificateType':
        return 'Select Certification Type'
      case 'country':
        return 'Select Country'
      default:
        return 'Select Option'
    }
  }

  const renderOption = (option, value, isSelected = false) => {
    const isClearOption = value === null
    return (
      <TouchableOpacity
        key={value || 'clear'}
        style={[
          styles.option,
          isSelected && styles.optionSelected,
          isClearOption && styles.optionClear,
        ]}
        onPress={() => {
          setOptionsModalSelectedOption(value)
          setShowModal(false)
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && styles.optionTextSelected,
            isClearOption && styles.optionTextClear,
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    )
  }

  // Compute the valid display value - ensure invalid values are never used
  // This MUST be called during render to filter invalid values immediately
  const getValidDisplayValue = () => {
    // DEBUG: Log current state
    console.log('=== OptionsModal Debug ===')
    console.log('bit:', bit)
    console.log('optionsModalSelectedOption:', optionsModalSelectedOption)
    console.log('selected:', selected)
    console.log('incomingValue:', incomingValue)
    
    // CRITICAL: Never return optionsModalSelectedOption if it's invalid for current bit
    // This prevents showing "South Africa" in gender field, etc.
    if (optionsModalSelectedOption) {
      const isValid = isValidForCurrentBit(optionsModalSelectedOption)
      console.log('isValidForCurrentBit result:', isValid)
      if (!isValid) {
        // Value is invalid - return null to force fallback
        // Don't return optionsModalSelectedOption even if it exists
        console.log('Value is INVALID - returning null')
        return null
      }
      // Value is valid for current bit
      console.log('Value is VALID - returning:', optionsModalSelectedOption)
      return optionsModalSelectedOption
    }
    
    // No optionsModalSelectedOption - fall back to selected or incomingValue
    const fallback = selected || incomingValue || null
    console.log('No optionsModalSelectedOption - returning fallback:', fallback)
    return fallback
  }
  
  // Get the display value once to avoid recalculating
  // This ensures invalid values are filtered BEFORE rendering
  const displayValue = getValidDisplayValue()
  console.log('Final displayValue:', displayValue)

  const appendOptions = () => {
    // Only use optionsModalSelectedOption if it's valid for the current bit
    const validModalSelection = isValidForCurrentBit(optionsModalSelectedOption)
      ? optionsModalSelectedOption
      : null
    const currentSelection = validModalSelection || selected || incomingValue

    switch (bit) {
      case 'gender':
        return (
          <ScrollView
            style={styles.optionsBedScroll}
            contentContainerStyle={styles.optionsBedContent}
            showsVerticalScrollIndicator={false}
          >
            {renderOption('Clear Selection', null)}
            {renderOption('Female', 'female', currentSelection === 'female')}
            {renderOption('Male', 'male', currentSelection === 'male')}
          </ScrollView>
        )
      case 'certificateType':
        return (
          <ScrollView
            style={styles.optionsBedScroll}
            contentContainerStyle={styles.optionsBedContent}
            showsVerticalScrollIndicator={false}
          >
            {renderOption('Clear Selection', null)}
            {renderOption(
              'Certificate',
              'certificate',
              currentSelection === 'certificate'
            )}
            {renderOption('Diploma', 'diploma', currentSelection === 'diploma')}
            {renderOption('Degree', 'degree', currentSelection === 'degree')}
          </ScrollView>
        )
      case 'country':
        if (!optionsArray || optionsArray.length === 0) return null
        return (
          <ScrollView
            style={styles.optionsBedScroll}
            contentContainerStyle={styles.optionsBedContent}
            showsVerticalScrollIndicator={false}
          >
            {renderOption('Clear Selection', null)}
            {optionsArray.map((option, index) => {
              const isSelected = currentSelection === option
              return renderOption(option, option, isSelected)
            })}
          </ScrollView>
        )
      default:
        return null
    }
  }

  const renderModal = () => {
    return (
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
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <AntDesign name="close" size={24} color="#ffff" />
              </TouchableOpacity>
            </View>
            {appendOptions()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    )
  }

  return (
    <>
      {renderModal()}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModal(true)}
      >
        <Text
          style={
            displayValue
              ? styles.buttonText
              : styles.buttonTextPlaceholder
          }
        >
          {displayValue || placeholder}
        </Text>
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
    justifyContent: 'center',
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

export default OptionsModal
