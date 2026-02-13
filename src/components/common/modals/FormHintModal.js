import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native'
import {
  MaterialCommunityIcons,
  Octicons,
  FontAwesome5,
  AntDesign,
  MaterialIcons,
} from '@expo/vector-icons'

import { Context as UniversalContext } from '../../../context/UniversalContext'
import PhotoSamples from '../../common/PhotoSamples'

const FormHintModal = ({ bit }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [incomingBit, setIncomingBit] = useState('')

  const {
    state: { showPhotoSample },
    tipSelect,
  } = useContext(UniversalContext)

  useEffect(() => {
    setIncomingBit(bit)
  }, [])

  const renderHint = () => {
    if (incomingBit === 'attribute') return attributeHints()
    if (incomingBit === 'contactInfo') return contactInfoHints()
    if (incomingBit === 'interest') return interestHint()
    if (incomingBit === 'employmentHistory') return employmentHistoryHint()
    if (incomingBit === 'experience') return experienceHint()
    if (incomingBit === 'language') return languageHint()
    if (incomingBit === 'personalSummary') return personalSummaryHint()
    if (incomingBit === 'personalInfo') return personalInfoHint()
    if (incomingBit === 'photo') return photoHint()
    if (incomingBit === 'secondEdu') return secondEduHint()
    if (incomingBit === 'skill') return skillHints()
    if (incomingBit === 'shareCVSubject') return shareCVSubjectHint()
    if (incomingBit === 'shareCVMessage') return shareCVMessageHint()
    if (incomingBit === 'reference') return referenceHint()
    if (incomingBit === 'tertEdu') return tertEduHint()
    return null
  }

  const attributeHints = () => {
    return (
      <>
        <Text style={styles.subHeading}>Attrubute</Text>
        <Text style={styles.description}>
          Mention your qualities or characteristics.
        </Text>
        <Text style={styles.examplesIntro}>A few examples:</Text>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <TouchableOpacity
              onPress={() => {
                tipSelect('Confident')
                setModalVisible(false)
              }}
            >
              <Text style={styles.hintText}>Confident</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            The belief that you can do things well and that other people respect
            you.
          </Text>
        </View>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <TouchableOpacity
              onPress={() => {
                tipSelect('Adaptable')
                setModalVisible(false)
              }}
            >
              <Text style={styles.hintText}>Adaptable</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            An ability or willingness to change in order to suit different
            conditions.
          </Text>
        </View>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <TouchableOpacity
              onPress={() => {
                tipSelect('Positive')
                setModalVisible(false)
              }}
            >
              <Text style={styles.hintText}>Positive</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            The quality of having a positive attitude.
          </Text>
        </View>
      </>
    )
  }

  const contactInfoHints = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Contact information</Text>
        <Text style={styles.paragraph}>
          It's important to include all of your contact information on your CV.
          It allows employers to get in touch with you easily.
        </Text>
        <Text style={styles.paragraph}>
          Be sure to include any important details to your address, such as an
          apartment number. If you're concerned about privacy, consider listing
          just the city and suburb.
        </Text>
      </View>
    )
  }

  const employmentHistoryHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Employment history</Text>
        <Text style={styles.paragraph}>
          Sharing history of past employment is one of the most important
          sections on your CV. This will provide hiring managers functional
          proof of your skills.
        </Text>
        <Text style={styles.paragraph}>
          Avoid writing about every single job you’ve held. This overwhelms
          employers and makes them lose interest. Instead, only use previous
          work experience related to the opportunity you want.
        </Text>
      </View>
    )
  }

  const experienceHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Work experience</Text>
        <Text style={styles.paragraph}>
          This is where you mention part time jobs, volunteer work, projects,
          and other relevant experiences. Make sure your descriptions are clear
          and concise, yet descriptive.
        </Text>
      </View>
    )
  }

  const interestHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Interests or hobbies</Text>
        <Text style={styles.description}>
          This is where you add some personality to your CV, by sharing your
          favorite pastime "interests or hobbies"
        </Text>
        <Text style={styles.examplesIntro}>A few examples:</Text>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <TouchableOpacity
              onPress={() => {
                tipSelect('Sports')
                setModalVisible(false)
              }}
            >
              <Text style={styles.hintText}>Sports</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <TouchableOpacity
              onPress={() => {
                tipSelect('Gaming')
                setModalVisible(false)
              }}
            >
              <Text style={styles.hintText}>Gaming</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <TouchableOpacity
              onPress={() => {
                tipSelect('Traveling')
                setModalVisible(false)
              }}
            >
              <Text style={styles.hintText}>Traveling</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const languageHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Language</Text>
        <Text style={styles.paragraph}>
          Possessing proficiency in multiple languages can open a range of
          opportunities.
        </Text>
        <Text style={styles.paragraph}>
          When applying for jobs, listing your language skills on your CV can
          help make your CV more noticeable.
        </Text>
        <Text style={styles.paragraph}>
          The position you apply for may require knowledge of a certain
          language.
        </Text>
      </View>
    )
  }

  const personalInfoHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Personal information</Text>
        <Text style={styles.paragraph}>
          This is your opportunity to introduce yourself to a potential
          employer. The most important details to include
        </Text>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <Text style={styles.hintText}>Full Name</Text>
          </View>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <Text style={styles.hintText}>Date of birth</Text>
          </View>
        </View>
      </View>
    )
  }

  const personalSummaryHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Personal summary</Text>
        <Text style={styles.paragraph}>
          Your personal summary is a short paragraph that sits at the top of
          your CV, just below your name. Its purpose is to offer the recruiter a
          powerful overview of you as a professional.
        </Text>
        <Text style={styles.paragraph}>
          It should tell the reader about who you are, your suitability for the
          job offered, the value you can add and your career goals.
        </Text>
      </View>
    )
  }

  const secondEduHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Secondary education</Text>
        <Text style={styles.paragraph}>
          List the name of your high school and the years you attended. You can
          also mention one or two major achievements, such as being a team
          captain or being the president or founder of a club.
        </Text>
      </View>
    )
  }

  const skillHints = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Skills</Text>
        <Text style={styles.description}>
          Skills are part of the skill set that is required for a job. They
          include the expertise necessary for an individual to successfully do
          the job. They are job-specific and are typically listed in job
          postings and job description.
        </Text>
      </View>
    )
  }

  const photoHint = () => {
    return (
      <>
        {showPhotoSample ? null : (
          <View style={styles.hitBed}>
            <Text style={styles.subHeading}>Photo</Text>
            <Text style={styles.paragraph}>
              Things to concider when taking a photo for your CV:
            </Text>
            <View style={styles.hitBed}>
              <View style={styles.dotHintBed}>
                <Octicons style={styles.dot} name="dot-fill" />
                <Text style={styles.hintText}>
                  Your face should be clearly seen
                </Text>
              </View>
              <View style={styles.dotHintBed}>
                <Octicons style={styles.dot} name="dot-fill" />
                <Text style={styles.hintText}>Smile</Text>
                <FontAwesome5 name="smile-beam" style={styles.smileIcon} />
              </View>
              <View style={styles.dotHintBed}>
                <Octicons style={styles.dot} name="dot-fill" />
                <Text style={styles.hintText}>Good lighting</Text>
              </View>
              <View style={styles.dotHintBed}>
                <Octicons style={styles.dot} name="dot-fill" />
                <Text style={styles.hintText}>
                  Your hair should be neat and out of your face
                </Text>
              </View>
              <View style={styles.dotHintBed}>
                <Octicons style={styles.dot} name="dot-fill" />
                <Text style={styles.hintText}>
                  Make sure to use a clear, well focused photo
                </Text>
              </View>
            </View>
          </View>
        )}
        <PhotoSamples />
      </>
    )
  }

  const tertEduHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Teriary education</Text>
        <Text style={styles.paragraph}>
          List the name of your university or college and the years you
          attended. You can also provide a description of your diploma or
          degree.
        </Text>
      </View>
    )
  }

  const { height: screenHeight } = Dimensions.get('screen')
  const maxModalHeight = screenHeight * 0.8

  const renderModal = () => {
    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.messageBed, { height: maxModalHeight }]}>
            <View style={styles.headingBed}>
              {showPhotoSample ? null : (
                <MaterialCommunityIcons
                  style={styles.headingIcon}
                  name="lightbulb-on"
                />
              )}
            </View>
            <ScrollView
              style={styles.hintScrollView}
              contentContainerStyle={styles.hintScrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {renderHint()}
            </ScrollView>
            {showPhotoSample ? null : (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="cancel" style={styles.backButtonIcon} />
                <Text style={styles.backButtonText}>close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    )
  }

  const hintShowButton = () => {
    return (
      <TouchableOpacity
        style={styles.hintButtonContainer}
        onPress={() => {
          Keyboard.dismiss()
          requestAnimationFrame(() => {
            setTimeout(() => setModalVisible(true), 100)
          })
        }}
      >
        <MaterialCommunityIcons
          style={styles.hintButtonIcon}
          name="lightbulb-on"
        />
        <Text style={styles.hintButtonText}>hint</Text>
      </TouchableOpacity>
    )
  }

  const shareCVSubjectHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Subject</Text>
        <Text style={styles.description}>
          The subject line is the first thing the employer will see when
          deciding whether or not to open your message. Make sure your subject
          line clearly states the purpose of the message.
        </Text>
        <Text style={styles.examplesIntro}>Should include:</Text>
        <View style={styles.hitBed}>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <Text style={styles.hintText}>The job title</Text>
          </View>
          <View style={styles.dotHintBed}>
            <Octicons style={styles.dot} name="dot-fill" />
            <Text style={styles.hintText}>Your Name</Text>
          </View>
        </View>
        <Text style={styles.examplesIntro}>An example:</Text>
        <Text style={styles.description}>
          Communications Director Position - John Smith
        </Text>
      </View>
    )
  }

  const shareCVMessageHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Message</Text>
        <Text style={styles.paragraph}>
          Don't be afraid to brag a little bit about your achievments, this is
          the time to “sell” yourself.
        </Text>
        <Text style={styles.paragraph}>
          Begin your message by expressing your interest in the job opening,
          mention the job title by name and follow this with some of your
          previous experience.
        </Text>
        <Text style={styles.paragraph}>
          Focus on specific examples when explaining that you have certain
          qualities or skills. Make sure all of the information you include is
          directly related to the job for which you are applying.
        </Text>
      </View>
    )
  }

  const referenceHint = () => {
    return (
      <View style={styles.hitBed}>
        <Text style={styles.subHeading}>Reference</Text>
        <Text style={styles.paragraph}>
          Reference people who can vouch for your abilities and skills when
          applying for jobs.
        </Text>
        <Text style={styles.paragraph}>
          This includes people a prospective employer might contact to learn
          more information about you. These people should be able to speak to
          your qualifications for a job.
        </Text>
      </View>
    )
  }

  return (
    <View>
      {hintShowButton()}
      {renderModal()}
    </View>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  messageBed: {
    backgroundColor: '#232936',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 7,
    borderColor: '#7ac6fa',
    flexDirection: 'column',
  },
  hintScrollView: {
    flex: 1,
    minHeight: 0,
  },
  hintScrollContent: {
    paddingBottom: 12,
  },
  headingBed: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 5,
  },
  headingIcon: {
    color: '#7ac6fa',
    fontSize: 30,
    paddingLeft: 5,
  },
  subHeading: {
    color: '#7ac6fa',
    fontSize: 18,
    paddingBottom: 3,
  },
  hitBed: {
    paddingBottom: 7,
  },
  paragraph: {
    color: '#7ac6fa',
    paddingVertical: 2,
  },
  dotHintBed: {
    flexDirection: 'row',
    marginTop: 7,
  },
  dot: {
    color: '#7ac6fa',
    fontSize: 13,
    paddingRight: 5,
    paddingTop: 4,
  },
  hintText: {
    color: '#7ac6fa',
    fontSize: 14,
  },
  description: {
    color: '#7ac6fa',
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  backButtonIcon: {
    color: '#F9B321',
    paddingRight: 7,
    paddingTop: 2,
    fontSize: 20,
  },
  backButtonText: {
    color: '#F9B321',
    fontSize: 18,
  },
  hintButtonContainer: {
    marginTop: 10,
    paddingBottom: 5,
    width: 100,
    alignSelf: 'center',
  },
  examplesIntro: {
    color: '#7ac6fa',
    paddingVertical: 10,
  },
  hintButtonIcon: {
    color: '#F9B321',
    alignSelf: 'center',
    fontSize: 30,
    paddingBottom: 3,
  },
  hintButtonText: {
    color: '#F9B321',
    alignSelf: 'center',
  },
})

export default FormHintModal
