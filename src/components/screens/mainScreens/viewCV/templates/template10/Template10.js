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

const Template10 = ({
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
    try {
      return moment(dateString).format('MMM YYYY')
    } catch (error) {
      return dateString
    }
  }

  // Determine current styles based on zoom
  const currentStyles = zoom === 'zoomedIn' ? stylesZoomedIn : stylesZoomedOut

  // Helper function to format personal information for header
  const formatPersonalInfo = () => {
    if (!data.personalInfo) return 'Farming & Agriculture Specialist'
    
    const parts = []
    if (data.personalInfo.jobTitle) parts.push(data.personalInfo.jobTitle)
    if (data.personalInfo.dateOfBirth) {
      const age = moment().diff(moment(data.personalInfo.dateOfBirth), 'years')
      parts.push(`${age} years old`)
    }
    if (data.personalInfo.gender) parts.push(data.personalInfo.gender)
    if (data.personalInfo.nationality) parts.push(data.personalInfo.nationality)
    
    return parts.length > 0 ? parts.join(' • ') : 'Farming & Agriculture Specialist'
  }

  // Helper function to render subjects array
  const renderSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects)) return null
    return subjects.map((subject, index) => (
      <View key={subject._id || index} style={currentStyles.subjectTag}>
        <Text style={currentStyles.subjectTagText}>
          {subject.subject || subject}
        </Text>
      </View>
    ))
  }

  const renderZoomedOut = (currentStyles = stylesZoomedOut) => {
    return (
      <View style={currentStyles.bed}>
        {headerWithZoom()}
        <ScrollView style={{ backgroundColor: '#f8f9fa' }}>
          <ScrollView horizontal style={{ backgroundColor: '#f8f9fa' }}>
            <View style={currentStyles.cvBed}>
              <View style={currentStyles.container}>
                {/* Agriculture Header */}
                <View style={currentStyles.header}>
                  <View style={currentStyles.headerContent}>
                    <View style={currentStyles.logoSection}>
                      <View style={currentStyles.logo}>
                        <Text style={currentStyles.logoText}>🚜</Text>
                      </View>
                    </View>
                    <View style={currentStyles.titleSection}>
                      <Text style={currentStyles.name}>
                        {data.personalInfo?.fullName ||
                          'AGRICULTURAL PROFESSIONAL'}
                      </Text>
                      <Text style={currentStyles.title}>
                        {formatPersonalInfo()}
                      </Text>
                      <View style={currentStyles.headerDivider} />
                    </View>
                  </View>
                </View>

                {/* Contact Information */}
                <View style={currentStyles.contactSection}>
                  <View style={currentStyles.contactGrid}>
                    {data.contactInfo?.email && (
                      <View style={currentStyles.contactItem}>
                        <Text style={currentStyles.contactIcon}>📧</Text>
                        <View style={currentStyles.contactDetails}>
                          <Text style={currentStyles.contactLabel}>Email</Text>
                          <Text style={currentStyles.contactValue}>
                            {data.contactInfo.email}
                          </Text>
                        </View>
                      </View>
                    )}
                    {data.contactInfo?.phone && (
                      <View style={currentStyles.contactItem}>
                        <Text style={currentStyles.contactIcon}>📞</Text>
                        <View style={currentStyles.contactDetails}>
                          <Text style={currentStyles.contactLabel}>Phone</Text>
                          <Text style={currentStyles.contactValue}>
                            {data.contactInfo.phone}
                          </Text>
                        </View>
                      </View>
                    )}
                    {(data.contactInfo?.address ||
                      data.contactInfo?.suburb ||
                      data.contactInfo?.city) && (
                      <View style={currentStyles.contactItem}>
                        <Text style={currentStyles.contactIcon}>📍</Text>
                        <View style={currentStyles.contactDetails}>
                          <Text style={currentStyles.contactLabel}>
                            Location
                          </Text>
                          <Text style={currentStyles.contactValue}>
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
                      </View>
                    )}
                  </View>
                </View>

                {/* Photo Section */}
                {data.assignedPhotoUrl && (
                  <View style={currentStyles.photoSection}>
                    <Image
                      source={{ uri: data.assignedPhotoUrl }}
                      style={currentStyles.profilePhoto}
                    />
                  </View>
                )}

                {/* Personal Information */}
                {data.personalInfo && (
                  <View style={currentStyles.section}>
                    <View style={currentStyles.sectionHeader}>
                      <Text style={currentStyles.sectionIcon}>👤</Text>
                      <Text style={currentStyles.sectionTitle}>
                        PERSONAL INFORMATION
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      <View style={currentStyles.personalGrid}>
                        {data.personalInfo.dateOfBirth && (
                          <View style={currentStyles.personalItem}>
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

                {/* Professional Summary */}
                {data.personalSummary && (
                  <View style={currentStyles.section}>
                    <View style={currentStyles.sectionHeader}>
                      <Text style={currentStyles.sectionIcon}>🌱</Text>
                      <Text style={currentStyles.sectionTitle}>
                        PROFESSIONAL OVERVIEW
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      <View style={currentStyles.summaryBox}>
                        <Text style={currentStyles.summaryText}>
                          {data.personalSummary.content}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Employment History */}
                {data.employHistorys && data.employHistorys.length > 0 && (
                  <View style={currentStyles.section}>
                    <View style={currentStyles.sectionHeader}>
                      <Text style={currentStyles.sectionIcon}>🚜</Text>
                      <Text style={currentStyles.sectionTitle}>
                        EMPLOYMENT HISTORY
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      {data.employHistorys.map((employment, index) => (
                        <View
                          key={employment._id || index}
                          style={currentStyles.experienceItem}
                        >
                          <View style={currentStyles.experienceHeader}>
                            <Text style={currentStyles.experienceName}>
                              {employment.position || employment.jobTitle}
                            </Text>
                            {employment.startDate && (
                              <Text style={currentStyles.experienceDates}>
                                {formatDate(employment.startDate)} -{' '}
                                {employment.endDate
                                  ? formatDate(employment.endDate)
                                  : 'Present'}
                              </Text>
                            )}
                            {employment.company && (
                              <Text style={currentStyles.experienceCompany}>
                                {employment.company || employment.companyName}
                              </Text>
                            )}
                          </View>
                          {employment.description && (
                            <Text
                              style={currentStyles.experienceDescription}
                            >
                              {employment.description}
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
                      <Text style={currentStyles.sectionIcon}>⚙️</Text>
                      <Text style={currentStyles.sectionTitle}>
                        EXPERIENCE
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      {data.experiences.map((experience, index) => (
                        <View
                          key={experience._id || index}
                          style={currentStyles.experienceItem}
                        >
                          <View style={currentStyles.experienceHeader}>
                            <Text style={currentStyles.experienceName}>
                              {experience.title}
                            </Text>
                            {experience.startDate && (
                              <Text style={currentStyles.experienceDates}>
                                {formatDate(experience.startDate)} -{' '}
                                {experience.endDate
                                  ? formatDate(experience.endDate)
                                  : 'Present'}
                              </Text>
                            )}
                            {experience.company && (
                              <Text style={currentStyles.experienceCompany}>
                                {experience.company}
                              </Text>
                            )}
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
                    <View style={currentStyles.sectionHeader}>
                      <Text style={currentStyles.sectionIcon}>🎓</Text>
                      <Text style={currentStyles.sectionTitle}>
                        EDUCATION & TRAINING
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      {/* Tertiary Education */}
                      {data.tertEdus &&
                        data.tertEdus.map((education, index) => (
                          <View
                            key={education._id || index}
                            style={currentStyles.educationItem}
                          >
                            <Text style={currentStyles.educationName}>
                              {education.certificationType ||
                                'Agricultural Education'}
                            </Text>
                            <Text style={currentStyles.educationInstitution}>
                              {education.instituteName}
                            </Text>
                            {education.description && (
                              <Text
                                style={currentStyles.educationDescription}
                              >
                                {education.description}
                              </Text>
                            )}
                            {education.additionalInfo && (
                              <Text
                                style={currentStyles.educationAdditional}
                              >
                                {education.additionalInfo}
                              </Text>
                            )}
                          </View>
                        ))}

                      {/* Secondary Education */}
                      {data.secondEdu &&
                        data.secondEdu.map((education, index) => (
                          <View
                            key={education._id || index}
                            style={currentStyles.educationItem}
                          >
                            <Text style={currentStyles.educationName}>
                              Secondary Education
                            </Text>
                            <Text style={currentStyles.educationInstitution}>
                              {education.schoolName}
                            </Text>
                            {education.subjects &&
                              education.subjects.length > 0 && (
                                <View style={currentStyles.educationSubjects}>
                                  <Text style={currentStyles.educationSubjectsLabel}>
                                    Subjects:
                                  </Text>
                                  <View style={currentStyles.subjectsContainer}>
                                    {renderSubjects(education.subjects)}
                                  </View>
                                </View>
                              )}
                            {education.additionalInfo && (
                              <Text
                                style={currentStyles.educationAdditional}
                              >
                                {education.additionalInfo}
                              </Text>
                            )}
                          </View>
                        ))}
                    </View>
                  </View>
                )}

                {/* Skills, Languages, Interests & Attributes - Combined Section */}
                {(data.skills?.length > 0 ||
                  data.languages?.length > 0 ||
                  data.interests?.length > 0 ||
                  data.attributes?.length > 0) && (
                  <View style={currentStyles.section}>
                    <View style={currentStyles.sectionHeader}>
                      <Text style={currentStyles.sectionIcon}>⚙️</Text>
                      <Text style={currentStyles.sectionTitle}>
                        SKILLS, LANGUAGES, INTERESTS & ATTRIBUTES
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      <View style={currentStyles.twoColumnContainer}>
                        {/* Left Column: Skills & Languages */}
                        <View style={currentStyles.leftSubColumn}>
                          {/* Skills */}
                          {data.skills && data.skills.length > 0 && (
                            <View style={currentStyles.subSection}>
                              <Text style={currentStyles.subSectionTitle}>
                                Skills
                              </Text>
                              {data.skills.map((skill, index) => (
                                <View
                                  key={skill._id || index}
                                  style={currentStyles.skillItem}
                                >
                                  <Text style={currentStyles.skillName}>
                                    {skill.skill}
                                  </Text>
                                  <View style={currentStyles.skillLevel}>
                                    <View style={currentStyles.skillBar}>
                                      <View
                                        style={[
                                          currentStyles.skillProgress,
                                          {
                                            width: `${
                                              (skill.proficiency / 5) * 100
                                            }%`,
                                          },
                                        ]}
                                      />
                                    </View>
                                    <Text style={currentStyles.skillRating}>
                                      {skill.proficiency}/5
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}

                          {/* Languages */}
                          {data.languages && data.languages.length > 0 && (
                            <View style={currentStyles.subSection}>
                              <Text style={currentStyles.subSectionTitle}>
                                Languages
                              </Text>
                              {data.languages.map((language, index) => (
                                <View
                                  key={language._id || index}
                                  style={currentStyles.languageItem}
                                >
                                  <Text style={currentStyles.languageName}>
                                    {language.language}
                                  </Text>
                                  <Text
                                    style={currentStyles.languageProficiency}
                                  >
                                    Read: {language.read}/5 | Write:{' '}
                                    {language.write}/5 | Speak:{' '}
                                    {language.speak}/5
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>

                        {/* Right Column: Interests & Attributes */}
                        <View style={currentStyles.rightSubColumn}>
                          {/* Interests */}
                          {data.interests && data.interests.length > 0 && (
                            <View style={currentStyles.subSection}>
                              <Text style={currentStyles.subSectionTitle}>
                                Interests
                              </Text>
                              <View style={currentStyles.interestsGrid}>
                                {data.interests.map((interest, index) => (
                                  <View
                                    key={interest._id || index}
                                    style={currentStyles.interestTag}
                                  >
                                    <Text style={currentStyles.interestText}>
                                      {interest.interest}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}

                          {/* Attributes */}
                          {data.attributes &&
                            data.attributes.length > 0 && (
                              <View style={currentStyles.subSection}>
                                <Text style={currentStyles.subSectionTitle}>
                                  Attributes
                                </Text>
                                <View style={currentStyles.attributesGrid}>
                                  {data.attributes.map((attribute, index) => (
                                    <View
                                      key={attribute._id || index}
                                      style={currentStyles.attributeTag}
                                    >
                                      <Text
                                        style={currentStyles.attributeText}
                                      >
                                        {attribute.attribute}
                                      </Text>
                                    </View>
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
                      <Text style={currentStyles.sectionIcon}>🤝</Text>
                      <Text style={currentStyles.sectionTitle}>
                        REFERENCES
                      </Text>
                    </View>
                    <View style={currentStyles.sectionContent}>
                      {data.references.map((reference, index) => (
                        <View
                          key={reference._id || index}
                          style={currentStyles.referenceItem}
                        >
                          <Text style={currentStyles.referenceName}>
                            {reference.name}
                          </Text>
                          {reference.position && (
                            <Text style={currentStyles.referencePosition}>
                              {reference.position}
                            </Text>
                          )}
                          {reference.company && (
                            <Text style={currentStyles.referenceCompany}>
                              {reference.company}
                            </Text>
                          )}
                          {(reference.email || reference.phone) && (
                            <View style={currentStyles.referenceContact}>
                              {reference.email && (
                                <Text style={currentStyles.referenceEmail}>
                                  Email: {reference.email}
                                </Text>
                              )}
                              {reference.phone && (
                                <Text style={currentStyles.referencePhone}>
                                  Phone: {reference.phone}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Footer */}
                <View style={currentStyles.footer}>
                  <View style={currentStyles.footerContent}>
                    <Text style={currentStyles.footerIcon}>🌱</Text>
                    <Text style={currentStyles.footerText}>
                      Cultivating Excellence in Agriculture
                    </Text>
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

// Styles with 8px border radius as requested
const stylesZoomedOut = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
  },
  cvBed: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    width: 380,
    minHeight: 500,
    flex: 1,
    borderRadius: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2d5016',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logoSection: {
    flexShrink: 0,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: '#ffd700',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  logoText: {
    fontSize: 24,
    color: '#2d5016',
  },
  titleSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#ffd700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerDivider: {
    width: 80,
    height: 2,
    backgroundColor: '#ffd700',
    borderRadius: 1,
  },
  contactSection: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2d5016',
    borderRadius: 8,
  },
  contactGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactIcon: {
    fontSize: 16,
    width: 30,
    height: 30,
    backgroundColor: '#2d5016',
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 30,
    color: '#ffffff',
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#2d5016',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#2d5016',
  },
  sectionIcon: {
    fontSize: 14,
    width: 25,
    height: 25,
    backgroundColor: '#2d5016',
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 25,
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    paddingLeft: 10,
  },
  summaryBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2d5016',
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#2c3e50',
    textAlign: 'justify',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  leftSubColumn: {
    flex: 1,
    paddingRight: 8,
  },
  rightSubColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  subSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d5016',
    paddingBottom: 4,
  },
  personalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  personalItem: {
    minWidth: '45%',
    flex: 1,
    marginBottom: 6,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 3,
    borderLeftColor: '#2d5016',
  },
  personalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personalValue: {
    fontSize: 10,
    color: '#2c3e50',
    lineHeight: 14,
  },
  experienceItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#2d5016',
  },
  experienceHeader: {
    marginBottom: 6,
  },
  experienceName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 11,
    color: '#ffd700',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  experienceDates: {
    fontSize: 10,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  experienceDescription: {
    color: '#2c3e50',
    lineHeight: 14,
    fontSize: 10,
  },
  educationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  educationName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  educationInstitution: {
    fontSize: 10,
    color: '#4a7c59',
    fontWeight: '500',
    marginBottom: 4,
  },
  educationSubjects: {
    marginTop: 6,
  },
  educationSubjectsLabel: {
    fontSize: 8,
    color: '#2d5016',
    fontWeight: '600',
    marginBottom: 4,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  subjectTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  subjectTagText: {
    fontSize: 7,
    color: '#2d5016',
    fontWeight: '500',
  },
  educationAdditional: {
    fontSize: 9,
    color: '#4a7c59',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  educationDescription: {
    color: '#2c3e50',
    lineHeight: 13,
    fontSize: 9,
    fontStyle: 'italic',
  },
  educationAdditional: {
    color: '#6c757d',
    lineHeight: 12,
    fontSize: 8,
    fontStyle: 'italic',
  },
  educationSubjects: {
    marginTop: 6,
  },
  educationSubjectsLabel: {
    fontSize: 8,
    color: '#2d5016',
    fontWeight: '600',
    marginBottom: 4,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  subjectTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  subjectTagText: {
    fontSize: 7,
    color: '#2d5016',
    fontWeight: '500',
  },
  referenceItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
  },
  referenceName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  referencePosition: {
    fontSize: 10,
    color: '#4a7c59',
    fontWeight: '600',
    marginBottom: 2,
  },
  referenceCompany: {
    fontSize: 10,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 4,
  },
  referenceContact: {
    marginTop: 4,
  },
  referenceEmail: {
    fontSize: 9,
    color: '#6c757d',
    lineHeight: 11,
    marginBottom: 2,
  },
  referencePhone: {
    fontSize: 9,
    color: '#6c757d',
    lineHeight: 11,
  },
  skillItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 3,
    borderLeftColor: '#2d5016',
  },
  skillName: {
    fontWeight: '600',
    color: '#2d5016',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  skillLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#2d5016',
    borderRadius: 3,
  },
  skillRating: {
    fontSize: 8,
    color: '#2d5016',
    fontWeight: '600',
    minWidth: 25,
  },
  languageItem: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 3,
    borderLeftColor: '#4a7c59',
  },
  languageName: {
    fontWeight: '600',
    color: '#2d5016',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageProficiency: {
    color: '#4a7c59',
    fontWeight: '600',
    fontSize: 8,
    marginTop: 4,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attributeTag: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  attributeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d5016',
  },
  interestText: {
    color: '#2d5016',
    fontSize: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: '#2d5016',
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 8,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerIcon: {
    fontSize: 16,
    color: '#ffd700',
  },
  footerText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

const stylesZoomedIn = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
  },
  cvBed: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    width: 760,
    minHeight: 1000,
    flex: 1,
    borderRadius: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2d5016',
    padding: 30,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  logoSection: {
    flexShrink: 0,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#ffd700',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  logoText: {
    fontSize: 32,
    color: '#2d5016',
  },
  titleSection: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    color: '#ffd700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerDivider: {
    width: 120,
    height: 3,
    backgroundColor: '#ffd700',
    borderRadius: 2,
  },
  contactSection: {
    backgroundColor: '#ffffff',
    padding: 25,
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#2d5016',
    borderRadius: 8,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    minWidth: '45%',
    flex: 1,
  },
  contactIcon: {
    fontSize: 20,
    width: 40,
    height: 40,
    backgroundColor: '#2d5016',
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 40,
    color: '#ffffff',
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  contactValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 6,
    borderColor: '#2d5016',
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#2d5016',
  },
  sectionIcon: {
    fontSize: 18,
    width: 35,
    height: 35,
    backgroundColor: '#2d5016',
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 35,
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionContent: {
    paddingLeft: 47,
  },
  summaryBox: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#2d5016',
    borderLeftWidth: 6,
    borderLeftColor: '#ffd700',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2c3e50',
    textAlign: 'justify',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  leftSubColumn: {
    flex: 1,
    paddingRight: 10,
  },
  rightSubColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  subSection: {
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2d5016',
    paddingBottom: 6,
  },
  personalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  personalItem: {
    minWidth: '45%',
    flex: 1,
    marginBottom: 9,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#2d5016',
  },
  personalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personalValue: {
    fontSize: 12,
    color: '#2c3e50',
    lineHeight: 18,
  },
  experienceItem: {
    marginBottom: 18,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderLeftWidth: 6,
    borderLeftColor: '#2d5016',
  },
  experienceHeader: {
    marginBottom: 8,
  },
  experienceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  experienceCompany: {
    fontSize: 13,
    color: '#ffd700',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  experienceDates: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  experienceDescription: {
    color: '#2c3e50',
    lineHeight: 16,
    fontSize: 12,
  },
  educationItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderLeftWidth: 6,
    borderLeftColor: '#4a7c59',
  },
  educationName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  educationInstitution: {
    fontSize: 12,
    color: '#4a7c59',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  educationDescription: {
    color: '#2c3e50',
    lineHeight: 15,
    fontSize: 11,
    fontStyle: 'italic',
  },
  educationAdditional: {
    color: '#6c757d',
    lineHeight: 14,
    fontSize: 10,
    fontStyle: 'italic',
  },
  educationSubjects: {
    marginTop: 8,
  },
  educationSubjectsLabel: {
    fontSize: 10,
    color: '#2d5016',
    fontWeight: '600',
    marginBottom: 6,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  subjectTagText: {
    fontSize: 9,
    color: '#2d5016',
    fontWeight: '500',
  },
  referenceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderLeftWidth: 6,
    borderLeftColor: '#ffd700',
  },
  referenceName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d5016',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  referencePosition: {
    fontSize: 12,
    color: '#4a7c59',
    fontWeight: '600',
    marginBottom: 3,
  },
  referenceCompany: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 6,
  },
  referenceContact: {
    marginTop: 6,
  },
  referenceEmail: {
    fontSize: 11,
    color: '#6c757d',
    lineHeight: 15,
    marginBottom: 3,
  },
  referencePhone: {
    fontSize: 11,
    color: '#6c757d',
    lineHeight: 15,
  },
  skillItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#2d5016',
  },
  skillName: {
    fontWeight: '600',
    color: '#2d5016',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  skillLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  skillBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#2d5016',
    borderRadius: 4,
  },
  skillRating: {
    fontSize: 10,
    color: '#2d5016',
    fontWeight: '600',
    minWidth: 30,
  },
  languageItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  languageName: {
    fontWeight: '600',
    color: '#2d5016',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageProficiency: {
    color: '#4a7c59',
    fontWeight: '600',
    fontSize: 10,
    marginTop: 6,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attributeTag: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  attributeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2d5016',
  },
  interestText: {
    color: '#2d5016',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: '#2d5016',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerIcon: {
    fontSize: 20,
    color: '#ffd700',
  },
  footerText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
})

export default Template10
