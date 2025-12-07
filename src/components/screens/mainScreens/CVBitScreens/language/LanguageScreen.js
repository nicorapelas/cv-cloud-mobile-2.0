import React, { useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons'

import BitNoData from '../../../../common/BitNoData'
import AddContentButtonLink from '../../../../links/AddContentButtonLink'
import DoneButton from '../../../../links/DoneButton'
import DeleteModal from '../../../../common/modals/DeleteModal'
import { Context as LanguageContext } from '../../../../../context/LanguageContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'
import ProficiencyOne from '../../../../common/proficiencyDots/ProficiencyOne'
import ProficiencyTwo from '../../../../common/proficiencyDots/ProficiencyTwo'
import ProficiencyThree from '../../../../common/proficiencyDots/ProficiencyThree'
import ProficiencyFour from '../../../../common/proficiencyDots/ProficiencyFour'
import ProficiencyFive from '../../../../common/proficiencyDots/ProficiencyFive'

const LanguageScreen = () => {
  const [documentId, setDocumentId] = useState('')
  const [documentSelected, setDocumentSelected] = useState('')

  const { showDeleteModal } = useContext(UniversalContext)
  const {
    state: { loading, languages },
    setLanguageToEdit,
  } = useContext(LanguageContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const renderLoader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="#ededed" />
      </View>
    )
  }

  const handlePressEdit = (data) => {
    setLanguageToEdit(data)
    setCVBitScreenSelected('languageEdit')
  }

  const renderProfiencyDots = (val) => {
    if (val === 1) return <ProficiencyOne zoom="zoomedIn" />
    if (val === 2) return <ProficiencyTwo zoom="zoomedIn" />
    if (val === 3) return <ProficiencyThree zoom="zoomedIn" />
    if (val === 4) return <ProficiencyFour zoom="zoomedIn" />
    if (val === 5) return <ProficiencyFive zoom="zoomedIn" />
  }

  const renderList = () => {
    if (loading || languages === null)
      return <View style={styles.statusBed}>{renderLoader()}</View>
    if (languages.length < 1)
      return (
        <BitNoData
          cvBit="language"
          routeName="languageCreate"
          buttonText="add language"
        />
      )
    return (
      <>
        <AddContentButtonLink routeName="languageCreate" text="add language" />
        <FlatList
          keyExtractor={(language) => language._id}
          data={languages}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <View style={styles.documentBed}>
                  <View style={styles.titleBed}>
                    <Octicons style={styles.point} name="dot-fill" />
                    <Text style={styles.title}>{item.language}</Text>
                  </View>
                </View>
                <View style={styles.itemTextProficiencyBed}>
                  <View style={styles.itemTextProficiencyBlock}>
                    {!item.write || item.write.length < 1 ? null : (
                      <View style={styles.itemTextProficiencyContainer}>
                        <Text style={styles.itemText}>write</Text>
                        {renderProfiencyDots(item.write)}
                      </View>
                    )}
                    {!item.read || item.read.length < 1 ? null : (
                      <View style={styles.itemTextProficiencyContainer}>
                        <Text style={styles.itemText}>read</Text>
                        {renderProfiencyDots(item.read)}
                      </View>
                    )}
                    {!item.speak || item.speak.length < 1 ? null : (
                      <View style={styles.itemTextProficiencyContainer}>
                        <Text style={styles.itemText}>speak</Text>
                        {renderProfiencyDots(item.speak)}
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.buttonBed}>
                  <TouchableOpacity
                    style={styles.editButtonBed}
                    onPress={() => handlePressEdit(item)}
                  >
                    <MaterialCommunityIcons
                      style={styles.actionButton}
                      name="pencil"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButtonBed}>
                    <MaterialCommunityIcons
                      style={styles.actionButton}
                      name="delete"
                      onPress={() => {
                        setDocumentId(item._id)
                        setDocumentSelected(item.language)
                        showDeleteModal()
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
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
        documentSelected={documentSelected}
        bit="language"
      />
      <View style={styles.bed}>{renderList()}</View>
      {loading || !languages || languages.length < 1 ? null : (
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
    paddingBottom: 60,
  },
  container: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    padding: 7,
    margin: 5,
  },
  documentBed: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  titleBed: {
    flexGrow: 1.5,
    flex: 1,
    flexDirection: 'row',
    paddingTop: 7,
    paddingLeft: 7,
    paddingRight: 5,
  },
  point: {
    paddingTop: 5,
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    paddingLeft: 10,
  },
  itemTextProficiencyBed: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemTextProficiencyBlock: {
    width: '80%',
  },
  itemTextProficiencyContainer: {
    marginBottom: 2,
    flexDirection: 'row',
  },
  itemText: {
    width: '23%',
    marginTop: 5,
    fontSize: 19,
  },
  buttonBed: {
    backgroundColor: '#232936',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginLeft: 5,
    width: 115,
    borderRadius: 25,
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
    fontSize: 22,
    color: '#ffff',
    padding: 7,
  },
})

export default LanguageScreen
