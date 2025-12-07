import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { Context as PersonalInfoContext } from '../../../../../../context/PersonalInfoContext'

const DriversLicenceInput = ({ country = 'ZA' }) => {
  const {
    state: { driversLicense, licenseCode },
    setLicenseCode,
    setDirversLicense,
  } = useContext(PersonalInfoContext)

  const isSouthAfrica = country === 'ZA'
  const [showLicenseModal, setShowLicenseModal] = useState(false)

  // SA-specific license codes
  const saLicenseCodes = [
    { code: 'A', label: 'A - Motorcycle' },
    { code: 'A1', label: 'A1 - Light Motorcycle' },
    { code: 'B', label: 'B - Light Motor Vehicle' },
    { code: 'C1', label: 'C1 - Light Delivery Vehicle' },
    { code: 'C', label: 'C - Heavy Motor Vehicle' },
    { code: 'EB', label: 'EB - Light Motor Vehicle with Trailer' },
    { code: 'EC1', label: 'EC1 - Light Delivery Vehicle with Trailer' },
    { code: 'EC', label: 'EC - Heavy Motor Vehicle with Trailer' },
  ]

  const toggleDiversLicense = () => setDirversLicense(!driversLicense)

  const renderLicenseSwitch = () => {
    return (
      <View>
        <View style={styles.switchFieldBed}>
          <Text style={styles.switchFieldText}>drivers license?</Text>
          <Switch
            trackColor={{ false: '#ffff', true: '#81b0ff' }}
            thumbColor={driversLicense ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleDiversLicense}
            value={driversLicense}
          />
          <Text style={styles.switchFieldText}>
            {driversLicense ? 'yes' : 'no'}
          </Text>
        </View>
      </View>
    )
  }

  // Generic license types for non-South Africans
  const genericLicenseTypes = [
    { code: 'MOTORCYCLE', label: 'Motorcycle' },
    { code: 'LIGHT_MOTOR', label: 'Light motor vehicle' },
    { code: 'MEDIUM_COMMERCIAL', label: 'Medium commercial vehicle' },
    { code: 'HEAVY_COMMERCIAL', label: 'Heavy commercial vehicle' },
    { code: 'LIGHT_MOTOR_TRAILER', label: 'Light motor vehicle with trailer' },
    {
      code: 'MEDIUM_COMMERCIAL_TRAILER',
      label: 'Medium commercial vehicle with trailer',
    },
    {
      code: 'HEAVY_COMMERCIAL_TRAILER',
      label: 'Heavy commercial vehicle with trailer',
    },
  ]

  const handleLicenseSelect = (code) => {
    setLicenseCode(code)
    setShowLicenseModal(false)
  }

  const renderLicenseSelector = () => {
    if (!driversLicense) return null

    if (isSouthAfrica) {
      // South African license codes - Modal selector
      const selectedLicense = saLicenseCodes.find((l) => l.code === licenseCode)
      const displayValue = selectedLicense
        ? selectedLicense.label
        : 'Select License Code'

      return (
        <>
          <Text style={styles.licenseCodeInstruction}>
            select license code
          </Text>
          <Modal
            transparent={true}
            visible={showLicenseModal}
            animationType="fade"
            onRequestClose={() => setShowLicenseModal(false)}
          >
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={1}
              onPress={() => setShowLicenseModal(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                style={styles.modalBed}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select License Code</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowLicenseModal(false)}
                  >
                    <AntDesign name="close" size={24} color="#ffff" />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={styles.optionsBedScroll}
                  contentContainerStyle={styles.optionsBedContent}
                  showsVerticalScrollIndicator={false}
                >
                  {saLicenseCodes.map((license) => {
                    const isSelected = licenseCode === license.code
                    return (
                      <TouchableOpacity
                        key={license.code}
                        style={[
                          styles.option,
                          isSelected && styles.optionSelected,
                        ]}
                        onPress={() => handleLicenseSelect(license.code)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {license.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
          <TouchableOpacity
            style={styles.licenseButton}
            onPress={() => setShowLicenseModal(true)}
          >
            <Text
              style={
                selectedLicense
                  ? styles.licenseButtonText
                  : styles.licenseButtonTextPlaceholder
              }
            >
              {displayValue}
            </Text>
            <AntDesign name="down" size={16} color="#278acd" />
          </TouchableOpacity>
        </>
      )
    } else {
      // Generic license types for non-South Africans
      return (
        <>
          <Text style={styles.licenseCodeIntruction}>
            select license type
          </Text>
          {genericLicenseTypes.map((licenseType) => {
            const isSelected = licenseCode === licenseType.code
            return (
              <TouchableOpacity
                key={licenseType.code}
                style={[
                  styles.genericLicenseOption,
                  isSelected && styles.genericLicenseOptionSelected,
                ]}
                onPress={() => setLicenseCode(licenseType.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.genericLicenseText,
                    isSelected && styles.genericLicenseTextSelected,
                  ]}
                >
                  {licenseType.label}
                </Text>
                {isSelected && (
                  <AntDesign name="checkcircle" size={20} color="#278acd" />
                )}
              </TouchableOpacity>
            )
          })}
        </>
      )
    }
  }

  const renderContent = () => {
    return (
      <>
        {renderLicenseSwitch()}
        {renderLicenseSelector()}
      </>
    )
  }

  return renderContent()
}

const styles = StyleSheet.create({
  switchFieldBed: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  switchFieldText: {
    color: '#ffff',
    paddingHorizontal: 10,
  },
  licenseCodeInstruction: {
    color: '#ffff',
    alignSelf: 'center',
    paddingTop: 7,
    marginBottom: 15,
    fontSize: 16,
  },
  licenseButton: {
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
  licenseButtonTextPlaceholder: {
    color: '#B6B8BA',
  },
  licenseButtonText: {
    color: '#030303',
    fontSize: 16,
  },
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
  optionText: {
    color: '#ffff',
    fontSize: 16,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#ffff',
    fontWeight: '600',
  },
  genericLicenseOption: {
    backgroundColor: '#232936',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#ffff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  genericLicenseOptionSelected: {
    backgroundColor: '#278acd',
    borderColor: '#278acd',
  },
  genericLicenseText: {
    color: '#ffff',
    fontSize: 16,
    flex: 1,
  },
  genericLicenseTextSelected: {
    color: '#ffff',
    fontWeight: '600',
  },
})

export default DriversLicenceInput
