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

const Template07 = ({
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

  // Helper function to render proficiency bars
  const renderProficiency = (level) => {
    const percentage = Math.min((level / 5) * 100, 100)
    return (
      <View style={currentStyles.proficiencyContainer}>
        <View style={currentStyles.proficiencyBar}>
          <View
            style={[currentStyles.proficiencyFill, { width: `${percentage}%` }]}
          />
        </View>
        <Text style={currentStyles.proficiencyText}>{level}/5</Text>
      </View>
    )
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

  // Determine current styles based on zoom
  const currentStyles = zoom === 'zoomedIn' ? stylesZoomedIn : stylesZoomedOut

  const renderZoomedOut = (currentStyles) => {
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
                    <View style={currentStyles.headerLeft}>
                      <Text style={currentStyles.name}>
                        {data.personalInfo?.fullName || 'Professional Name'}
                      </Text>
                      <Text style={currentStyles.title}>
                        {data.personalSummary?.content?.split('.')[0] ||
                          'Financial Professional'}
                      </Text>
                      <View style={currentStyles.headerContact}>
                        {data.contactInfo?.email && (
                          <View style={currentStyles.contactItem}>
                            <Text style={currentStyles.contactIcon}>✉</Text>
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
                    {data.assignedPhotoUrl &&
                      data.assignedPhotoUrl !== 'noneAssigned' && (
                        <View style={currentStyles.headerRight}>
                          <Image
                            source={{ uri: data.assignedPhotoUrl }}
                            style={currentStyles.photo}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                  </View>
                </View>

                {/* Personal Information */}
                {data.personalInfo && (
                  <View style={currentStyles.section}>
                    <Text style={currentStyles.sectionTitle}>
                      PERSONAL INFORMATION
                    </Text>
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
                )}

                {/* Main Content */}
                <View style={currentStyles.main}>
                  {/* Professional Summary */}
                  {data.personalSummary?.content && (
                    <View style={currentStyles.section}>
                      <Text style={currentStyles.sectionTitle}>
                        PROFESSIONAL SUMMARY
                      </Text>
                      <Text style={currentStyles.summaryText}>
                        {data.personalSummary.content}
                      </Text>
                    </View>
                  )}

                  {/* Employment History */}
                  {data.employHistorys && data.employHistorys.length > 0 && (
                    <View style={currentStyles.section}>
                      <Text style={currentStyles.sectionTitle}>
                        EMPLOYMENT HISTORY
                      </Text>
                      {data.employHistorys.map((employment, index) => (
                        <View
                          key={index}
                          style={currentStyles.employmentItem}
                        >
                          <View style={currentStyles.employmentHeader}>
                            <Text style={currentStyles.employmentTitle}>
                              {employment.position}
                            </Text>
                            <Text style={currentStyles.employmentDate}>
                              {formatDate(employment.startDate)} -{' '}
                              {employment.endDate
                                ? formatDate(employment.endDate)
                                : 'Present'}
                            </Text>
                          </View>
                          <Text style={currentStyles.employmentCompany}>
                            {employment.company}
                          </Text>
                          {employment.description && (
                            <Text
                              style={currentStyles.employmentDescription}
                            >
                              {employment.description}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Experience */}
                  {data.experiences && data.experiences.length > 0 && (
                    <View style={currentStyles.section}>
                      <Text style={currentStyles.sectionTitle}>
                        EXPERIENCE
                      </Text>
                      {data.experiences.map((experience, index) => (
                        <View
                          key={index}
                          style={currentStyles.experienceItem}
                        >
                          <View style={currentStyles.experienceHeader}>
                            <Text style={currentStyles.experienceTitle}>
                              {experience.title}
                            </Text>
                            {experience.startDate && (
                              <Text style={currentStyles.experienceDate}>
                                {formatDate(experience.startDate)} -{' '}
                                {experience.endDate
                                  ? formatDate(experience.endDate)
                                  : 'Present'}
                              </Text>
                            )}
                          </View>
                          {experience.company && (
                            <Text style={currentStyles.experienceCompany}>
                              {experience.company}
                            </Text>
                          )}
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
                  )}

                  {/* Education */}
                  {((data.tertEdus && data.tertEdus.length > 0) ||
                    (data.secondEdu && data.secondEdu.length > 0)) && (
                    <View style={currentStyles.section}>
                      <Text style={currentStyles.sectionTitle}>
                        EDUCATION
                      </Text>
                      {/* Tertiary Education */}
                      {data.tertEdus &&
                        data.tertEdus.map((education, index) => (
                          <View
                            key={index}
                            style={currentStyles.educationItem}
                          >
                            <View style={currentStyles.educationHeader}>
                              <Text style={currentStyles.educationTitle}>
                                {education.certificationType} -{' '}
                                {education.instituteName}
                              </Text>
                              <Text style={currentStyles.educationDate}>
                                {formatDate(education.startDate)} -{' '}
                                {education.endDate
                                  ? formatDate(education.endDate)
                                  : 'Present'}
                              </Text>
                            </View>
                            {education.description && (
                              <Text
                                style={currentStyles.educationInstitution}
                              >
                                {education.description}
                              </Text>
                            )}
                            {education.additionalInfo && (
                              <Text style={currentStyles.educationAdditional}>
                                {education.additionalInfo}
                              </Text>
                            )}
                          </View>
                        ))}

                      {/* Secondary Education */}
                      {data.secondEdu &&
                        data.secondEdu.map((education, index) => (
                          <View
                            key={index}
                            style={currentStyles.educationItem}
                          >
                            <View style={currentStyles.educationHeader}>
                              <Text style={currentStyles.educationTitle}>
                                {education.schoolName}
                              </Text>
                              <Text style={currentStyles.educationDate}>
                                {formatDate(education.startDate)} -{' '}
                                {education.endDate
                                  ? formatDate(education.endDate)
                                  : 'Present'}
                              </Text>
                            </View>
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
                              <Text style={currentStyles.educationAdditional}>
                                {education.additionalInfo}
                              </Text>
                            )}
                          </View>
                        ))}
                    </View>
                  )}

                  {/* Skills, Languages, Interests & Attributes - Combined Section */}
                  {(data.skills?.length > 0 ||
                    data.languages?.length > 0 ||
                    data.interests?.length > 0 ||
                    data.attributes?.length > 0) && (
                    <View style={currentStyles.section}>
                      <Text style={currentStyles.sectionTitle}>
                        SKILLS, LANGUAGES, INTERESTS & ATTRIBUTES
                      </Text>
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
                                  key={index}
                                  style={currentStyles.skillItem}
                                >
                                  <Text style={currentStyles.skillName}>
                                    {skill.skill}
                                  </Text>
                                  {renderProficiency(skill.proficiency || 0)}
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
                                  key={index}
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
                                    key={index}
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
                                      key={index}
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
                  )}

                  {/* References */}
                  {data.references && data.references.length > 0 && (
                    <View style={currentStyles.section}>
                      <Text style={currentStyles.sectionTitle}>REFERENCES</Text>
                      <View style={currentStyles.referencesGrid}>
                        {data.references.map((reference, index) => (
                          <View key={index} style={currentStyles.referenceItem}>
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
                              <View style={currentStyles.referenceContactContainer}>
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

// Styles following Template01's proven patterns but with finance theme
const stylesZoomedOut = StyleSheet.create({
  bed: {
    backgroundColor: '#232936',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
    width: '100%',
  },
  cvBed: {
    width: 380,
    minHeight: 500,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Segoe UI',
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    color: '#e8f4fd',
    marginBottom: 12,
    opacity: 0.9,
  },
  headerContact: {
    flexDirection: 'column',
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
    textAlign: 'center',
    color: '#ffffff',
  },
  contactText: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.9,
  },
  headerRight: {
    flexShrink: 0,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  main: {
    padding: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3c72',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3c72',
    paddingBottom: 4,
  },
  summaryText: {
    fontSize: 10,
    color: '#2c3e50',
    lineHeight: 14,
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
    color: '#1e3c72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3c72',
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
  },
  personalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e3c72',
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
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  experienceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  experienceDate: {
    fontSize: 8,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  experienceCompany: {
    fontSize: 9,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 8,
    color: '#7f8c8d',
    lineHeight: 12,
  },
  employmentItem: {
    marginBottom: 14,
  },
  employmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  employmentTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  employmentDate: {
    fontSize: 8,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  employmentCompany: {
    fontSize: 9,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 4,
  },
  employmentDescription: {
    fontSize: 8,
    color: '#7f8c8d',
    lineHeight: 12,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  educationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  educationDate: {
    fontSize: 8,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  educationInstitution: {
    fontSize: 9,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 2,
  },
  educationSubjects: {
    marginTop: 8,
  },
  educationSubjectsLabel: {
    fontSize: 8,
    color: '#1e3c72',
    fontWeight: '600',
    marginBottom: 6,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  subjectTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  subjectTagText: {
    fontSize: 7,
    color: '#1976d2',
    fontWeight: '500',
  },
  educationAdditional: {
    fontSize: 8,
    color: '#7f8c8d',
    lineHeight: 12,
    marginTop: 6,
  },
  skillItem: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 9,
    color: '#2c3e50',
    marginBottom: 4,
    fontWeight: '600',
  },
  proficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proficiencyBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    marginRight: 8,
  },
  proficiencyFill: {
    height: '100%',
    backgroundColor: '#1e3c72',
    borderRadius: 2,
  },
  proficiencyText: {
    fontSize: 7,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  languageItem: {
    marginBottom: 8,
  },
  languageName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  languageProficiency: {
    fontSize: 8,
    color: '#7f8c8d',
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attributeTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  attributeText: {
    fontSize: 7,
    color: '#1976d2',
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9c27b0',
  },
  interestText: {
    fontSize: 7,
    color: '#7b1fa2',
    fontWeight: '600',
  },
  referencesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  referenceItem: {
    width: '100%',
    marginBottom: 0,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  referenceName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  referencePosition: {
    fontSize: 9,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 2,
  },
  referenceCompany: {
    fontSize: 9,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 4,
  },
  referenceContactContainer: {
    marginTop: 4,
  },
  referenceEmail: {
    fontSize: 8,
    color: '#7f8c8d',
    lineHeight: 11,
    marginBottom: 2,
  },
  referencePhone: {
    fontSize: 8,
    color: '#7f8c8d',
    lineHeight: 11,
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
    width: 760,
    minHeight: 1000,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Segoe UI',
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 30,
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 30,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#e8f4fd',
    marginBottom: 18,
    opacity: 0.9,
  },
  headerContact: {
    flexDirection: 'column',
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
    color: '#ffffff',
  },
  contactText: {
    fontSize: 15,
    color: '#ffffff',
    opacity: 0.9,
  },
  headerRight: {
    flexShrink: 0,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  main: {
    padding: 30,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3c72',
    paddingBottom: 6,
  },
  summaryText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 21,
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e3c72',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3c72',
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
  },
  personalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e3c72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personalValue: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 21,
  },
  experienceItem: {
    marginBottom: 18,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  experienceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  experienceDate: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  experienceCompany: {
    fontSize: 13,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 6,
  },
  experienceDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  employmentItem: {
    marginBottom: 18,
  },
  employmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  employmentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  employmentDate: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  employmentCompany: {
    fontSize: 13,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 6,
  },
  employmentDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  educationItem: {
    marginBottom: 18,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  educationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  educationDate: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  educationInstitution: {
    fontSize: 13,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 3,
  },
  educationSubjects: {
    marginTop: 10,
  },
  educationSubjectsLabel: {
    fontSize: 12,
    color: '#1e3c72',
    fontWeight: '600',
    marginBottom: 8,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  subjectTagText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '500',
  },
  educationAdditional: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
    marginTop: 8,
  },
  skillItem: {
    marginBottom: 12,
  },
  skillName: {
    fontSize: 13,
    color: '#2c3e50',
    marginBottom: 6,
    fontWeight: '600',
  },
  proficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proficiencyBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    marginRight: 12,
  },
  proficiencyFill: {
    height: '100%',
    backgroundColor: '#1e3c72',
    borderRadius: 3,
  },
  proficiencyText: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  languageItem: {
    marginBottom: 12,
  },
  languageName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  languageProficiency: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  attributeTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  attributeText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9c27b0',
  },
  interestText: {
    fontSize: 10,
    color: '#7b1fa2',
    fontWeight: '600',
  },
  referencesGrid: {
    flexDirection: 'column',
    gap: 18,
  },
  referenceItem: {
    width: '100%',
    marginBottom: 0,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  referenceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  referencePosition: {
    fontSize: 13,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 3,
  },
  referenceCompany: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 6,
  },
  referenceContactContainer: {
    marginTop: 6,
  },
  referenceEmail: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
    marginBottom: 3,
  },
  referencePhone: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
})

export default Template07
