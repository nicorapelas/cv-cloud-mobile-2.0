import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import BitNoData from '../../../../common/BitNoData'
import DeleteModal from '../../../../common/modals/DeleteModal'
import AddContentButtonLink from '../../../../links/AddContentButtonLink'
import DoneButton from '../../../../links/DoneButton'
import { Context as ReferenceContext } from '../../../../../context/ReferenceContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const ReferenceScreen = () => {
  const [documentId, setDocumentId] = useState('')
  const [documentSelected, setDocumentSelected] = useState('')

  const {
    state: { loading, references },
    setReferenceToEdit,
  } = useContext(ReferenceContext)

  const { showDeleteModal } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const handlePressEdit = (data) => {
    setReferenceToEdit(data)
    setCVBitScreenSelected('referenceEdit')
  }

  const renderList = () => {
    if (loading || references === null) return <LoaderFullScreen />
    if (references.length < 1)
      return (
        <BitNoData
          cvBit="Reference"
          routeName="referenceCreate"
          buttonText="add reference"
        />
      )
    return (
      <FlatList
        keyExtractor={(reference) => reference._id}
        data={references}
        renderItem={({ item }) => {
          return (
            <View style={styles.contentBed}>
              {!item.name || item.name.length < 1 ? null : (
                <View style={styles.contentRow}>
                  <MaterialIcons style={styles.icon} name="person" />
                  <Text style={styles.text}>{item.name}</Text>
                </View>
              )}
              {!item.company || item.company.length < 1 ? null : (
                <View style={styles.contentRow}>
                  <MaterialIcons style={styles.icon} name="business" />
                  <Text style={styles.text}>{item.company}</Text>
                </View>
              )}
              {!item.phone || item.phone.length < 1 ? null : (
                <View style={styles.contentRow}>
                  <MaterialCommunityIcons
                    style={styles.icon}
                    name="cellphone-basic"
                  />
                  <Text style={styles.text}>{item.phone}</Text>
                </View>
              )}
              {!item.email || item.email.length < 1 ? null : (
                <View style={styles.contentRow}>
                  <MaterialCommunityIcons style={styles.icon} name="email" />
                  <Text style={styles.text}>{item.email}</Text>
                </View>
              )}
              <View style={styles.lastUpdateRow}>
                <MaterialIcons
                  style={styles.lastUpdateIcon}
                  name="watch-later"
                />
                <Text style={styles.LastUpdateText}>
                  Last update: {new Date(item.lastUpdate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.buttonBed}>
                <TouchableOpacity style={styles.editButtonBed}>
                  <MaterialCommunityIcons
                    style={styles.actionButton}
                    name="pencil"
                    onPress={() => handlePressEdit(item)}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButtonBed}>
                  <MaterialCommunityIcons
                    style={styles.actionButton}
                    name="delete"
                    onPress={() => {
                      setDocumentId(item._id)
                      setDocumentSelected(item.name)
                      showDeleteModal()
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />
    )
  }

  return (
    <>
      <DeleteModal
        id={documentId}
        bit="reference"
        documentSelected={documentSelected}
      />
      {loading || !references || references.length < 1 ? null : (
        <AddContentButtonLink
          routeName="referenceCreate"
          text="add reference"
        />
      )}
      <View style={styles.bed}>{renderList()}</View>
      {loading || !references || references.length < 1 ? null : (
        <DoneButton text="Done" routeName="" />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  heading: {
    color: '#ffff',
    fontSize: 22,
  },
  bed: {
    backgroundColor: '#232936',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: '5%',
    paddingBottom: 60,
  },
  contentBed: {
    backgroundColor: '#ffff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 7,
  },
  contentRow: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  icon: {
    width: 22,
    fontSize: 22,
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
  text: {
    fontSize: 18,
    paddingLeft: 5,
    width: '90%',
  },
  buttonBed: {
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 7,
    marginTop: 5,
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

export default ReferenceScreen
