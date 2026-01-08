import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native'
import moment from 'moment'

const Template05 = ({
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
  showSample,
  zoom,
  headerWithZoom,
}) => {
  // Process data based on showSample flag
  const data = {
    personalInfo: showSample ? personalInfoSample?.[0] : personalInfo?.[0],
    contactInfo: showSample ? contactInfoSample?.[0] : contactInfo?.[0],
    languages: showSample ? languageSample : languages,
    attributes: showSample ? attributeSample : attributes,
    interests: showSample ? interestSample : interests,
    skills: showSample ? skillSample : skills,
    references: showSample ? referenceSample : references,
    secondEdu: showSample ? secondEduSample : secondEdu,
    tertEdus: showSample ? tertEduSample : tertEdus,
    personalSummary: showSample
      ? personalSummarySample?.[0]
      : personalSummary?.[0],
    employHistorys: showSample ? employHistorySample : employHistorys,
    experiences: showSample ? experienceSample : experiences,
  }


  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''

    // Handle different date formats more robustly
    let momentDate

    // Try parsing as ISO date first
    if (moment(dateString, moment.ISO_8601, true).isValid()) {
      momentDate = moment(dateString)
    }
    // Try parsing as "Month YYYY" format
    else if (moment(dateString, 'MMMM YYYY', true).isValid()) {
      momentDate = moment(dateString, 'MMMM YYYY')
    }
    // Try parsing as "MMM YYYY" format
    else if (moment(dateString, 'MMM YYYY', true).isValid()) {
      momentDate = moment(dateString, 'MMM YYYY')
    }
    // Try parsing as "YYYY-MM" format
    else if (moment(dateString, 'YYYY-MM', true).isValid()) {
      momentDate = moment(dateString, 'YYYY-MM')
    }
    // Fallback to default parsing
    else {
      momentDate = moment(dateString)
    }

    // Check if the date is valid
    if (!momentDate.isValid()) {
      return dateString // Return original string if parsing fails
    }

    return momentDate.format('MMM YYYY')
  }

  // Helper function to render proficiency dots
  const renderProficiency = (level) => {
    const dots = []
    const maxDots = 5
    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <View
          key={i}
          style={[
            currentStyles.proficiencyDot,
            i < level && currentStyles.proficiencyDotFilled,
          ]}
        />
      )
    }
    return <View style={currentStyles.proficiencyContainer}>{dots}</View>
  }

  // Helper function to render subjects
  const renderSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects)) return ''
    return subjects.map((subject) => subject.subject || subject).join(', ')
  }

  // Determine current styles based on zoom
  const currentStyles = zoom === 'zoomedIn' ? stylesZoomedIn : stylesZoomedOut

  const renderZoomedOut = (currentStyles) => {
    return (
      <View style={currentStyles.bed}>
        {headerWithZoom()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#ffffff' }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: '#ffffff' }}
          >
            <View style={currentStyles.cvBed}>
              <View style={currentStyles.container}>
                {/* Header Section */}
                <View style={currentStyles.header}>
                  <View style={currentStyles.headerContent}>
                    {assignedPhotoUrl && (
                      <View style={currentStyles.photoContainer}>
                        <Image
                          source={{ uri: assignedPhotoUrl }}
                          style={currentStyles.photo}
                        />
                      </View>
                    )}
                    <View style={currentStyles.headerInfo}>
                      <Text style={currentStyles.name}>
                        {data.personalInfo?.fullName || 'Your Name'}
                      </Text>
                      <View style={currentStyles.contact}>
                        {data.contactInfo?.email && (
                          <View style={currentStyles.contactItem}>
                            <Text style={currentStyles.contactIcon}>✉️</Text>
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
                                data.contactInfo?.complex,
                                data.contactInfo?.address,
                                data.contactInfo?.unit,
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
                </View>

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

                {/* Main Content */}
                <View style={currentStyles.main}>
                  {/* Left Sidebar */}
                  <View style={currentStyles.sidebar}>
                    {/* Personal Summary */}
                    {data.personalSummary?.content && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>About</Text>
                        <Text style={currentStyles.summary}>
                          {data.personalSummary.content}
                        </Text>
                      </View>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>Skills</Text>
                        <View style={currentStyles.skills}>
                          {data.skills.map((skill, index) => (
                            <View key={index} style={currentStyles.skillItem}>
                              <Text style={currentStyles.skillName}>
                                {skill.skill}
                              </Text>
                              <View style={currentStyles.skillLevel}>
                                {renderProficiency(skill.level || 3)}
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>
                          Languages
                        </Text>
                        <View style={currentStyles.languages}>
                          {data.languages.map((language, index) => (
                            <View
                              key={index}
                              style={currentStyles.languageItem}
                            >
                              <Text style={currentStyles.languageName}>
                                {language.language}
                              </Text>
                              <View style={currentStyles.languageProficiency}>
                                <View style={currentStyles.proficiencyRow}>
                                  <Text style={currentStyles.proficiencyLabel}>
                                    Read:{' '}
                                  </Text>
                                  {renderProficiency(language.read)}
                                </View>
                                <View style={currentStyles.proficiencyRow}>
                                  <Text style={currentStyles.proficiencyLabel}>
                                    Write:{' '}
                                  </Text>
                                  {renderProficiency(language.write)}
                                </View>
                                <View style={currentStyles.proficiencyRow}>
                                  <Text style={currentStyles.proficiencyLabel}>
                                    Speak:{' '}
                                  </Text>
                                  {renderProficiency(language.speak)}
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Attributes */}
                    {data.attributes && data.attributes.length > 0 && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>
                          Attributes
                        </Text>
                        <View style={currentStyles.attributes}>
                          {data.attributes.map((attribute, index) => (
                            <View
                              key={index}
                              style={currentStyles.attributeItem}
                            >
                              <Text style={currentStyles.attributeBullet}>
                                •
                              </Text>
                              <Text style={currentStyles.attributeText}>
                                {attribute.attribute}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Interests */}
                    {data.interests && data.interests.length > 0 && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>
                          Interests
                        </Text>
                        <View style={currentStyles.interests}>
                          {data.interests.map((interest, index) => (
                            <View key={index} style={currentStyles.interestTag}>
                              <Text style={currentStyles.interestTagText}>
                                {interest.interest}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Right Content */}
                  <View style={currentStyles.content}>
                    {/* Work Experience */}
                    {data.employHistorys && data.employHistorys.length > 0 && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>
                          Employment history
                        </Text>
                        <View style={currentStyles.experience}>
                          {data.employHistorys.map((job, index) => (
                            <View
                              key={index}
                              style={currentStyles.experienceItem}
                            >
                              <View style={currentStyles.experienceHeader}>
                                <Text style={currentStyles.experienceTitle}>
                                  {job.position || job.jobTitle}
                                </Text>
                                <View style={currentStyles.experienceMeta}>
                                  <Text style={currentStyles.company}>
                                    {job.company || job.companyName}
                                  </Text>
                                  <Text style={currentStyles.dates}>
                                    {formatDate(job.startDate)} -{' '}
                                    {job.endDate
                                      ? formatDate(job.endDate)
                                      : 'Present'}
                                  </Text>
                                </View>
                              </View>
                              {job.description && (
                                <Text
                                  style={currentStyles.experienceDescription}
                                >
                                  {job.description}
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
                        <Text style={currentStyles.sectionTitle}>
                          Experience
                        </Text>
                        <View style={currentStyles.experience}>
                          {data.experiences.map((experience, index) => (
                            <View
                              key={index}
                              style={currentStyles.experienceItem}
                            >
                              <View style={currentStyles.experienceHeader}>
                                <Text style={currentStyles.experienceTitle}>
                                  {experience.title}
                                </Text>
                                <View style={currentStyles.experienceMeta}>
                                  {experience.company && (
                                    <Text style={currentStyles.company}>
                                      {experience.company}
                                    </Text>
                                  )}
                                  {experience.startDate && (
                                    <Text style={currentStyles.dates}>
                                      {formatDate(experience.startDate)} -{' '}
                                      {experience.endDate
                                        ? formatDate(experience.endDate)
                                        : 'Present'}
                                    </Text>
                                  )}
                                </View>
                              </View>
                              {experience.description && (
                                <Text
                                  style={currentStyles.experienceDescription}
                                >
                                  {experience.description}
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
                        <Text style={currentStyles.sectionTitle}>
                          Education
                        </Text>
                        <View style={currentStyles.education}>
                          {/* Tertiary Education */}
                          {data.tertEdus &&
                            data.tertEdus.map((edu, index) => (
                              <View
                                key={`tert-${index}`}
                                style={currentStyles.educationItem}
                              >
                                <View style={currentStyles.educationHeader}>
                                  <Text style={currentStyles.educationTitle}>
                                    {edu.certificationType} -{' '}
                                    {edu.instituteName}
                                  </Text>
                                  <Text style={currentStyles.educationDates}>
                                    {formatDate(edu.startDate)} -{' '}
                                    {edu.endDate
                                      ? formatDate(edu.endDate)
                                      : 'Present'}
                                  </Text>
                                </View>
                                {edu.description && (
                                  <Text
                                    style={currentStyles.educationDescription}
                                  >
                                    {edu.description}
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
                                {edu.subjects && edu.subjects.length > 0 && (
                                  <View style={currentStyles.educationSubjects}>
                                    <Text
                                      style={
                                        currentStyles.educationSubjectsLabel
                                      }
                                    >
                                      Subjects:{' '}
                                      <Text style={currentStyles.subject}>
                                        {renderSubjects(edu.subjects)}
                                      </Text>
                                    </Text>
                                  </View>
                                )}
                                {edu.additionalInfo && (
                                  <Text
                                    style={currentStyles.educationDescription}
                                  >
                                    {edu.additionalInfo}
                                  </Text>
                                )}
                              </View>
                            ))}
                        </View>
                      </View>
                    )}

                    {/* References */}
                    {data.references && data.references.length > 0 && (
                      <View style={currentStyles.section}>
                        <Text style={currentStyles.sectionTitle}>
                          References
                        </Text>
                        <View style={currentStyles.references}>
                          {data.references.map((reference, index) => (
                            <View
                              key={index}
                              style={currentStyles.referenceItem}
                            >
                              <Text style={currentStyles.referenceName}>
                                {reference.name}
                              </Text>
                              <Text style={currentStyles.referenceTitle}>
                                {reference.title}
                              </Text>
                              <Text style={currentStyles.referenceCompany}>
                                {reference.company}
                              </Text>
                              {reference.phone && (
                                <Text style={currentStyles.referenceContact}>
                                  📞 {reference.phone}
                                </Text>
                              )}
                              {reference.email && (
                                <Text style={currentStyles.referenceContact}>
                                  ✉️ {reference.email}
                                </Text>
                              )}
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    )
  }

  return renderZoomedOut(currentStyles)
}

// Zoomed Out Styles
const stylesZoomedOut = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    minWidth: 800,
    minHeight: 1000,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 20,
  },
  header: {
    backgroundColor: '#0d1117',
    padding: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff00',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  photoContainer: {
    flexShrink: 0,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ff00',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 255, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  contact: {
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactIcon: {
    fontSize: 14,
    width: 16,
    textAlign: 'center',
  },
  contactText: {
    color: '#f0f6fc',
    fontSize: 12,
  },
  main: {
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#0d1117',
    padding: 20,
    borderRightWidth: 2,
    borderRightColor: '#00ff00',
  },
  content: {
    flex: 1,
    padding: 20,
    maxWidth: 550,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    backgroundColor: '#161b22',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff00',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00ff00',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    borderBottomWidth: 2,
    borderBottomColor: '#00ff00',
    paddingBottom: 6,
  },
  sectionIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  sectionContent: {
    paddingHorizontal: 12,
  },
  personalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  personalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#161b22',
    borderRadius: 8,
    minWidth: '45%',
    flex: 1,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  personalIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
    color: '#00ff00',
  },
  personalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8b949e',
    minWidth: 80,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  personalValue: {
    fontSize: 12,
    color: '#f0f6fc',
    fontWeight: '500',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  summary: {
    color: '#8b949e',
    lineHeight: 20,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  skills: {
    gap: 10,
  },
  skillItem: {
    flexDirection: 'column',
    gap: 8,
    padding: 10,
    backgroundColor: '#161b22',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff00',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  skillName: {
    fontWeight: '500',
    color: '#f0f6fc',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  skillLevel: {
    flexDirection: 'row',
    gap: 3,
  },
  proficiencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#30363d',
    borderWidth: 1,
    borderColor: '#21262d',
  },
  proficiencyDotFilled: {
    backgroundColor: '#00ff00',
    borderColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  languages: {
    gap: 12,
  },
  languageItem: {
    backgroundColor: '#161b22',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  languageName: {
    fontWeight: '600',
    color: '#f0f6fc',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  languageProficiency: {
    gap: 4,
  },
  proficiencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proficiencyLabel: {
    color: '#8b949e',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    flexShrink: 0,
  },
  proficiencyContainer: {
    flexDirection: 'row',
    gap: 3,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  attributes: {
    gap: 8,
  },
  attributeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    backgroundColor: '#161b22',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  attributeBullet: {
    color: '#00ff00',
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  attributeText: {
    color: '#f0f6fc',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  interestTagText: {
    color: '#0d1117',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  experience: {
    gap: 14,
  },
  experienceItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  experienceHeader: {
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  experienceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  company: {
    fontWeight: '500',
    color: '#3498db',
  },
  dates: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  experienceDescription: {
    color: '#5a6c7d',
    lineHeight: 18,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  education: {
    gap: 14,
  },
  educationItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  educationHeader: {
    marginBottom: 6,
  },
  educationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  educationDates: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  educationDescription: {
    color: '#5a6c7d',
    lineHeight: 18,
    marginTop: 8,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  educationSubjects: {
    marginVertical: 6,
  },
  educationSubjectsLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  subject: {
    color: '#5a6c7d',
  },
  references: {
    gap: 12,
  },
  referenceItem: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
    alignItems: 'center',
  },
  referenceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  referenceTitle: {
    fontWeight: '500',
    color: '#3498db',
    marginBottom: 4,
  },
  referenceCompany: {
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '500',
  },
  referenceContact: {
    color: '#5a6c7d',
    fontSize: 11,
    marginVertical: 2,
  },
})

// Zoomed In Styles (scaled up version)
const stylesZoomedIn = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    minWidth: 1200,
    minHeight: 1500,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.15,
    shadowRadius: 60,
    elevation: 30,
  },
  header: {
    backgroundColor: '#0d1117',
    padding: 45,
    borderBottomWidth: 3,
    borderBottomColor: '#00ff00',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  photoContainer: {
    flexShrink: 0,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 6,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 36,
    fontWeight: '700',
    color: '#00ff00',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 255, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  contact: {
    gap: 9,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    fontSize: 21,
    width: 24,
    textAlign: 'center',
  },
  contactText: {
    color: '#f0f6fc',
    fontSize: 18,
  },
  main: {
    flexDirection: 'row',
  },
  sidebar: {
    width: 375,
    backgroundColor: '#0d1117',
    padding: 30,
    borderRightWidth: 3,
    borderRightColor: '#00ff00',
  },
  content: {
    flex: 1,
    padding: 30,
    maxWidth: 825,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    backgroundColor: '#161b22',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff00',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#00ff00',
    marginBottom: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    borderBottomWidth: 3,
    borderBottomColor: '#00ff00',
    paddingBottom: 9,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 9,
  },
  sectionContent: {
    paddingHorizontal: 18,
  },
  personalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  personalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#161b22',
    borderRadius: 12,
    minWidth: '45%',
    flex: 1,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  personalIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    color: '#00ff00',
  },
  personalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8b949e',
    minWidth: 120,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  personalValue: {
    fontSize: 18,
    color: '#f0f6fc',
    fontWeight: '500',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  summary: {
    color: '#8b949e',
    lineHeight: 30,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  skills: {
    gap: 14,
  },
  skillItem: {
    flexDirection: 'column',
    gap: 12,
    padding: 15,
    backgroundColor: '#161b22',
    borderRadius: 9,
    borderLeftWidth: 6,
    borderLeftColor: '#00ff00',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  skillName: {
    fontWeight: '500',
    color: '#f0f6fc',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  skillLevel: {
    flexDirection: 'row',
    gap: 4,
  },
  proficiencyContainer: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  proficiencyDot: {
    width: 9,
    height: 9,
    borderRadius: 4,
    backgroundColor: '#30363d',
    borderWidth: 1,
    borderColor: '#21262d',
  },
  proficiencyDotFilled: {
    backgroundColor: '#00ff00',
    borderColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 9,
    elevation: 4,
  },
  languages: {
    gap: 16,
  },
  languageItem: {
    backgroundColor: '#161b22',
    padding: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  languageName: {
    fontWeight: '600',
    color: '#f0f6fc',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  languageProficiency: {
    gap: 6,
  },
  proficiencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proficiencyLabel: {
    color: '#8b949e',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
  },
  attributes: {
    gap: 12,
  },
  attributeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#161b22',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  attributeBullet: {
    color: '#00ff00',
    fontSize: 21,
    marginRight: 12,
    marginTop: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  attributeText: {
    color: '#f0f6fc',
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  interestTag: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  interestTagText: {
    color: '#0d1117',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  experience: {
    gap: 18,
  },
  experienceItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#e74c3c',
  },
  experienceHeader: {
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  experienceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  company: {
    fontWeight: '500',
    color: '#3498db',
  },
  dates: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  experienceDescription: {
    color: '#5a6c7d',
    lineHeight: 27,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  education: {
    gap: 18,
  },
  educationItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#27ae60',
  },
  educationHeader: {
    marginBottom: 8,
  },
  educationTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  educationDates: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  educationDescription: {
    color: '#5a6c7d',
    lineHeight: 27,
    marginTop: 12,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  educationSubjects: {
    marginVertical: 9,
  },
  educationSubjectsLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  subject: {
    color: '#5a6c7d',
  },
  references: {
    gap: 16,
  },
  referenceItem: {
    padding: 22,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#9b59b6',
    alignItems: 'center',
  },
  referenceName: {
    fontSize: 21,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  referenceTitle: {
    fontWeight: '500',
    color: '#3498db',
    marginBottom: 6,
  },
  referenceCompany: {
    color: '#7f8c8d',
    marginBottom: 12,
    fontWeight: '500',
  },
  referenceContact: {
    color: '#5a6c7d',
    fontSize: 16,
    marginVertical: 3,
  },
})

export default Template05
