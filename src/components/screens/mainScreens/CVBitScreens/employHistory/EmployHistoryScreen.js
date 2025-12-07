import React, { useContext, useState } from 'react'
import _ from 'lodash'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Foundation,
} from '@expo/vector-icons'

import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import BitNoData from '../../../../common/BitNoData'
import AddContentButtonLink from '../../../../links/AddContentButtonLink'
import DoneButton from '../../../../links/DoneButton'
import DeleteModal from '../../../../common/modals/DeleteModal'
import { Context as EmployHistoryContext } from '../../../../../context/EmployHistoryContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const EmployHistoryScreen = () => {
  const [documentId, setDocumentId] = useState('')
  const [documentSelected, setDocumentSelected] = useState('')

  const {
    state: { loading, employHistorys },
    setEmployHistoryToEdit,
  } = useContext(EmployHistoryContext)

  const { showDeleteModal } = useContext(UniversalContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const handlePressEdit = (data) => {
    setEmployHistoryToEdit(data)
    setCVBitScreenSelected('employHistoryEdit')
  }

  const renderList = () => {
    if (loading || employHistorys === null) return <LoaderFullScreen />
    if (employHistorys.length < 1)
      return (
        <BitNoData
          cvBit="Employment history"
          routeName="employHistoryCreate"
          buttonText="add previous employment"
        />
      )
    return (
      <>
        <FlatList
          keyExtractor={(employHistory) => employHistory._id}
          data={_.sortBy(employHistorys, 'startDateValue')}
          renderItem={({ item }) => {
            return (
              <>
                <View style={styles.contentBed}>
                  {!item.company || item.company.length < 1 ? null : (
                    <View style={styles.contentRow}>
                      <MaterialIcons style={styles.icon} name="business" />
                      <Text style={styles.text}>{item.company}</Text>
                    </View>
                  )}
                  {!item.position || item.position.length < 1 ? null : (
                    <View style={styles.contentRow}>
                      <MaterialIcons style={styles.icon} name="work" />
                      <Text style={styles.text}>{item.position}</Text>
                    </View>
                  )}
                  {!item.startDate ? null : (
                    <View style={styles.contentRow}>
                      <Foundation style={styles.icon} name="calendar" />
                      <Text style={styles.text}>
                        {item.startDate}
                        {!item.current ? null : ` - Current`}
                        {!item.endDate ? null : ` - ${item.endDate} `}
                      </Text>
                    </View>
                  )}
                  {!item.description || item.description.length < 1 ? null : (
                    <View
                      style={[styles.contentRow, styles.contentRowDescription]}
                    >
                      <MaterialIcons style={styles.icon} name="description" />
                      <Text style={styles.text}>{item.description}</Text>
                    </View>
                  )}
                  <View style={styles.lastUpdateRow}>
                    <MaterialIcons
                      style={styles.lastUpdateIcon}
                      name="watch-later"
                    />
                    <Text style={styles.LastUpdateText}>
                      Last update:{' '}
                      {new Date(item.lastUpdate).toLocaleDateString()}
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
                          setDocumentSelected(item.company)
                          showDeleteModal()
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )
          }}
        />
      </>
    )
  }

  return (
    <>
      <DeleteModal
        id={documentId}
        bit="employment history"
        documentSelected={documentSelected}
      />
      {loading || !employHistorys || employHistorys.length < 1 ? null : (
        <AddContentButtonLink
          routeName="employHistoryCreate"
          text="add employment history"
        />
      )}
      <View style={styles.bed}>{renderList()}</View>
      {loading || !employHistorys || employHistorys.length < 1 ? null : (
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
    paddingHorizontal: '3%',
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
  contentRowDescription: {
    paddingRight: 15,
  },
  icon: {
    width: 20,
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

export default EmployHistoryScreen
