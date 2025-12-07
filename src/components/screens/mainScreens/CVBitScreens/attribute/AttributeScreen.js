import React, { useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons'

import LoaderFullScreen from '../../../../common/LoaderFullScreen'
import BitNoData from '../../../../common/BitNoData'
import AddContentButtonLink from '../../../../links/AddContentButtonLink'
import DoneButton from '../../../../links/DoneButton'
import DeleteModal from '../../../../common/modals/DeleteModal'
import { Context as AttributeContext } from '../../../../../context/AttributeContext'
import { Context as UniversalContext } from '../../../../../context/UniversalContext'
import { Context as NavContext } from '../../../../../context/NavContext'

const AttributeScreen = () => {
  const [documentId, setDocumentId] = useState('')
  const [documentSelected, setDocumentSelected] = useState('')

  const { showDeleteModal } = useContext(UniversalContext)
  const {
    state: { loading, attributes },
    setAttributeToEdit,
  } = useContext(AttributeContext)

  const { setCVBitScreenSelected } = useContext(NavContext)

  const handlePressEdit = (data) => {
    setAttributeToEdit(data)
    setCVBitScreenSelected('attributeEdit')
  }

  const renderList = () => {
    return (
      <>
        <DeleteModal
          id={documentId}
          documentSelected={documentSelected}
          bit="attribute"
        />
        <AddContentButtonLink
          routeName="attributeCreate"
          text="add attribute"
        />
        <FlatList
          keyExtractor={(attribute) => attribute._id}
          data={attributes}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <View style={styles.titleBed}>
                  <View style={styles.titleContainer}>
                    <Octicons style={styles.point} name="dot-fill" />
                    <Text style={styles.title}>{item.attribute}</Text>
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
                        setDocumentSelected(item.attribute)
                        showDeleteModal()
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />
        <DoneButton text="Done" routeName="" />
      </>
    )
  }

  const renderContent = () => {
    if (loading || attributes === null) return <LoaderFullScreen />
    if (attributes.length < 1) {
      return (
        <BitNoData
          cvBit="Attributes"
          routeName="attributeCreate"
          buttonText="add attribute"
        />
      )
    }
    return renderList()
  }

  return <View style={styles.bed}>{renderContent()}</View>
}

const styles = StyleSheet.create({
  heading: {
    color: '#ffff',
    fontSize: 22,
  },
  bed: {
    justifyContent: 'center',
    paddingHorizontal: '2%',
    flex: 1,
    paddingBottom: 60,
  },
  container: {
    backgroundColor: '#ffff',
    alignSelf: 'center',
    width: '100%',
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 30,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleBed: {
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
  },
  point: {
    paddingTop: 4,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    paddingLeft: 10,
  },
  buttonBed: {
    backgroundColor: '#232936',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    paddingHorizontal: 5,
    paddingVertical: 5,
    maxHeight: 45,
    borderRadius: 25,
  },
  editButtonBed: {
    backgroundColor: '#278ACD',
    borderRadius: 25,
  },
  deleteButtonBed: {
    backgroundColor: '#f56c6c',
    borderRadius: 25,
  },
  actionButton: {
    fontSize: 22,
    color: '#ffff',
    padding: 7,
  },
})

export default AttributeScreen
