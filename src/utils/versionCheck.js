import Constants from 'expo-constants'
import ngrokApi from '../api/ngrok'

/**
 * Compare two semantic version strings
 * @param {string} version1 - First version (e.g., "2.0.26")
 * @param {string} version2 - Second version (e.g., "2.0.25")
 * @returns {number} - Returns 1 if version1 > version2, -1 if version1 < version2, 0 if equal
 */
export const compareVersions = (version1, version2) => {
  if (!version1 || !version2) return 0

  const v1Parts = version1.split('.').map(Number)
  const v2Parts = version2.split('.').map(Number)

  // Ensure both arrays have the same length
  const maxLength = Math.max(v1Parts.length, v2Parts.length)
  while (v1Parts.length < maxLength) v1Parts.push(0)
  while (v2Parts.length < maxLength) v2Parts.push(0)

  for (let i = 0; i < maxLength; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1
    if (v1Parts[i] < v2Parts[i]) return -1
  }

  return 0
}

/**
 * Get current app version from Constants
 * @returns {string} - Current app version (e.g., "2.0.26")
 */
export const getCurrentVersion = () => {
  try {
    return Constants.expoConfig?.version || Constants.manifest?.version || '0.0.0'
  } catch (error) {
    console.error('Error getting current version:', error)
    return '0.0.0'
  }
}

/**
 * Check for app updates from server
 * @returns {Promise<{hasUpdate: boolean, isForceUpdate: boolean, updateUrl: string, updateUrlWeb: string}>}
 */
export const checkForUpdates = async () => {
  try {
    const response = await ngrokApi.get('/api/app-version')
    const { latestVersion, minimumVersion, updateUrl, updateUrlWeb } = response.data
    const currentVersion = getCurrentVersion()

    const hasUpdate = compareVersions(latestVersion, currentVersion) > 0
    const isForceUpdate = compareVersions(minimumVersion, currentVersion) > 0

    return {
      hasUpdate,
      isForceUpdate,
      latestVersion,
      currentVersion,
      updateUrl: updateUrl || 'market://details?id=com.cvcloud.app',
      updateUrlWeb: updateUrlWeb || 'https://play.google.com/store/apps/details?id=com.cvcloud.app',
    }
  } catch (error) {
    console.error('Error checking for updates:', error)
    // Don't show update modal if check fails
    return {
      hasUpdate: false,
      isForceUpdate: false,
      currentVersion: getCurrentVersion(),
      updateUrl: 'market://details?id=com.cvcloud.app',
      updateUrlWeb: 'https://play.google.com/store/apps/details?id=com.cvcloud.app',
    }
  }
}
