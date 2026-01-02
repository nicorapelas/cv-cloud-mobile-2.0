import _ from 'lodash'
import createDataContext from './createDataContext'
import ngrokApi from '../api/ngrok'

// Reducer
const FirstImpressionReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true }
    case 'STOP_LOADING':
      return { ...state, loading: false }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'ADD_UPLOAD_SIGNATURE':
      return { ...state, uploadSignature: action.payload }
    case 'CLEAR_UPLOAD_SIGNATURE':
      return { ...state, uploadSignature: action.payload }
    case 'FETCH_STATUS':
      return { ...state, firstImpressionStatus: action.payload, loading: false }
    case 'FETCH':
      return { ...state, firstImpression: action.payload, loading: false }
    case 'CREATE':
      return {
        ...state,
        firstImpression: action.payload,
        firstImpressionStatusInitFetchDone: false,
        loading: false,
      }
    case 'EDIT':
      return {
        ...state,
        [action.payload._id]: action.payload,
        firstImpressionStatusInitFetchDone: false,
        loading: false,
      }
    case 'DELETE':
      return {
        ...state,
        firstImpression: action.payload,
        firstImpressionStatusInitFetchDone: false,
        loading: false,
      }
    case 'ADD_VIDEO_OBJECT':
      return { ...state, videoObject: action.payload }
    case 'CLEAR_VIDEO_OBJECT':
      return { ...state, videoObject: action.payload }
    case 'SET_VIDEO_DEMO_SHOW':
      return { ...state, videoDemoShow: action.payload }
    case 'FETCH_DEMO_URL':
      return { ...state, videoDemoUrl: action.payload, loading: false }
    case 'SET_VIDEO_UPLOADING':
      return { ...state, videoUploading: action.payload }
    case 'SET_FIRST_IMPRESSION_STATUS_INIT_FETCH_DONE':
      return { ...state, firstImpressionStatusInitFetchDone: action.payload }
    default:
      return state
  }
}

// Actions
const fetchFirsImpressionStatus = (dispatch) => async () => {
  dispatch({ type: 'LOADING' })
  try {
    const response = await ngrokApi.get('/api/first-impression/status')
    dispatch({ type: 'FETCH_STATUS', payload: response.data })
    return
  } catch (error) {
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const fetchFirstImpression = (dispatch) => async () => {
  dispatch({ type: 'LOADING' })
  try {
    const response = await ngrokApi.get('/api/first-impression')
    dispatch({ type: 'FETCH', payload: response.data })
    return
  } catch (error) {
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const createUploadSignature =
  (dispatch) =>
  async (useEagerAsync = false) => {
    dispatch({ type: 'LOADING' })
    try {
      const response = await ngrokApi.post(
        '/api/cloudinary/signature-request-no-preset',
        { useEagerAsync }
      )
      if (response.data.error) {
        dispatch({ type: 'ADD_ERROR', payload: response.data.error })
        return
      }
      console.log('🔐 Signature response received:', {
        uploadPreset: response.data.uploadPreset,
        eager: response.data.eager,
        eagerAsync: response.data.eagerAsync,
        folder: response.data.folder,
        hasSignature: !!response.data.signature,
      })
      dispatch({ type: 'ADD_UPLOAD_SIGNATURE', payload: response.data })
      return
    } catch (error) {
      await ngrokApi.post('/error', { error: error })
      return
    }
  }

const clearUploadSignature = (dispatch) => () => {
  dispatch({ type: 'CLEAR_UPLOAD_SIGNATURE', payload: null })
}

const createFirstImpression = (dispatch) => async (videoData, callback) => {
  dispatch({ type: 'LOADING' })
  try {
    const response = await ngrokApi.post('/api/first-impression', videoData)
    dispatch({ type: 'CREATE', payload: response.data })
    // Call callback if provided (for navigation, cleanup, etc.)
    if (callback && typeof callback === 'function') {
      callback()
    }
    return
  } catch (error) {
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const deleteFirstImpression = (dispatch) => async (videoData) => {
  console.log('[First Impression Context] Delete request started:', videoData)
  dispatch({ type: 'LOADING' })
  try {
    console.log('[First Impression Context] Sending delete request to server...')
    const response = await ngrokApi.post(
      `/api/first-impression/delete`,
      videoData
    )
    console.log('[First Impression Context] Delete response received:', response.data)
    
    if (response.data?.error) {
      console.log('[First Impression Context] ❌ ERROR: Server returned error:', response.data.error)
      dispatch({ type: 'ADD_ERROR', payload: response.data.error })
      return
    }
    
    console.log('[First Impression Context] ✅ Delete successful, updating state...')
    dispatch({ type: 'DELETE', payload: response.data })
    return
  } catch (error) {
    console.log('[First Impression Context] ❌ ERROR: Exception during delete:', error)
    console.log('[First Impression Context] Error message:', error.message)
    dispatch({ type: 'ADD_ERROR', payload: 'Failed to delete first impression: ' + (error.message || 'Unknown error') })
    dispatch({ type: 'STOP_LOADING' })
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const addVideoObject = (dispatch) => async (video) => {
  dispatch({ type: 'ADD_VIDEO_OBJECT', payload: video })
  return
}

const clearVideoObject = (dispatch) => async (video) => {
  dispatch({ type: 'CLEAR_VIDEO_OBJECT', payload: null })
  return
}

const setLoadingForUploading = (dispatch) => () => {
  dispatch({ type: 'LOADING' })
}

const setVideoDemoShow = (dispatch) => (value) => {
  dispatch({ type: 'SET_VIDEO_DEMO_SHOW', payload: value })
}

const fetchDemoVideoUrl = (dispatch) => async () => {
  dispatch({ type: 'LOADING' })
  try {
    const response = await ngrokApi.get('/api/first-impression/demo')
    dispatch({ type: 'FETCH_DEMO_URL', payload: response.data })
    return
  } catch (error) {
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const setVideoUploading = (dispatch) => (value) => {
  dispatch({ type: 'SET_VIDEO_UPLOADING', payload: value })
}

const setFirstImpressionStatusInitFetchDone = (dispatch) => (value) => {
  dispatch({
    type: 'SET_FIRST_IMPRESSION_STATUS_INIT_FETCH_DONE',
    payload: value,
  })
}

export const { Context, Provider } = createDataContext(
  FirstImpressionReducer,
  {
    fetchFirsImpressionStatus,
    createFirstImpression,
    createUploadSignature,
    clearUploadSignature,
    fetchFirstImpression,
    deleteFirstImpression,
    addVideoObject,
    clearVideoObject,
    setLoadingForUploading,
    setVideoDemoShow,
    fetchDemoVideoUrl,
    setVideoUploading,
    setFirstImpressionStatusInitFetchDone,
  },
  // Initial state
  {
    firstImpression: null,
    firstImpressionStatus: null,
    loading: null,
    videoObject: null,
    uploadSignature: null,
    videoDemoShow: false,
    videoDemoUrl: null,
    error: null,
    videoUploading: false,
    firstImpressionStatusInitFetchDone: false,
  }
)
