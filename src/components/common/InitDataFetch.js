import { useContext, useEffect, useRef } from 'react'

import { Context as AttributeContext } from '../../context/AttributeContext'
import { Context as CertificateContext } from '../../context/CertificateContext'
import { Context as ContactInfoContext } from '../../context/ContactInfoContext'
import { Context as EmployHistoryContext } from '../../context/EmployHistoryContext'
import { Context as ExperienceContext } from '../../context/ExperienceContext'
import { Context as FirstImpressionContext } from '../../context/FirstImpressionContext'
import { Context as InterestContext } from '../../context/InterestContext'
import { Context as LanguageContext } from '../../context/LanguageContext'
import { Context as PersonalInfoContext } from '../../context/PersonalInfoContext'
import { Context as PersonalSummaryContext } from '../../context/PersonalSummaryContext'
import { Context as PhotoContext } from '../../context/PhotoContext'
import { Context as ReferenceContext } from '../../context/ReferenceContext'
import { Context as SecondEduContext } from '../../context/SecondEduContext'
import { Context as SkillContext } from '../../context/SkillContext'
import { Context as TertEduContext } from '../../context/TertEduContext'
import { Context as UniversalContext } from '../../context/UniversalContext'
import { Context as AuthContext } from '../../context/AuthContext'

// Helper function to check if user object is fully loaded
const isUserReady = (user) => {
  return user && typeof user === 'object' && user._id && user.email
}

// Retry wrapper for fetch functions
const retryFetch = async (fetchFn, maxRetries = 2, delay = 1000) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetchFn()
      return { status: 'fulfilled', value: result }
    } catch (error) {
      if (attempt === maxRetries) {
        console.warn(`⚠️ Fetch failed after ${maxRetries + 1} attempts:`, error?.message || error)
        return { status: 'rejected', reason: error }
      }
      // Exponential backoff: wait longer between retries
      const waitTime = delay * Math.pow(2, attempt)
      console.log(`🔄 Retrying fetch (attempt ${attempt + 1}/${maxRetries + 1}) after ${waitTime}ms...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }
}

const InitDataFetch = () => {
  const { fetchAttributes } = useContext(AttributeContext)
  const { fetchCertificates } = useContext(CertificateContext)
  const { fetchContactInfo } = useContext(ContactInfoContext)
  const { fetchEmployHistorys } = useContext(EmployHistoryContext)
  const { fetchExperiences } = useContext(ExperienceContext)
  const { fetchFirstImpression } = useContext(FirstImpressionContext)
  const { fetchInterests } = useContext(InterestContext)
  const { fetchLanguages } = useContext(LanguageContext)
  const { fetchPersonalInfo } = useContext(PersonalInfoContext)
  const { fetchPersonalSummary } = useContext(PersonalSummaryContext)
  const { fetchPhotos } = useContext(PhotoContext)
  const { fetchReferences } = useContext(ReferenceContext)
  const { fetchSecondEdu } = useContext(SecondEduContext)
  const { fetchSkills } = useContext(SkillContext)
  const { fetchTertEdus } = useContext(TertEduContext)
  const {
    state: { initDataFetchDone },
    setInitDataFetchDone,
  } = useContext(UniversalContext)
  const {
    state: { user, token },
  } = useContext(AuthContext)

  // Use ref to track if fetch is in progress to prevent duplicate calls
  const isFetchingRef = useRef(false)

  useEffect(() => {
    // Enhanced user readiness check: user must be fully loaded AND token must exist
    const userReady = isUserReady(user) && token

    // Only fetch if user is ready, token exists, data hasn't been fetched, and not already fetching
    if (userReady && !initDataFetchDone && !isFetchingRef.current) {
      isFetchingRef.current = true
      console.log('🔄 InitDataFetch: Starting initial data fetch...', {
        userId: user?._id,
        hasToken: !!token,
      })

      // Execute all fetch functions with retry logic
      const fetchAllData = async () => {
        try {
          // Wrap each fetch with retry logic (2 retries max)
          const fetchPromises = [
            () => retryFetch(fetchAttributes),
            () => retryFetch(fetchCertificates),
            () => retryFetch(fetchContactInfo),
            () => retryFetch(fetchEmployHistorys),
            () => retryFetch(fetchExperiences),
            () => retryFetch(fetchFirstImpression),
            () => retryFetch(fetchInterests),
            () => retryFetch(fetchLanguages),
            () => retryFetch(fetchPersonalInfo),
            () => retryFetch(fetchPersonalSummary),
            () => retryFetch(fetchPhotos),
            () => retryFetch(fetchReferences),
            () => retryFetch(fetchSecondEdu),
            () => retryFetch(fetchSkills),
            () => retryFetch(fetchTertEdus),
          ]

          // Execute all fetches with retry logic
          const results = await Promise.allSettled(
            fetchPromises.map((fetchPromise) => fetchPromise())
          )

          // Extract actual results (retryFetch returns {status, value/reason})
          const processedResults = results.map((result) => {
            if (result.status === 'fulfilled') {
              return result.value // This is already {status, value/reason} from retryFetch
            }
            return { status: 'rejected', reason: result.reason }
          })

          // Check if any fetches failed
          const failedFetches = processedResults.filter(
            (result) => result.status === 'rejected'
          )
          if (failedFetches.length > 0) {
            console.warn(
              `⚠️ InitDataFetch: ${failedFetches.length}/${processedResults.length} fetches failed after retries`
            )
            // Log specific errors for debugging
            failedFetches.forEach((failed, index) => {
              console.error(`  Failed fetch ${index + 1}:`, failed.reason?.message || failed.reason)
            })
          }

          const successfulFetches = processedResults.filter(
            (result) => result.status === 'fulfilled'
          )
          console.log(
            `✅ InitDataFetch: Completed ${successfulFetches.length}/${processedResults.length} fetches successfully`
          )

          // Only set flag to true after all fetches have completed (success or failure)
          setInitDataFetchDone(true)
          isFetchingRef.current = false
        } catch (error) {
          console.error('❌ InitDataFetch: Critical error during data fetch:', error)
          // Set a timeout to prevent infinite retries, but allow retry on next render
          setTimeout(() => {
            setInitDataFetchDone(true)
            isFetchingRef.current = false
          }, 10000) // Increased to 10 seconds for Android network issues
        }
      }

      // Add a small delay to ensure user object is fully ready (especially for Android)
      const delayTimer = setTimeout(() => {
        fetchAllData()
      }, 500) // 500ms delay to ensure user is fully loaded

      return () => {
        clearTimeout(delayTimer)
        isFetchingRef.current = false
      }
    } else if (!userReady && initDataFetchDone) {
      // Reset flag when user logs out or becomes invalid
      console.log('🔄 InitDataFetch: User logged out or invalid, resetting fetch flag')
      setInitDataFetchDone(false)
      isFetchingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, initDataFetchDone, setInitDataFetchDone])

  return null
}

export default InitDataFetch
