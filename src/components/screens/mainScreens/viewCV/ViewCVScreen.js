import React, { useEffect, useContext, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Text,
  Modal,
  FlatList,
} from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'

import LoaderWithText from '../../../common/LoaderWithText'
import logo from '../../../../../assets/images/logo-h79.png'

// Import templates
import CurrentTemplate from './templates/current/CurrentTemplate'
import Template01 from './templates/template01/Template01'
import Template02 from './templates/template02/Template02'
import Template03 from './templates/template03/Template03'
import Template04 from './templates/template04/Template04'
import Template05 from './templates/template05/Template05'
import Template06 from './templates/template06/Template06'
import Template07 from './templates/template07/Template07'
import Template08 from './templates/template08/Template08'
import Template09 from './templates/template09/Template09'
import Template10 from './templates/template10/Template10'

import { Context as AttributeContext } from '../../../../context/AttributeContext'
import { Context as ContactInfoContext } from '../../../../context/ContactInfoContext'
import { Context as EmployHistoryContext } from '../../../../context/EmployHistoryContext'
import { Context as ExperienceContext } from '../../../../context/ExperienceContext'
import { Context as InterestContext } from '../../../../context/InterestContext'
import { Context as LanguageContext } from '../../../../context/LanguageContext'
import { Context as PersonalInfoContext } from '../../../../context/PersonalInfoContext'
import { Context as PersonalSummaryContext } from '../../../../context/PersonalSummaryContext'
import { Context as PhotoContext } from '../../../../context/PhotoContext'
import { Context as ReferenceContext } from '../../../../context/ReferenceContext'
import { Context as SecondEduContext } from '../../../../context/SecondEduContext'
import { Context as SkillContext } from '../../../../context/SkillContext'
import { Context as TertEduContext } from '../../../../context/TertEduContext'

const ViewCVScreen = () => {
  const [zoom, setZoom] = useState('zoomedOut')
  const [showSample, setShowSample] = useState(false)
  const [showSampleButton, setShowSampleButton] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState('template01') // Template01 as default
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)

  // Template options for dropdown
  const templateOptions = [
    { value: 'template01', label: 'Modern' },
    { value: 'template02', label: 'Clean' },
    { value: 'template03', label: 'Creative' },
    { value: 'template04', label: 'Dark' },
    { value: 'template05', label: 'Tech' },
    { value: 'template06', label: 'Newspaper' },
    { value: 'template07', label: 'Finance' },
    { value: 'template08', label: 'Menu' },
    { value: 'template09', label: 'Industrial' },
    { value: 'template10', label: 'Agriculture' },
  ]

  // Helper functions for dropdown
  const getSelectedTemplateLabel = () => {
    const selected = templateOptions.find(
      (option) => option.value === selectedTemplate
    )
    return selected ? selected.label : 'Modern'
  }

  const handleTemplateSelect = (templateValue) => {
    setSelectedTemplate(templateValue)
    setShowTemplateDropdown(false)
  }

  const {
    state: { loading: loadingAttribute, attributes, attributeSample },
    fetchAttributeSample,
  } = useContext(AttributeContext)

  const {
    state: { loading: loadingContactInfo, contactInfo, contactInfoSample },
    fetchContactInfoSample,
  } = useContext(ContactInfoContext)

  const {
    state: {
      loading: loadingEmployHistory,
      employHistorys,
      employHistorySample,
    },
    fetchEmployHistorySample,
  } = useContext(EmployHistoryContext)

  const {
    state: { loading: loadingExperience, experiences, experienceSample },
    fetchExperienceSample,
  } = useContext(ExperienceContext)

  const {
    state: { loading: loadingInterest, interests, interestSample },
    fetchInterestSample,
  } = useContext(InterestContext)

  const {
    state: { loading: loadingLanguage, languages, languageSample },
    fetchLanguageSample,
  } = useContext(LanguageContext)

  const {
    state: {
      loading: loadingPersonalInfo,
      personalInfo,
      viewHeading,
      personalInfoSample,
      viewHeadingSample,
    },
    fetchViewHeading,
    fetchPersonalInfoSample,
    fetchViewHeadingSample,
  } = useContext(PersonalInfoContext)

  const {
    state: {
      loading: loadingPersonalSummary,
      personalSummary,
      personalSummarySample,
    },
    fetchPersonalSummarySample,
  } = useContext(PersonalSummaryContext)

  const {
    state: { loading: loadingPhoto, assignedPhotoUrl, assignedPhotoUrlSample },
    fetchAssignedPhoto,
    fetchPhotoSample,
  } = useContext(PhotoContext)

  const {
    state: { loading: loadingReference, references, referenceSample },
    fetchReferenceSample,
  } = useContext(ReferenceContext)

  const {
    state: { loading: loadingSecondEdu, secondEdu, secondEduSample },
    fetchSecondEduSample,
  } = useContext(SecondEduContext)

  const {
    state: { loading: loadingSkill, skills, skillSample },
    fetchSkillSample,
    fetchSkills,
  } = useContext(SkillContext)

  const {
    state: { loading: loadingTertEdu, tertEdus, tertEduSample },
    fetchTertEduSample,
  } = useContext(TertEduContext)

  useEffect(() => {
    userRedirect()
  }, [contactInfo, personalInfo])

  useEffect(() => {
    fetchAttributeSample()
    fetchContactInfoSample()
    fetchEmployHistorySample()
    fetchExperienceSample()
    fetchInterestSample()
    fetchLanguageSample()
    fetchViewHeading()
    fetchPersonalInfoSample()
    fetchViewHeadingSample()
    fetchPersonalSummarySample()
    fetchAssignedPhoto()
    fetchPhotoSample()
    fetchReferenceSample()
    fetchSecondEduSample()
    fetchSkillSample()
    fetchSkills()
    fetchTertEduSample()
  }, [])

  const userRedirect = () => {
    if (personalInfo === null || contactInfo === null) return null
    if (personalInfo.length < 1 && contactInfo.length < 1) {
      // navigation.navigate('StartUpCreate')
    }
  }

  const headerWithZoom = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Top Row: Logo and Zoom Controls */}
        <View style={styles.bed}>
          <Image style={styles.logo} source={logo} resizeMode="contain" />
          <View style={styles.zoomButtonsContainer}>
            <View style={styles.zoomButtonsBed}>
              <TouchableOpacity onPress={() => setZoom('zoomedOut')}>
                <Text
                  style={
                    zoom === 'zoomedOut'
                      ? styles.zoomedButtonTextActive
                      : styles.zoomedButtonText
                  }
                >
                  -
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setZoom('zoomedIn')}>
                <Text
                  style={
                    zoom === 'zoomedIn'
                      ? styles.zoomedButtonTextActive
                      : styles.zoomedButtonText
                  }
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Row: Template Selector Dropdown */}
        <View style={styles.templateSelector}>
          <Text style={styles.templateLabel}>Template:</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowTemplateDropdown(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {getSelectedTemplateLabel()}
            </Text>
            <AntDesign name="down" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Template Dropdown Modal */}
        <Modal
          visible={showTemplateDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTemplateDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTemplateDropdown(false)}
          >
            <View style={styles.dropdownContainer}>
              <FlatList
                data={templateOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      selectedTemplate === item.value &&
                        styles.dropdownItemActive,
                    ]}
                    onPress={() => handleTemplateSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedTemplate === item.value &&
                          styles.dropdownItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedTemplate === item.value && (
                      <MaterialIcons name="check" size={16} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }

  // Template rendering function
  const renderTemplate = () => {
    const templateProps = {
      // Data props
      assignedPhotoUrl,
      assignedPhotoUrlSample,
      contactInfo,
      contactInfoSample,
      personalInfo,
      personalInfoSample,
      languages,
      languageSample,
      attributes,
      attributeSample,
      interests,
      interestSample,
      skills,
      skillSample,
      references,
      referenceSample,
      viewHeading,
      viewHeadingSample,
      personalSummary,
      personalSummarySample,
      employHistorys,
      employHistorySample,
      experiences,
      experienceSample,
      secondEdu,
      secondEduSample,
      tertEdus,
      tertEduSample,
      // UI props
      showSample,
      zoom,
      headerWithZoom,
    }

    switch (selectedTemplate) {
      case 'template01':
        return <Template01 {...templateProps} />
      case 'template02':
        return <Template02 {...templateProps} />
      case 'template03':
        return <Template03 {...templateProps} />
      case 'template04':
        return <Template04 {...templateProps} />
      case 'template05':
        return <Template05 {...templateProps} />
      case 'template06':
        return <Template06 {...templateProps} />
      case 'template07':
        return <Template07 {...templateProps} />
      case 'template08':
        return <Template08 {...templateProps} />
      case 'template09':
        return <Template09 {...templateProps} />
      case 'template10':
        return <Template10 {...templateProps} />
      case 'current':
        return <CurrentTemplate {...templateProps} />
      default:
        return <Template01 {...templateProps} />
    }
  }

  const renderContent = () => {
    if (
      loadingAttribute ||
      loadingContactInfo ||
      loadingEmployHistory ||
      loadingExperience ||
      loadingInterest ||
      loadingLanguage ||
      loadingPersonalInfo ||
      loadingPersonalSummary ||
      loadingPhoto ||
      loadingReference ||
      loadingSkill ||
      loadingSecondEdu ||
      loadingTertEdu ||
      personalInfo === null ||
      contactInfo === null
    ) {
      return <LoaderWithText mainText="Building your CV" />
    }
    return renderTemplate()
  }

  const cvSampleButton = () => {
    if (
      !showSampleButton ||
      loadingAttribute ||
      loadingContactInfo ||
      loadingEmployHistory ||
      loadingExperience ||
      loadingInterest ||
      loadingLanguage ||
      loadingPersonalInfo ||
      loadingPersonalSummary ||
      loadingPhoto ||
      loadingReference ||
      loadingSkill ||
      loadingSecondEdu ||
      loadingTertEdu
    )
      return null
    return (
      <View style={styles.viewCvSampleButtonBed}>
        <TouchableOpacity
          style={styles.viewCvSampleCloseButton}
          onPress={() => {
            setShowSampleButton(false)
            setShowSample(false)
          }}
        >
          <AntDesign style={styles.viewCvSampleCloseButtonIcon} name="close" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewCvSampleButton}
          onPress={() => setShowSample(!showSample)}
        >
          <Text style={styles.viewCvSampleButtonText}>
            {!showSample ? 'View' : 'Hide'}
          </Text>
          <Text style={styles.viewCvSampleButtonText}>Sample</Text>
          <Text style={styles.viewCvSampleButtonText}>CV</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      {renderContent()}
      {cvSampleButton()}
    </>
  )
}

const stylesZoomedOut = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    backgroundColor: '#ffff',
    marginTop: 5,
    marginLeft: 10,
    width: 380,
    flexDirection: 'row',
  },
  leftColumn: {
    backgroundColor: '#278ACD',
    width: '30%',
    paddingRight: 1,
  },
  rightColumn: {
    backgroundColor: '#ffff',
    width: '70%',
  },
  leftFooter: {
    backgroundColor: '#278ACD',
    height: 20,
  },
  rightFooter: {
    backgroundColor: '#ffff',
    height: 20,
  },
})

const stylesZoomedIn = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    backgroundColor: '#ffff',
    marginTop: 5,
    width: 793,
    flexDirection: 'row',
  },
  leftColumn: {
    backgroundColor: '#278ACD',
    width: '30%',
  },
  rightColumn: {
    backgroundColor: '#ffff',
    width: '70%',
  },
  leftFooter: {
    backgroundColor: '#278ACD',
    height: 20,
  },
  rightFooter: {
    backgroundColor: '#ffff',
    height: 20,
  },
})

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
  },
  bed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -40,
  },
  logo: {
    width: 150,
    marginBottom: -23,
    marginLeft: 10,
  },
  templateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  templateLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 100,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemActive: {
    backgroundColor: '#f8f9fa',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  zoomButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  zoomButtonsBed: {
    flexDirection: 'row',
  },
  zoomedButtonText: {
    color: '#ffff',
    fontSize: 30,
    paddingRight: 30,
  },
  zoomedButtonTextActive: {
    color: '#808080',
    fontSize: 30,
    paddingRight: 30,
  },
  viewCvSampleCloseButton: {
    alignSelf: 'flex-end',
  },
  viewCvSampleCloseButtonIcon: {
    fontSize: 16,
  },
  viewCvSampleButtonBed: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  viewCvSampleButton: {
    backgroundColor: '#065b948c',
    borderRadius: 25,
    padding: 10,
    textAlign: 'center',
  },
  viewCvSampleButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
})

export default ViewCVScreen
