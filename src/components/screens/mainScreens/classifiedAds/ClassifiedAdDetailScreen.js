import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Switch,
} from 'react-native'
import ngrokApi from '../../../../api/ngrok'
import { Context as NavContext } from '../../../../context/NavContext'
import { normalize } from '../../../../utils/fontUtils'

const ClassifiedAdDetailScreen = ({ adId, onBack }) => {
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [includeCv, setIncludeCv] = useState(true)
  const [applySubmitting, setApplySubmitting] = useState(false)
  const [applySubmitted, setApplySubmitted] = useState(false)
  const [applyError, setApplyError] = useState(null)
  const { setClassifiedAdDetailId } = useContext(NavContext)

  const goBack = () => {
    setClassifiedAdDetailId(null)
    onBack?.()
  }

  useEffect(() => {
    if (!adId) return
    let cancelled = false
    const fetchAd = async () => {
      try {
        const { data } = await ngrokApi.get(`/api/classified-ads/active/${adId}`)
        if (!cancelled) setAd(data)
      } catch (err) {
        if (!cancelled) {
          const res = err.response
          if (res?.status === 403 && res?.data?.code === 'CLASSIFIED_ADS_OPT_IN_REQUIRED') {
            setError('Turn on job listings in the Jobs tab to view this ad.')
          } else {
            setError(res?.status === 404 ? 'Ad not found' : (res?.data?.error || 'Failed to load ad'))
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAd()
    return () => { cancelled = true }
  }, [adId])

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '')

  const handleApplySubmit = async () => {
    const msg = applyMessage.trim()
    if (!msg) return
    setApplyError(null)
    setApplySubmitting(true)
    try {
      await ngrokApi.post(`/api/classified-ads/active/${adId}/enquiries`, { message: msg, includeCv })
      setApplySubmitted(true)
      setApplyMessage('')
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Failed to send application')
    } finally {
      setApplySubmitting(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#278ACD" />
      </View>
    )
  }

  if (error || !ad) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Ad not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back to listings</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Job listings</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{ad.title}</Text>
      <Text style={styles.meta}>{ad.companyName}{ad.location ? ` · ${ad.location}` : ''}</Text>
      {(ad.jobType || ad.category) && (
        <Text style={styles.tags}>{[ad.jobType, ad.category].filter(Boolean).join(' · ')}</Text>
      )}
      {ad.publishedAt && <Text style={styles.date}>Posted {formatDate(ad.publishedAt)}</Text>}
      <Text style={styles.description}>{ad.description}</Text>
      {ad.contactInstructions ? (
        <View style={styles.contactBlock}>
          <Text style={styles.contactTitle}>How to apply</Text>
          <Text style={styles.contactText}>{ad.contactInstructions}</Text>
        </View>
      ) : null}
      <View style={styles.applyBlock}>
        <Text style={styles.contactTitle}>Apply for this job</Text>
        {applySubmitted ? (
          <Text style={styles.applySuccess}>Application sent. The employer may contact you via the details in your profile.</Text>
        ) : (
          <>
            <TextInput
              style={styles.applyInput}
              value={applyMessage}
              onChangeText={setApplyMessage}
              placeholder="Introduce yourself and why you're interested..."
              placeholderTextColor="#666"
              multiline
              maxLength={2000}
              numberOfLines={4}
            />
            <View style={styles.includeCvRow}>
              <Text style={styles.includeCvLabel}>Include my CV with this application</Text>
              <Switch value={includeCv} onValueChange={setIncludeCv} trackColor={{ false: '#555', true: '#28a745' }} thumbColor="#fff" />
            </View>
            {applyError ? <Text style={styles.applyErrorText}>{applyError}</Text> : null}
            <TouchableOpacity
              style={[styles.applyButton, applySubmitting && styles.applyButtonDisabled]}
              onPress={handleApplySubmit}
              disabled={applySubmitting || !applyMessage.trim()}
            >
              <Text style={styles.applyButtonText}>{applySubmitting ? 'Sending…' : 'Send application'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: normalize(14), color: '#c00', textAlign: 'center', marginBottom: 16 },
  backButton: { alignSelf: 'flex-start', marginBottom: 12 },
  backButtonText: { fontSize: normalize(14), color: '#278ACD' },
  title: { fontSize: normalize(18), fontWeight: '700', color: '#fff', marginBottom: 6 },
  meta: { fontSize: normalize(14), color: '#b0b0b0' },
  tags: { fontSize: normalize(13), color: '#888', marginTop: 4 },
  date: { fontSize: normalize(12), color: '#666', marginTop: 4, marginBottom: 12 },
  description: { fontSize: normalize(14), color: '#e0e0e0', lineHeight: 22, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3a3e4a' },
  contactBlock: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3a3e4a' },
  contactTitle: { fontSize: normalize(14), fontWeight: '600', color: '#fff', marginBottom: 6 },
  contactText: { fontSize: normalize(14), color: '#b0b0b0' },
  applyBlock: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#3a3e4a' },
  applyInput: {
    backgroundColor: '#2a2e3a',
    borderWidth: 1,
    borderColor: '#3a3e4a',
    borderRadius: 8,
    padding: 12,
    fontSize: normalize(14),
    color: '#e0e0e0',
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  applyErrorText: { fontSize: normalize(12), color: '#e74c3c', marginTop: 6 },
  includeCvRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  includeCvLabel: { fontSize: normalize(14), color: '#e0e0e0', flex: 1 },
  applyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  applyButtonDisabled: { opacity: 0.6 },
  applyButtonText: { color: '#fff', fontSize: normalize(14), fontWeight: '600' },
  applySuccess: { fontSize: normalize(14), color: '#d4edda', marginTop: 8 },
})

export default ClassifiedAdDetailScreen
