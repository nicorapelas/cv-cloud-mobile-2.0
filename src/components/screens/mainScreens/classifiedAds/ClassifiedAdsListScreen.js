import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import ngrokApi from '../../../../api/ngrok'
import { Context as NavContext } from '../../../../context/NavContext'
import { normalize } from '../../../../utils/fontUtils'

const ClassifiedAdsListScreen = () => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [optInRequired, setOptInRequired] = useState(false)
  const [prefs, setPrefs] = useState({
    classifiedAdsOptIn: false,
    classifiedAdsEmailNotifications: false,
    classifiedAdsInAppNotifications: false,
  })
  const [prefsLoading, setPrefsLoading] = useState(false)
  const [prefsSaving, setPrefsSaving] = useState(false)
  const { setClassifiedAdDetailId } = useContext(NavContext)

  const fetchAds = async () => {
    setLoading(true)
    setError(null)
    setOptInRequired(false)
    try {
      const { data } = await ngrokApi.get('/api/classified-ads/active?limit=50')
      setAds(data.ads || [])
    } catch (err) {
      const res = err.response
      if (res?.status === 403 && res?.data?.code === 'CLASSIFIED_ADS_OPT_IN_REQUIRED') {
        setOptInRequired(true)
        fetchPrefs()
      } else {
        setError(res?.data?.error || 'Failed to load job listings')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchPrefs = async () => {
    setPrefsLoading(true)
    try {
      const { data } = await ngrokApi.get('/api/user-preferences/classified-ads')
      setPrefs({
        classifiedAdsOptIn: Boolean(data.classifiedAdsOptIn),
        classifiedAdsEmailNotifications: Boolean(data.classifiedAdsEmailNotifications),
        classifiedAdsInAppNotifications: Boolean(data.classifiedAdsInAppNotifications),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setPrefsLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  const updatePref = async (key, value) => {
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    setPrefsSaving(true)
    try {
      await ngrokApi.put('/api/user-preferences/classified-ads', next)
      if (key === 'classifiedAdsOptIn' && value) {
        await fetchAds()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setPrefsSaving(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setClassifiedAdDetailId(item._id)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMeta}>{item.companyName}{item.location ? ` · ${item.location}` : ''}</Text>
      {(item.jobType || item.category) && (
        <Text style={styles.cardTags}>{[item.jobType, item.category].filter(Boolean).join(' · ')}</Text>
      )}
      {item.publishedAt && <Text style={styles.cardDate}>Posted {formatDate(item.publishedAt)}</Text>}
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#278ACD" />
        <Text style={styles.loadingText}>Loading job listings…</Text>
      </View>
    )
  }

  if (optInRequired) {
    return (
      <ScrollView contentContainerStyle={styles.optInContainer}>
        <Text style={styles.optInTitle}>Job listings</Text>
        <Text style={styles.optInText}>Turn on job listings to see them here.</Text>
        {prefsLoading ? (
          <ActivityIndicator size="small" color="#278ACD" style={{ marginTop: 16 }} />
        ) : (
          <>
            <TouchableOpacity
              style={[styles.optInToggle, prefs.classifiedAdsOptIn && styles.optInToggleOn]}
              onPress={() => updatePref('classifiedAdsOptIn', !prefs.classifiedAdsOptIn)}
              disabled={prefsSaving}
            >
              <Text style={styles.optInToggleText}>
                {prefs.classifiedAdsOptIn ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
            {prefs.classifiedAdsOptIn && (
              <>
                <Text style={styles.optInLabel}>Email when new jobs are posted</Text>
                <TouchableOpacity
                  style={[styles.optInToggle, prefs.classifiedAdsEmailNotifications && styles.optInToggleOn]}
                  onPress={() => updatePref('classifiedAdsEmailNotifications', !prefs.classifiedAdsEmailNotifications)}
                  disabled={prefsSaving}
                >
                  <Text style={styles.optInToggleText}>
                    {prefs.classifiedAdsEmailNotifications ? 'On' : 'Off'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.optInLabel}>In-app notification for new jobs</Text>
                <TouchableOpacity
                  style={[styles.optInToggle, prefs.classifiedAdsInAppNotifications && styles.optInToggleOn]}
                  onPress={() => updatePref('classifiedAdsInAppNotifications', !prefs.classifiedAdsInAppNotifications)}
                  disabled={prefsSaving}
                >
                  <Text style={styles.optInToggleText}>
                    {prefs.classifiedAdsInAppNotifications ? 'On' : 'Off'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (ads.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No job listings at the moment. Check back later.</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={ads}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      style={styles.flatList}
    />
  )
}

const styles = StyleSheet.create({
  flatList: { flex: 1 },
  list: { padding: 12, paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: normalize(14), color: '#666' },
  errorText: { fontSize: normalize(14), color: '#c00', textAlign: 'center' },
  emptyText: { fontSize: normalize(14), color: '#666', textAlign: 'center' },
  card: {
    backgroundColor: '#2a2e3a',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a3e4a',
  },
  cardTitle: { fontSize: normalize(15), fontWeight: '600', color: '#fff', marginBottom: 4 },
  cardMeta: { fontSize: normalize(13), color: '#b0b0b0' },
  cardTags: { fontSize: normalize(12), color: '#888', marginTop: 4 },
  cardDate: { fontSize: normalize(11), color: '#666', marginTop: 4 },
  optInContainer: { padding: 24, flexGrow: 1 },
  optInTitle: { fontSize: normalize(18), fontWeight: '700', color: '#fff', marginBottom: 8 },
  optInText: { fontSize: normalize(14), color: '#b0b0b0', marginBottom: 16 },
  optInLabel: { fontSize: normalize(13), color: '#888', marginTop: 16, marginBottom: 6 },
  optInToggle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2a2e3a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3e4a',
    alignSelf: 'flex-start',
  },
  optInToggleOn: { backgroundColor: '#278ACD', borderColor: '#278ACD' },
  optInToggleText: { fontSize: normalize(14), color: '#fff' },
})

export default ClassifiedAdsListScreen
