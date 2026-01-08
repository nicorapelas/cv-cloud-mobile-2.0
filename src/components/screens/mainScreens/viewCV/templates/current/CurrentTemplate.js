import React from 'react'
import { View, ScrollView, StyleSheet, Platform } from 'react-native'

import ViewBitPhoto from '../../cvViewBits/ViewBitPhoto'
import ViewBitHeading from '../../cvViewBits/ViewBitHeading'
import ViewBitPersonalSummary from '../../cvViewBits/ViewBitPersonalSummary'
import ViewBitContactInfo from '../../cvViewBits/ViewBitContactInfo'
import ViewBitPersonalInfo from '../../cvViewBits/ViewBitPersonalInfo'
import ViewBitLanguage from '../../cvViewBits/ViewBitLanguage'
import ViewBitEmployHistory from '../../cvViewBits/ViewBitEmployHistory'
import ViewBitAttribute from '../../cvViewBits/ViewBitAttribute'
import ViewBitExperience from '../../cvViewBits/ViewBitExperience'
import ViewBitSkill from '../../cvViewBits/ViewBitSkill'
import ViewBitSecondEdu from '../../cvViewBits/ViewBitSecondEdu'
import ViewBitTertEdu from '../../cvViewBits/ViewBitTertEdu'
import ViewBitReference from '../../cvViewBits/ViewBitReference'
import ViewBitInterest from '../../cvViewBits/ViewBitInterest'

const CurrentTemplate = ({
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
  secondEdus,
  secondEduSample,
  tertEdus,
  tertEduSample,
  // UI props
  showSample,
  zoom,
  headerWithZoom,
}) => {
  const renderZoomedOut = () => {
    return (
      <View style={stylesZoomedOut.bed}>
        {headerWithZoom()}
        <ScrollView>
          <ScrollView horizontal>
            <View style={stylesZoomedOut.cvBed}>
              <View style={stylesZoomedOut.leftColumn}>
                <ViewBitPhoto
                  assignedPhotoUrl={assignedPhotoUrl}
                  assignedPhotoUrlSample={assignedPhotoUrlSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitContactInfo
                  contactInfo={contactInfo}
                  contactInfoSample={contactInfoSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitPersonalInfo
                  personalInfo={personalInfo}
                  personalInfoSample={personalInfoSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitLanguage
                  languages={languages}
                  languageSample={languageSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitAttribute
                  attributes={attributes}
                  attributeSample={attributeSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitInterest
                  interests={interests}
                  interestSample={interestSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitSkill
                  skills={skills}
                  skillSample={skillSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitReference
                  references={references}
                  referenceSample={referenceSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <View style={stylesZoomedOut.leftFooter}></View>
              </View>
              <View style={stylesZoomedOut.rightColumn}>
                <ViewBitHeading
                  viewHeading={viewHeading}
                  viewHeadingSample={viewHeadingSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitPersonalSummary
                  personalSummary={personalSummary}
                  personalSummarySample={personalSummarySample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitEmployHistory
                  employHistorys={employHistorys}
                  employHistorySample={employHistorySample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitExperience
                  experiences={experiences}
                  experienceSample={experienceSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitSecondEdu
                  secondEdus={secondEdus}
                  secondEduSample={secondEduSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitTertEdu
                  tertEdus={tertEdus}
                  tertEduSample={tertEduSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <View style={stylesZoomedOut.rightFooter}></View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    )
  }

  const renderZoomedIn = () => {
    return (
      <View style={stylesZoomedIn.bed}>
        {headerWithZoom()}
        <ScrollView>
          <ScrollView horizontal>
            <View style={stylesZoomedIn.cvBed}>
              <View style={stylesZoomedIn.leftColumn}>
                <ViewBitPhoto
                  assignedPhotoUrl={assignedPhotoUrl}
                  assignedPhotoUrlSample={assignedPhotoUrlSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitContactInfo
                  contactInfo={contactInfo}
                  contactInfoSample={contactInfoSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitPersonalInfo
                  personalInfo={personalInfo}
                  personalInfoSample={personalInfoSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitLanguage
                  languages={languages}
                  languageSample={languageSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitAttribute
                  attributes={attributes}
                  attributeSample={attributeSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitInterest
                  interests={interests}
                  interestSample={interestSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitSkill
                  skills={skills}
                  skillSample={skillSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitReference
                  references={references}
                  referenceSample={referenceSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <View style={stylesZoomedIn.leftFooter}></View>
              </View>
              <View style={stylesZoomedIn.rightColumn}>
                <ViewBitHeading
                  viewHeading={viewHeading}
                  viewHeadingSample={viewHeadingSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitPersonalSummary
                  personalSummary={personalSummary}
                  personalSummarySample={personalSummarySample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitEmployHistory
                  employHistorys={employHistorys}
                  employHistorySample={employHistorySample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitExperience
                  experiences={experiences}
                  experienceSample={experienceSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitSecondEdu
                  secondEdus={secondEdus}
                  secondEduSample={secondEduSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <ViewBitTertEdu
                  tertEdus={tertEdus}
                  tertEduSample={tertEduSample}
                  showSample={showSample}
                  zoom={zoom}
                />
                <View style={stylesZoomedIn.rightFooter}></View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    )
  }

  return zoom === 'zoomedOut' ? renderZoomedOut() : renderZoomedIn()
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
    marginRight: 10,
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
    marginLeft: 10,
    marginRight: 10,
    width: 760,
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

export default CurrentTemplate

