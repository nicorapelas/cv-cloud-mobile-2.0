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

const Template02 = ({
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

    // Handle "Month YYYY" format specifically
    if (
      typeof dateString === 'string' &&
      /^[A-Za-z]+ \d{4}$/.test(dateString)
    ) {
      const [month, year] = dateString.split(' ')
      const monthIndex = moment().month(month).format('M') - 1
      return moment([parseInt(year), monthIndex]).format('MMM YYYY')
    }

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString // Return original if can't parse
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    } catch (error) {
      return dateString // Return original if error
    }
  }

  // Helper function to render proficiency dots
  const renderProficiency = (level, currentStyles = styles) => {
    const maxLevel = 5
    const filledDots = Math.min(level || 0, maxLevel)
    const emptyDots = maxLevel - filledDots

    return (
      <View style={currentStyles.proficiencyContainer}>
        {[...Array(filledDots)].map((_, i) => (
          <View
            key={`filled-${i}`}
            style={[
              currentStyles.proficiencyDot,
              currentStyles.proficiencyDotFilled,
            ]}
          />
        ))}
        {[...Array(emptyDots)].map((_, i) => (
          <View key={`empty-${i}`} style={currentStyles.proficiencyDot} />
        ))}
      </View>
    )
  }

  // Helper function to render subjects array
  const renderSubjects = (subjects) => {
    if (!subjects || subjects.length === 0) return null

    if (Array.isArray(subjects)) {
      return subjects.map((subject, index) => (
        <Text key={index} style={styles.subjectText}>
          {typeof subject === 'object' ? subject.subject : subject}
          {index < subjects.length - 1 && ', '}
        </Text>
      ))
    }

    return <Text style={styles.subjectText}>{subjects}</Text>
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
                    <View style={currentStyles.photoSection}>
                      {data.assignedPhotoUrl &&
                        data.assignedPhotoUrl !== 'noneAssigned' && (
                          <Image
                            source={{ uri: data.assignedPhotoUrl }}
                            style={currentStyles.photo}
                            resizeMode="cover"
                          />
                        )}
                    </View>
                    <View style={currentStyles.infoSection}>
                      <Text style={currentStyles.name}>
                        {data.personalInfo?.fullName || 'Your Name'}
                      </Text>
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
                            <Text style={currentStyles.contactIcon}>📱</Text>
                            <Text style={currentStyles.contactText}>
                              {data.contactInfo.phone}
                            </Text>
                          </View>
                        )}
                        {data.contactInfo?.address && (
                          <View style={currentStyles.contactItem}>
                            <Text style={currentStyles.contactIcon}>📍</Text>
                            <Text style={currentStyles.contactText}>
                              {[
                                data.contactInfo.complex,
                                data.contactInfo.address,
                                data.contactInfo.unit,
                                data.contactInfo.suburb,
                                data.contactInfo.city,
                                data.contactInfo.province,
                                data.contactInfo.postalCode,
                                data.contactInfo.country,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Main Content */}
                <View style={currentStyles.content}>
                  {/* Personal Information */}
                  {data.personalInfo && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
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
                  {data.personalSummary?.content && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Professional Summary
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <Text style={currentStyles.summary}>
                          {data.personalSummary.content}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Work Experience */}
                  {data.employHistorys && data.employHistorys.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Employment history
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        {data.employHistorys.map((job, index) => (
                          <View
                            key={index}
                            style={currentStyles.experienceItem}
                          >
                            <View style={currentStyles.experienceHeader}>
                              <Text style={currentStyles.experienceTitle}>
                                {job.position}
                              </Text>
                              <Text style={currentStyles.experienceCompany}>
                                {job.company}
                              </Text>
                              <Text style={currentStyles.experienceDates}>
                                {formatDate(job.startDate)}
                                {job.endDate
                                  ? ` - ${formatDate(job.endDate)}`
                                  : ' - Present'}
                              </Text>
                            </View>
                            {job.description && (
                              <Text style={currentStyles.experienceDescription}>
                                {job.description}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Education */}
                  {((data.tertEdus && data.tertEdus.length > 0) ||
                    (data.secondEdu && data.secondEdu.length > 0)) && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Education
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        {/* Tertiary Education */}
                        {data.tertEdus &&
                          data.tertEdus.map((edu, index) => (
                            <View
                              key={`tert-${index}`}
                              style={currentStyles.educationItem}
                            >
                              <View style={currentStyles.educationHeader}>
                                <Text style={currentStyles.educationTitle}>
                                  {edu.certificationType} - {edu.instituteName}
                                </Text>
                                <Text style={currentStyles.educationDates}>
                                  {formatDate(edu.startDate)} -{' '}
                                  {formatDate(edu.endDate)}
                                </Text>
                              </View>
                              {edu.description && (
                                <Text
                                  style={currentStyles.educationDescription}
                                >
                                  {edu.description}
                                </Text>
                              )}
                              {edu.additionalInfo && (
                                <Text style={currentStyles.educationAdditional}>
                                  {edu.additionalInfo}
                                </Text>
                              )}
                            </View>
                          ))}

                        {/* Secondary Education */}
                        {data.secondEdu &&
                          data.secondEdu.map((edu, index) => (
                            <View
                              key={`second-${index}`}
                              style={currentStyles.educationItem}
                            >
                              <View style={currentStyles.educationHeader}>
                                <Text style={currentStyles.educationTitle}>
                                  {edu.schoolName}
                                </Text>
                                <Text style={currentStyles.educationDates}>
                                  {formatDate(edu.startDate)} -{' '}
                                  {formatDate(edu.endDate)}
                                </Text>
                              </View>
                              {edu.subjects && (
                                <View style={currentStyles.educationSubjects}>
                                  <Text
                                    style={currentStyles.educationSubjectsLabel}
                                  >
                                    Subjects:{' '}
                                  </Text>
                                  {renderSubjects(edu.subjects)}
                                </View>
                              )}
                            </View>
                          ))}
                      </View>
                    </View>
                  )}

                  {/* Skills */}
                  {data.skills && data.skills.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>Skills</Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.skillsGrid}>
                          {data.skills.map((skill, index) => (
                            <View key={index} style={currentStyles.skillItem}>
                              <Text
                                style={currentStyles.skillName}
                                numberOfLines={1}
                              >
                                {skill.skill || skill.name || 'Skill'}
                              </Text>
                              {renderProficiency(
                                skill.proficiency || skill.level || 3,
                                currentStyles
                              )}
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Languages */}
                  {data.languages && data.languages.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Languages
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.languagesGrid}>
                          {data.languages.map((language, index) => (
                            <View
                              key={index}
                              style={currentStyles.languageItem}
                            >
                              <Text style={currentStyles.languageName}>
                                {language.language}
                              </Text>
                              <View style={currentStyles.languageProficiency}>
                                <View
                                  style={currentStyles.languageProficiencyRow}
                                >
                                  <Text
                                    style={currentStyles.languageProficiencyLabel}
                                  >
                                    Read:{' '}
                                  </Text>
                                  {renderProficiency(
                                    language.read,
                                    currentStyles
                                  )}
                                </View>
                                <View
                                  style={currentStyles.languageProficiencyRow}
                                >
                                  <Text
                                    style={currentStyles.languageProficiencyLabel}
                                  >
                                    Write:{' '}
                                  </Text>
                                  {renderProficiency(
                                    language.write,
                                    currentStyles
                                  )}
                                </View>
                                <View
                                  style={currentStyles.languageProficiencyRow}
                                >
                                  <Text
                                    style={currentStyles.languageProficiencyLabel}
                                  >
                                    Speak:{' '}
                                  </Text>
                                  {renderProficiency(
                                    language.speak,
                                    currentStyles
                                  )}
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Experience */}
                  {data.experiences && data.experiences.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Experience
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        {data.experiences.map((experience, index) => (
                          <View
                            key={index}
                            style={currentStyles.experienceItem}
                          >
                            <View style={currentStyles.experienceHeader}>
                              <Text style={currentStyles.experienceTitle}>
                                {experience.title}
                              </Text>
                              {experience.company && (
                                <Text style={currentStyles.experienceCompany}>
                                  {experience.company}
                                </Text>
                              )}
                              {(experience.startDate || experience.endDate) && (
                                <Text style={currentStyles.experienceDates}>
                                  {formatDate(experience.startDate)}
                                  {experience.endDate
                                    ? ` - ${formatDate(experience.endDate)}`
                                    : ' - Present'}
                                </Text>
                              )}
                            </View>
                            {experience.description && (
                              <Text style={currentStyles.experienceDescription}>
                                {experience.description}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Interests */}
                  {data.interests && data.interests.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Interests
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.interestsList}>
                          {data.interests.map((interest, index) => (
                            <View key={index} style={currentStyles.interestTag}>
                              <Text style={currentStyles.interestText}>
                                {interest.interest}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Attributes */}
                  {data.attributes && data.attributes.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          Attributes
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.attributesList}>
                          {data.attributes.map((attribute, index) => (
                            <View key={index} style={currentStyles.attributeTag}>
                              <Text style={currentStyles.attributeText}>
                                {attribute.attribute}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* References */}
                  {data.references && data.references.length > 0 && (
                    <View style={currentStyles.section}>
                      <View style={currentStyles.sectionHeader}>
                        <Text style={currentStyles.sectionTitle}>
                          References
                        </Text>
                      </View>
                      <View style={currentStyles.sectionContent}>
                        <View style={currentStyles.referencesGrid}>
                          {data.references.map((reference, index) => (
                            <View
                              key={index}
                              style={currentStyles.referenceItem}
                            >
                              <Text style={currentStyles.referenceName}>
                                {reference.name}
                              </Text>
                              <Text style={currentStyles.referenceCompany}>
                                {reference.company}
                              </Text>
                              <View style={currentStyles.referenceContact}>
                                {reference.email && (
                                  <Text style={currentStyles.referenceEmail}>
                                    {reference.email}
                                  </Text>
                                )}
                                {reference.phone && (
                                  <Text style={currentStyles.referencePhone}>
                                    {reference.phone}
                                  </Text>
                                )}
                              </View>
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

// Base styles
const styles = StyleSheet.create({
  proficiencyContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  proficiencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  proficiencyDotFilled: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  subjectText: {
    fontSize: 12,
    color: '#6b7280',
  },
})

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
  },
  // Header styles
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  photoSection: {
    flexShrink: 0,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoSection: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  contactGrid: {
    flexDirection: 'column',
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactIcon: {
    fontSize: 12,
    width: 16,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1,
  },

  // Content styles
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
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  sectionContent: {
    paddingHorizontal: 12,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 6,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 6,
  },
  subSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  personalGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  personalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 6,
  },
  personalIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
  },
  personalLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#475569',
    minWidth: 80,
  },
  personalValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: '600',
  },
  summary: {
    fontSize: 11,
    lineHeight: 16,
    color: '#475569',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },

  // Experience items
  experienceItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 6,
  },
  experienceHeader: {
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 2,
  },
  experienceDates: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  experienceDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 14,
  },

  // Education items
  educationItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  educationHeader: {
    marginBottom: 8,
  },
  educationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  educationDates: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  educationDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 14,
    marginBottom: 4,
  },
  educationAdditional: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
  },
  educationSubjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  educationSubjectsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
  },

  // Skills grid
  skillsGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
    marginBottom: 0,
  },
  skillName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  proficiencyContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  proficiencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  proficiencyDotFilled: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },

  // Languages grid
  languagesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  languageItem: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  languageName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  languageProficiency: {
    flexDirection: 'column',
    gap: 4,
  },
  languageProficiencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageProficiencyLabel: {
    fontSize: 9,
    color: '#475569',
    minWidth: 40,
  },

  // Interests list
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '500',
  },

  // Attributes list
  attributesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attributeTag: {
    backgroundColor: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  attributeText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '500',
  },

  // References grid
  referencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  referenceItem: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minWidth: '45%',
    flex: 1,
    marginBottom: 6,
  },
  referenceName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  referenceCompany: {
    fontSize: 10,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 4,
  },
  referenceContact: {
    flexDirection: 'column',
  },
  referenceEmail: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 1,
  },
  referencePhone: {
    fontSize: 9,
    color: '#64748b',
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
    width: 570,
    minHeight: 750,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Header styles
  header: {
    backgroundColor: '#2563eb',
    padding: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  photoSection: {
    flexShrink: 0,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoSection: {
    flex: 1,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 18,
  },
  contactGrid: {
    flexDirection: 'column',
    gap: 9,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1,
  },

  // Content styles
  content: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderBottomWidth: 3,
    borderBottomColor: '#f59e0b',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  sectionContent: {
    paddingHorizontal: 18,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  subSection: {
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  personalGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  personalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 9,
  },
  personalIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  personalLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
    minWidth: 100,
  },
  personalValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 9,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },

  // Experience items
  experienceItem: {
    marginBottom: 24,
    padding: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 9,
  },
  experienceHeader: {
    marginBottom: 12,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 3,
  },
  experienceCompany: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 3,
  },
  experienceDates: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  experienceDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 21,
  },

  // Education items
  educationItem: {
    marginBottom: 18,
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 9,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  educationHeader: {
    marginBottom: 12,
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 3,
  },
  educationDates: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  educationDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 6,
  },
  educationAdditional: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  educationSubjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  educationSubjectsLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },

  // Skills grid
  skillsGrid: {
    flexDirection: 'column',
    gap: 18,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
    marginBottom: 0,
  },
  skillName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  proficiencyContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  proficiencyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  proficiencyDotFilled: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },

  // Languages grid
  languagesGrid: {
    flexDirection: 'column',
    gap: 18,
  },
  languageItem: {
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  languageProficiency: {
    flexDirection: 'column',
    gap: 6,
  },
  languageProficiencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageProficiencyLabel: {
    fontSize: 13,
    color: '#475569',
    minWidth: 60,
  },

  // Interests list
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestTag: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 18,
  },
  interestText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
  },

  // Attributes list
  attributesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  attributeTag: {
    backgroundColor: '#64748b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  attributeText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
  },

  // References grid
  referencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  referenceItem: {
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minWidth: '45%',
    flex: 1,
    marginBottom: 9,
  },
  referenceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 3,
  },
  referenceCompany: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 6,
  },
  referenceContact: {
    flexDirection: 'column',
  },
  referenceEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 1,
  },
  referencePhone: {
    fontSize: 13,
    color: '#64748b',
  },
})

export default Template02
