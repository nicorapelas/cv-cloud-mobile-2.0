import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native'
import moment from 'moment'

const Template01 = ({
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
}) => {
  // Use sample data if showSample is true and extract first item from arrays
  const data = {
    assignedPhotoUrl: showSample ? assignedPhotoUrlSample : assignedPhotoUrl,
    contactInfo: showSample ? contactInfoSample?.[0] : contactInfo?.[0],
    personalInfo: showSample ? personalInfoSample?.[0] : personalInfo?.[0],
    languages: showSample ? languageSample : languages,
    attributes: showSample ? attributeSample : attributes,
    interests: showSample ? interestSample : interests,
    skills: showSample ? skillSample : skills,
    references: showSample ? referenceSample : references,
    personalSummary: showSample
      ? personalSummarySample?.[0]
      : personalSummary?.[0],
    employHistorys: showSample ? employHistorySample : employHistorys,
    experiences: showSample ? experienceSample : experiences,
    secondEdu: showSample ? secondEduSample : secondEdu,
    tertEdus: showSample ? tertEduSample : tertEdus,
  }


  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''

    // Handle different date formats more robustly
    let momentDate
    try {
      // Check if it's a "Month YYYY" format first to avoid warnings
      if (
        typeof dateString === 'string' &&
        dateString.includes(' ') &&
        !dateString.includes('-') &&
        !dateString.includes('/')
      ) {
        momentDate = moment(dateString, 'MMMM YYYY')
      } else {
        // Try parsing with moment for other formats
        momentDate = moment(dateString)
      }

      // If moment can't parse it properly, try some common formats
      if (!momentDate.isValid()) {
        // Try ISO format
        momentDate = moment(dateString, moment.ISO_8601)

        // If still invalid, try other common formats
        if (!momentDate.isValid()) {
          momentDate = moment(dateString, [
            'YYYY-MM-DD',
            'MM/DD/YYYY',
            'DD/MM/YYYY',
          ])
        }
      }

      // If still invalid, return the original string
      if (!momentDate.isValid()) {
        return dateString
      }

      return momentDate.format('MMM YYYY')
    } catch (error) {
      // Silently fall back to original string if date formatting fails
      return dateString
    }
  }

  // Helper function to render proficiency dots
  const renderProficiency = (level) => {
    const maxLevel = 5
    const filledDots = Math.min(level, maxLevel)
    const emptyDots = maxLevel - filledDots

    return (
      <View style={currentStyles.skillLevel}>
        {[...Array(filledDots)].map((_, i) => (
          <View
            key={`filled-${i}`}
            style={[currentStyles.skillDot, currentStyles.skillDotFilled]}
          />
        ))}
        {[...Array(emptyDots)].map((_, i) => (
          <View key={`empty-${i}`} style={currentStyles.skillDot} />
        ))}
      </View>
    )
  }

  // Helper function to render subjects array
  const renderSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects)) return ''
    return subjects.map((subject) => subject.subject || subject).join(', ')
  }

  const renderZoomedOut = (currentStyles = stylesZoomedOut) => {
    return (
      <View style={currentStyles.bed}>
        {headerWithZoom()}
        <ScrollView style={{ backgroundColor: '#ffffff' }}>
          <ScrollView horizontal style={{ backgroundColor: '#ffffff' }}>
            <View style={currentStyles.cvBed}>
              <View style={currentStyles.container}>
                {/* Header Section */}
                <View style={currentStyles.header}>
                  <View style={currentStyles.headerContent}>
                    {data.assignedPhotoUrl &&
                      data.assignedPhotoUrl !== 'noneAssigned' && (
                        <Image
                          source={{ uri: data.assignedPhotoUrl }}
                          style={currentStyles.photo}
                          resizeMode="cover"
                        />
                      )}

                    <Text style={currentStyles.name}>
                      {data.personalInfo?.fullName || 'Your Name'}
                    </Text>

                    {/* Contact Info */}
                    <View style={currentStyles.contactGrid}>
                      {data.contactInfo?.email && (
                        <View style={currentStyles.contactItem}>
                          <Text style={currentStyles.contactIcon}>📧</Text>
                          <Text style={currentStyles.contactText}>
                            {data.contactInfo.email}
                          </Text>
                        </View>
                      )}
                      {data.contactInfo?.phone && (
                        <View style={currentStyles.contactItem}>
                          <Text style={currentStyles.contactIcon}>📞</Text>
                          <Text style={currentStyles.contactText}>
                            {data.contactInfo.phone}
                          </Text>
                        </View>
                      )}
                      {(data.contactInfo?.address ||
                        data.contactInfo?.suburb ||
                        data.contactInfo?.city) && (
                        <View style={currentStyles.contactItem}>
                          <Text style={currentStyles.contactIcon}>📍</Text>
                          <Text style={currentStyles.contactText}>
                            {[
                              data.contactInfo?.unit,
                              data.contactInfo?.complex,
                              data.contactInfo?.address,
                              data.contactInfo?.suburb,
                              data.contactInfo?.city,
                              data.contactInfo?.province,
                              data.contactInfo?.postalCode,
                              data.contactInfo?.country,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={currentStyles.content}>
                  {/* Personal Information */}
                  {data.personalInfo && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>👤</Text>{' '}
                          Personal Information
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.personalGrid}>
                          {data.personalInfo.dateOfBirth && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>📅</Text>
                              <Text style={currentStyles.personalLabel}>
                                Date of Birth:{' '}
                                <Text style={currentStyles.personalValue}>
                                  {moment(data.personalInfo.dateOfBirth).format(
                                    'MMMM D, YYYY'
                                  )}
                                </Text>
                              </Text>
                            </View>
                          )}
                          {data.personalInfo.gender && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>👤</Text>
                              <Text style={currentStyles.personalLabel}>
                                Gender:{' '}
                                <Text style={currentStyles.personalValue}>
                                  {data.personalInfo.gender}
                                </Text>
                              </Text>
                            </View>
                          )}
                          {data.personalInfo.nationality && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>🌍</Text>
                              <Text style={currentStyles.personalLabel}>
                                Nationality:{' '}
                                <Text style={currentStyles.personalValue}>
                                  {data.personalInfo.nationality}
                                </Text>
                              </Text>
                            </View>
                          )}
                          {data.personalInfo.driversLicense && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>🚗</Text>
                              <Text style={currentStyles.personalLabel}>
                                Driver's License:{' '}
                                <Text style={currentStyles.personalValue}>
                                  {data.personalInfo.licenseCode || 'Yes'}
                                </Text>
                              </Text>
                            </View>
                          )}
                          {data.personalInfo.idNumber && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>🆔</Text>
                              <Text style={currentStyles.personalLabel}>
                                ID Number:{' '}
                                <Text style={currentStyles.personalValue}>
                                  {data.personalInfo.idNumber}
                                </Text>
                              </Text>
                            </View>
                          )}
                          {data.personalInfo.ppNumber && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>📘</Text>
                              <Text style={currentStyles.personalLabel}>
                                Passport Number:{' '}
                                <Text style={currentStyles.personalValue}>
                                  {data.personalInfo.ppNumber}
                                </Text>
                              </Text>
                            </View>
                          )}
                          {data.personalInfo.saCitizen && (
                            <View style={currentStyles.personalItem}>
                              <Text style={currentStyles.personalIcon}>🇿🇦</Text>
                              <Text style={currentStyles.personalLabel}>
                                SA Citizen:{' '}
                                <Text style={currentStyles.personalValue}>
                                  Yes
                                </Text>
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Personal Summary */}
                  {data.personalSummary && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>📝</Text>{' '}
                          Professional Summary
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <Text style={currentStyles.itemDescription}>
                          {data.personalSummary?.content}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Employment History */}
                  {data.employHistorys && data.employHistorys.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>💼</Text>{' '}
                          Employment History
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        {data.employHistorys.map((history, index) => (
                          <View key={index} style={currentStyles.item}>
                            <View style={currentStyles.itemHeader}>
                              <Text style={currentStyles.itemTitle}>
                                {history.position}
                              </Text>
                              <Text style={currentStyles.itemDate}>
                                {formatDate(history.startDate)} -{' '}
                                {history.endDate
                                  ? formatDate(history.endDate)
                                  : 'Present'}
                              </Text>
                            </View>
                            <Text style={currentStyles.itemSubtitle}>
                              {history.company}
                            </Text>
                            {history.description && (
                              <Text style={currentStyles.itemDescription}>
                                {history.description}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Experience */}
                  {data.experiences && data.experiences.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>🎯</Text>{' '}
                          Experience
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        {data.experiences.map((experience, index) => (
                          <View key={index} style={currentStyles.item}>
                            <View style={currentStyles.itemHeader}>
                              <Text style={currentStyles.itemTitle}>
                                {experience.title}
                              </Text>
                              {(experience.startDate || experience.endDate) && (
                                <Text style={currentStyles.itemDate}>
                                  {experience.startDate
                                    ? formatDate(experience.startDate)
                                    : ''}{' '}
                                  {experience.startDate && experience.endDate
                                    ? '-'
                                    : ''}{' '}
                                  {experience.endDate
                                    ? formatDate(experience.endDate)
                                    : experience.startDate
                                      ? 'Present'
                                      : ''}
                                </Text>
                              )}
                            </View>
                            {experience.company && (
                              <Text style={currentStyles.itemSubtitle}>
                                {experience.company}
                              </Text>
                            )}
                            {experience.description && (
                              <Text style={currentStyles.itemDescription}>
                                {experience.description}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Education */}
                  {(data.secondEdu?.length > 0 ||
                    data.tertEdus?.length > 0) && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>🎓</Text>{' '}
                          Education
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        {data.tertEdus?.map((edu, index) => (
                          <View
                            key={`tert-${index}`}
                            style={currentStyles.item}
                          >
                            <View style={currentStyles.itemHeader}>
                              <Text style={currentStyles.itemTitle}>
                                {edu.certificationType || 'Tertiary Education'}
                              </Text>
                              <Text style={currentStyles.itemDate}>
                                {formatDate(edu.startDate)} -{' '}
                                {edu.endDate
                                  ? formatDate(edu.endDate)
                                  : 'Present'}
                              </Text>
                            </View>
                            {edu.instituteName && (
                              <Text style={currentStyles.itemSubtitle}>
                                {edu.instituteName}
                              </Text>
                            )}
                            {edu.description && (
                              <Text style={currentStyles.itemDescription}>
                                {edu.description}
                              </Text>
                            )}
                            {edu.additionalInfo && (
                              <Text style={currentStyles.itemDescription}>
                                {edu.additionalInfo}
                              </Text>
                            )}
                          </View>
                        ))}
                        {data.secondEdu?.map((edu, index) => (
                          <View
                            key={`second-${index}`}
                            style={currentStyles.item}
                          >
                            <View style={currentStyles.itemHeader}>
                              <Text style={currentStyles.itemTitle}>
                                {edu.schoolName || 'Secondary Education'}
                              </Text>
                              <Text style={currentStyles.itemDate}>
                                {formatDate(edu.startDate)} -{' '}
                                {edu.endDate
                                  ? formatDate(edu.endDate)
                                  : 'Present'}
                              </Text>
                            </View>
                            {edu.subjects && edu.subjects.length > 0 && (
                              <Text style={currentStyles.itemDescription}>
                                Subjects: {renderSubjects(edu.subjects)}
                              </Text>
                            )}
                            {edu.additionalInfo && (
                              <Text style={currentStyles.itemDescription}>
                                {edu.additionalInfo}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Skills, Languages & Interests - Combined Section */}
                  {(data.skills?.length > 0 ||
                    data.languages?.length > 0 ||
                    data.interests?.length > 0 ||
                    data.attributes?.length > 0) && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>🛠️</Text>{' '}
                          Skills, Languages, Interests & Attributes
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.twoColumnContainer}>
                          {/* Left Column: Skills & Languages */}
                          <View style={currentStyles.leftColumn}>
                            {/* Skills */}
                            {data.skills && data.skills.length > 0 && (
                              <View style={currentStyles.subSection}>
                                <Text style={currentStyles.subSectionTitle}>
                                  <Text style={currentStyles.sectionIcon}>🛠️</Text>{' '}
                                  Skills
                                </Text>
                                <View style={currentStyles.skillsGrid}>
                                  {data.skills.map((skill, index) => (
                                    <View
                                      key={index}
                                      style={currentStyles.skillItem}
                                    >
                                      <Text style={currentStyles.skillName}>
                                        {skill.skill}
                                      </Text>
                                      {renderProficiency(skill.level || 3)}
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}

                            {/* Languages */}
                            {data.languages && data.languages.length > 0 && (
                              <View style={currentStyles.subSection}>
                                <Text style={currentStyles.subSectionTitle}>
                                  <Text style={currentStyles.sectionIcon}>🌐</Text>{' '}
                                  Languages
                                </Text>
                                <View style={currentStyles.languagesContainer}>
                                  {data.languages.map((language, index) => (
                                    <View
                                      key={index}
                                      style={currentStyles.languageItem}
                                    >
                                      <Text style={currentStyles.languageName}>
                                        {language.language}
                                      </Text>
                                      <View style={currentStyles.languageSkills}>
                                        <View style={currentStyles.languageSkillRow}>
                                          <Text style={currentStyles.languageSkillLabel}>
                                            Read:
                                          </Text>
                                          {renderProficiency(language.read || 0)}
                                        </View>
                                        <View style={currentStyles.languageSkillRow}>
                                          <Text style={currentStyles.languageSkillLabel}>
                                            Write:
                                          </Text>
                                          {renderProficiency(language.write || 0)}
                                        </View>
                                        <View style={currentStyles.languageSkillRow}>
                                          <Text style={currentStyles.languageSkillLabel}>
                                            Speak:
                                          </Text>
                                          {renderProficiency(language.speak || 0)}
                                        </View>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                          </View>

                          {/* Right Column: Interests & Attributes */}
                          <View style={currentStyles.rightColumn}>
                            {data.interests && data.interests.length > 0 && (
                              <View style={currentStyles.subSection}>
                                <Text style={currentStyles.subSectionTitle}>
                                  <Text style={currentStyles.sectionIcon}>🎨</Text>{' '}
                                  Interests
                                </Text>
                                <View style={currentStyles.interestsColumn}>
                                  {data.interests.map((interest, index) => (
                                    <Text
                                      key={index}
                                      style={currentStyles.interestItem}
                                    >
                                      {interest.interest}
                                    </Text>
                                  ))}
                                </View>
                              </View>
                            )}

                            {/* Attributes */}
                            {data.attributes && data.attributes.length > 0 && (
                              <View style={currentStyles.subSection}>
                                <Text style={currentStyles.subSectionTitle}>
                                  <Text style={currentStyles.sectionIcon}>⭐</Text>{' '}
                                  Attributes
                                </Text>
                                <View style={currentStyles.attributesColumn}>
                                  {data.attributes.map((attribute, index) => (
                                    <Text
                                      key={index}
                                      style={currentStyles.attributeItem}
                                    >
                                      {attribute.attribute}
                                    </Text>
                                  ))}
                                </View>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* References */}
                  {data.references && data.references.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          <Text style={currentStyles.sectionIcon}>👥</Text>{' '}
                          References
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.referencesGrid}>
                          {data.references.map((reference, index) => (
                            <View key={index} style={currentStyles.referenceItem}>
                              <Text style={currentStyles.itemTitle}>
                                {reference.name}
                              </Text>
                              <Text style={currentStyles.itemSubtitle}>
                                {reference.position}
                              </Text>
                              <Text style={currentStyles.itemSubtitle}>
                                {reference.company}
                              </Text>
                              {reference.phone && (
                                <Text style={currentStyles.itemDescription}>
                                  Phone: {reference.phone}
                                </Text>
                              )}
                              {reference.email && (
                                <Text style={currentStyles.itemDescription}>
                                  Email: {reference.email}
                                </Text>
                              )}
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    )
  }

  const currentStyles = zoom === 'zoomedOut' ? stylesZoomedOut : stylesZoomedIn
  return renderZoomedOut(currentStyles)
}

// Styles for zoomed out view
const stylesZoomedOut = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    width: 380,
    minHeight: 500,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  header: {
    backgroundColor: '#278acd',
    padding: 16,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  contactGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  contactText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#278acd',
  },
  sectionIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  sectionContent: {
    paddingHorizontal: 8,
  },
  personalGrid: {
    flexDirection: 'column',
    gap: 6,
  },
  personalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    width: '100%',
    marginBottom: 4,
  },
  personalIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
    color: '#278acd',
  },
  personalLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
    minWidth: 60,
  },
  personalValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  item: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  itemDate: {
    fontSize: 7,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  itemSubtitle: {
    fontSize: 8,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 3,
    marginTop: 1,
  },
  itemDescription: {
    fontSize: 7,
    color: '#64748b',
    lineHeight: 11,
    marginTop: 2,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 6,
    minWidth: 0,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 6,
  },
  subSection: {
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#278acd',
    marginBottom: 6,
  },
  referencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  referenceItem: {
    width: '48%',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 4,
    minWidth: '45%',
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#f0f5fa',
    borderRadius: 4,
  },
  skillName: {
    fontSize: 8,
    color: '#1e293b',
    marginRight: 6,
    flex: 1,
  },
  skillLevel: {
    flexDirection: 'row',
    gap: 2,
  },
  skillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },
  skillDotFilled: {
    backgroundColor: '#f59e0b',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  languageItem: {
    width: '45%',
    paddingHorizontal: 4,
    paddingVertical: 5,
    marginBottom: 8,
    marginRight: 3,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  languageName: {
    fontSize: 8,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 4,
  },
  languageSkills: {
    flexDirection: 'column',
    gap: 3,
    paddingLeft: 8,
  },
  languageSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  languageSkillLabel: {
    fontSize: 7,
    color: '#64748b',
    fontWeight: '500',
  },
  interestsColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  interestItem: {
    fontSize: 7,
    color: '#64748b',
    lineHeight: 11,
    marginBottom: 2,
  },
  attributesColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  attributeItem: {
    fontSize: 7,
    color: '#64748b',
    lineHeight: 11,
    marginBottom: 2,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attributeTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#278acd',
    marginBottom: 4,
  },
  attributeText: {
    fontSize: 7,
    color: '#278acd',
    fontWeight: '600',
  },
})

// Styles for zoomed in view (same structure but larger)
const stylesZoomedIn = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    width: 760,
    minHeight: 1000,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  header: {
    backgroundColor: '#278acd',
    padding: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#278acd',
  },
  sectionIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  sectionContent: {
    paddingHorizontal: 12,
  },
  personalGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  personalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    width: '100%',
    marginBottom: 6,
  },
  personalIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
    color: '#278acd',
  },
  personalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    minWidth: 80,
  },
  personalValue: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  itemDate: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 14,
    marginTop: 3,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  subSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#278acd',
    marginBottom: 8,
  },
  referencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  referenceItem: {
    width: '48%',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 6,
    minWidth: '45%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f0f5fa',
    borderRadius: 6,
  },
  skillName: {
    fontSize: 10,
    color: '#1e293b',
    marginRight: 8,
    flex: 1,
  },
  skillLevel: {
    flexDirection: 'row',
    gap: 3,
  },
  skillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
  },
  skillDotFilled: {
    backgroundColor: '#f59e0b',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  languageItem: {
    width: '45%',
    paddingHorizontal: 5,
    paddingVertical: 7,
    marginBottom: 10,
    marginRight: 3,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  languageName: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 6,
  },
  languageSkills: {
    flexDirection: 'column',
    gap: 4,
    paddingLeft: 10,
  },
  languageSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  languageSkillLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '500',
  },
  interestsColumn: {
    flexDirection: 'column',
    gap: 6,
  },
  interestItem: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 14,
    marginBottom: 3,
  },
  attributesColumn: {
    flexDirection: 'column',
    gap: 6,
  },
  attributeItem: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 14,
    marginBottom: 3,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attributeTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#278acd',
    marginBottom: 6,
  },
  attributeText: {
    fontSize: 9,
    color: '#278acd',
    fontWeight: '600',
  },
})

export default Template01
