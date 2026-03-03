import React, { useEffect, useContext, useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native'

import { Context as AuthContext } from '../../../../context/AuthContext'

const ManageAffiliate = ({ affiliateFormType }) => {
  const [userEmail, setUserEmail] = useState(null)
  const [formHeading, setFormHeading] = useState(null)

  const {
    state: { loading, errorMessage, apiMessage, affiliateInfo, affiliates },
    createAffiliate,
    fetchAffiliateInfo,
    clearApiMessage,
    clearErrorMessage,
    fetchAllAffiliates,
  } = useContext(AuthContext)

  useEffect(() => {
    if (affiliateFormType === 'createAffiliate')
      setFormHeading('Create affiliate')
    if (affiliateFormType === 'viewAffiliateInfo')
      setFormHeading('View affilate info')
    if (affiliateFormType === 'viewAffiliates') {
      setFormHeading('View affiliates')
      fetchAllAffiliates()
    }
  }, [affiliateFormType])

  const formAction = () => {
    if (affiliateFormType === 'createAffiliate') {
      createAffiliate({ userEmail })
      return
    }
    if (affiliateFormType === 'viewAffiliateInfo') {
      fetchAffiliateInfo({ userEmail })
      return
    }
  }

  const form = () => {
    if (loading)
      return <ActivityIndicator size="small" color="#ededed" marginTop="10%" />
    if (affiliateFormType === 'viewAffiliates') return null
    return (
      <View>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign="center"
          placeholder="users email"
          value={userEmail}
          onChangeText={setUserEmail}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            clearApiMessage()
            clearErrorMessage()
            formAction()
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderAffiliateInfo = () => {
    if (!affiliateInfo) return null
    const { name, phone, email, introductions, firstImpressions, code, _id } = affiliateInfo
    return (
      <>
        <Text style={styles.infoText}>{name}</Text>
        <Text style={styles.infoText}>{phone}</Text>
        <Text style={styles.infoText}>{email}</Text>
        <Text style={styles.infoText}>Introductions: {introductions}</Text>
        <Text style={styles.infoText}>First Impressions: {firstImpressions ?? 0}</Text>
        <Text style={styles.infoText}>Code: {code}</Text>
        <Text style={styles.infoText}>id: {_id}</Text>
      </>
    )
  }

  const renderAffiliates = () => {
    if (!affiliates) return null
    return (
      <FlatList
        keyExtractor={(affiliate) => affiliate._id}
        data={affiliates}
        renderItem={({ item }) => {
          return (
            <ScrollView style={styles.listItemBed}>
              <Text style={styles.listItemText}>{item.name}</Text>
              <Text style={styles.listItemText}>{item.phone}</Text>
              <Text style={styles.listItemText}>{item.email}</Text>
              <Text style={styles.listItemText}>
                Introductions: {item.introductions}
              </Text>
              <Text style={styles.listItemText}>
                First Impressions: {item.firstImpressions ?? 0}
              </Text>
              <Text style={styles.listItemText}>Code: {item.code}</Text>
              <Text style={styles.listItemText}>id: {item._id}</Text>
            </ScrollView>
          )
        }}
      />
    )
  }

  const renderContent = () => {
    if (!affiliateFormType) return null
    if (affiliateInfo) return renderAffiliateInfo()
    if (affiliates) return renderAffiliates()
    return (
      <View style={styles.bed}>
        {!errorMessage ? null : (
          <Text style={styles.error}>{errorMessage}</Text>
        )}
        {!apiMessage ? null : <Text style={styles.success}>{apiMessage}</Text>}
        <Text style={styles.heading}>{formHeading}</Text>
        {form()}
      </View>
    )
  }

  return renderContent()
}

const styles = StyleSheet.create({
  bed: {
    marginVertical: 15,
  },
  heading: {
    color: '#7ac6fa',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#ffff',
    width: '100%',
    height: 35,
    alignSelf: 'center',
    borderRadius: 5,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#278acd',
    alignSelf: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffff',
    padding: 10,
  },
  error: {
    color: '#d40210',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
  success: {
    color: '#2e8009',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: '#ffff',
    marginVertical: 2,
  },
  listItemBed: {
    marginVertical: 5,
  },
  listItemText: {
    color: '#ffff',
  },
})

export default ManageAffiliate
