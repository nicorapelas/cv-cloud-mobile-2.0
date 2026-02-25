import createDataContext from './createDataContext'

// Reducer
const NavReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCREEN_SELECTED':
      return { ...state, screenSelected: action.payload }
    case 'SET_NAV_TAB_SELECTED':
      return {
        ...state,
        navTabSelected: action.payload,
        ...(action.payload !== 'classifiedAds' ? { classifiedAdDetailId: null } : {}),
      }
    case 'SET_CV_BIT_SCREEN_SELECTED':
      return { ...state, CVBitScreenSelected: action.payload }
    case 'SET_CLASSIFIED_AD_DETAIL_ID':
      return { ...state, classifiedAdDetailId: action.payload }
    default:
      return state
  }
}

// Actions
const setScreenSelected = (dispatch) => (data) => {
  dispatch({ type: 'SET_SCREEN_SELECTED', payload: data })
}

const setNavTabSelected = (dispatch) => (data) => {
  dispatch({ type: 'SET_NAV_TAB_SELECTED', payload: data })
}

const setCVBitScreenSelected = (dispatch) => (data) => {
  dispatch({ type: 'SET_CV_BIT_SCREEN_SELECTED', payload: data })
}

const setClassifiedAdDetailId = (dispatch) => (data) => {
  dispatch({ type: 'SET_CLASSIFIED_AD_DETAIL_ID', payload: data })
}

export const { Provider, Context } = createDataContext(
  NavReducer,
  {
    setScreenSelected,
    setNavTabSelected,
    setCVBitScreenSelected,
    setClassifiedAdDetailId,
  },
  {
    screenSelected: 'registerOrLogin',
    navTabSelected: 'dashboard',
    CVBitScreenSelected: '',
    classifiedAdDetailId: null,
  }
)
