import React, { useContext, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { Context as BurgerMenuContext } from '../../../context/BurgerMenuContext'
import { Context as AffiliateContext } from '../../../context/AffiliateContext'

const ReferralsPerformanceView = () => {
  const { setInfoToShow } = useContext(BurgerMenuContext)
  const {
    state: { affiliateInfo, affiliateIntros, loading, error },
    fetchAffiliateInfo,
    fetchAffiliatesIntros,
  } = useContext(AffiliateContext)

  useEffect(() => {
    fetchAffiliateInfo()
    fetchAffiliatesIntros()
  }, [])

  const handleBack = () => {
    setInfoToShow('')
  }

  const hasError = affiliateInfo && typeof affiliateInfo === 'object' && affiliateInfo.error
  const info = hasError ? null : (Array.isArray(affiliateInfo) ? affiliateInfo[0] : affiliateInfo)
  const introList = Array.isArray(affiliateIntros) ? affiliateIntros : []

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Referrals</Text>

      {loading && !info && introList.length === 0 ? (
        <ActivityIndicator size="small" color="#7ac6fa" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : info ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.label}>Your referral code</Text>
            <Text style={styles.code}>{info.code}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.count}>Introductions: {info.introductions ?? 0}</Text>
            <Text style={styles.count}>First Impressions: {info.firstImpressions ?? 0}</Text>
          </View>
          {introList.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.label}>Users who used your code</Text>
              {introList.map((u) => (
                <Text key={u._id} style={styles.listItem}>
                  {u.email || u.username}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <Text style={styles.helperText}>You don't have an affiliate account yet.</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <MaterialIcons name="cancel" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  heading: {
    color: '#7ac6fa',
    fontSize: 20,
    alignSelf: 'center',
    paddingBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: '#d40210',
    textAlign: 'center',
    marginVertical: 10,
  },
  helperText: {
    color: '#7ac6fa',
    textAlign: 'center',
    marginVertical: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    color: '#7ac6fa',
    fontSize: 14,
    marginBottom: 4,
  },
  code: {
    color: '#ffff',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 4,
  },
  count: {
    color: '#ffff',
    fontSize: 15,
    marginVertical: 2,
  },
  listItem: {
    color: '#ffff',
    fontSize: 14,
    marginVertical: 2,
    paddingLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  backButtonIcon: {
    color: '#F9B321',
    paddingRight: 5,
    fontSize: 18,
  },
  backButtonText: {
    color: '#F9B321',
    fontSize: 16,
  },
})

export default ReferralsPerformanceView
