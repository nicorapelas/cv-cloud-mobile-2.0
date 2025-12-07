import createDataContext from './createDataContext'
import ngrokApi from '../api/ngrok'

// Reducer
const PublicCVReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true }
    case 'FETCH_STATUS':
      return {
        ...state,
        isListed: action.payload.isListed,
        publicCV: action.payload.publicCV,
        loading: false,
      }
    case 'TOGGLE_SUCCESS':
      return {
        ...state,
        isListed: action.payload.isListed,
        publicCV: action.payload.publicCV,
        loading: false,
      }
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

// Actions
const fetchPublicCVStatus = (dispatch) => async () => {
  try {
    dispatch({ type: 'LOADING' })
    const response = await ngrokApi.get('/api/public-cv/status')
    dispatch({ type: 'FETCH_STATUS', payload: response.data })
  } catch (error) {
    dispatch({
      type: 'ERROR',
      payload: 'Failed to fetch CV visibility status',
    })
  }
}

const togglePublicCV =
  (dispatch) =>
  async (industries = []) => {
    try {
      dispatch({ type: 'LOADING' })
      const response = await ngrokApi.post('/api/public-cv/toggle', {
        industries,
      })
      dispatch({ type: 'TOGGLE_SUCCESS', payload: response.data })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to toggle CV visibility'
      dispatch({
        type: 'ERROR',
        payload: errorMessage,
      })
      throw new Error(errorMessage)
    }
  }

const clearError = (dispatch) => () => {
  dispatch({ type: 'CLEAR_ERROR' })
}

export const { Context, Provider } = createDataContext(
  PublicCVReducer,
  {
    fetchPublicCVStatus,
    togglePublicCV,
    clearError,
  },
  // Initial state
  {
    loading: false,
    isListed: false,
    publicCV: null,
    error: null,
  }
)








