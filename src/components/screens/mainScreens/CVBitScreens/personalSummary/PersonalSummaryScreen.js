import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import BitNoData from '../../../../common/BitNoData'
import DoneButton from '../../../../links/DoneButton'
import DeleteModal from '../../../../common/modals/DeleteModal'
import { Context as PersonalSummaryContext } from '../../../../../context/PersonalSummaryContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const PersonalSummaryScreen = () => {
  const [documentId, setDocumentId] = useState('')

  const { showDeleteModal } = useContext(UniversalContext)

  const {
    state: { loading, personalSummary },
    setPersonalSummaryToEdit,
  } = useContext(PersonalSummaryContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const handlePressEdit = (data) => {
    setPersonalSummaryToEdit(data)
    setCVBitScreenSelected('personalSummaryEdit')
  }

  const renderSummary = () => {
    const { _id, content, lastUpdate } = personalSummary[0]
    return (
      <View style={styles.formBlock}>
        <View style={styles.contentBed}>
          <ScrollView style={styles.contentRow}>
            <Text style={styles.text}>{content}</Text>
          </ScrollView>
          <View style={styles.lastUpdateRow}>
            <MaterialIcons style={styles.lastUpdateIcon} name="watch-later" />
            <Text style={styles.LastUpdateText}>
              Last update: {new Date(lastUpdate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.buttonBed}>
          <TouchableOpacity
            style={styles.editButtonBed}
            onPress={() => handlePressEdit({ _id, content })}
          >
            <MaterialCommunityIcons style={styles.actionButton} name="pencil" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButtonBed}>
            <MaterialCommunityIcons
              onPress={() => {
                setDocumentId(_id)
                showDeleteModal()
              }}
              style={styles.actionButton}
              name="delete"
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderContent = () => {
    if (loading || !personalSummary) return <LoaderFullScreen />
    if (personalSummary.length < 1) {
      return (
        <View style={styles.formBlock}>
          <BitNoData
            cvBit="personal summary"
            routeName="personalSummaryCreate"
            buttonText="add personal summary"
          />
        </View>
      )
    }
    return renderSummary()
  }

  return (
    <View style={styles.bed}>
      <DeleteModal id={documentId} bit="personal summary" />
      {renderContent()}
      {!personalSummary || personalSummary.length < 1 ? null : (
        <DoneButton text="Done" routeName="" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    color: '#ffff',
    fontSize: 22,
  },
  bed: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  formBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  contentBed: {
    backgroundColor: '#ffff',
    maxHeight: '70%',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 7,
  },
  contentRow: {
    paddingTop: 5,
  },
  text: {
    width: '95%',
    fontSize: 18,
    paddingLeft: 5,
  },
  addressbed: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  lastUpdateRow: {
    flexDirection: 'row',
    paddingTop: 20,
    fontSize: 5,
  },
  lastUpdateIcon: {
    paddingTop: 3,
  },
  LastUpdateText: {
    paddingLeft: 7,
  },
  buttonBed: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  editButtonBed: {
    backgroundColor: '#558dd8',
    borderRadius: 25,
  },
  deleteButtonBed: {
    backgroundColor: '#c35a44',
    borderRadius: 25,
  },
  actionButton: {
    fontSize: 30,
    color: '#ffff',
    padding: 7,
  },
})

export default PersonalSummaryScreen
