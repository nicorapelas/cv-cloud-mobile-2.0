import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const UniversalReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true }
    case 'START_UP_FORM_LOADING':
      return { ...state, startUpFormLoading: true }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, startUpFormLoading: false }
    case 'CLEAR_ERRORS':
      return { ...state, error: null }
    case 'SHOW_BURGER_MENU':
      return { ...state, burgerMenuShow: true }
    case 'HIDE_BURGER_MENU':
      return { ...state, burgerMenuShow: false }
    case 'DELETE_MODAL_VISIBLE':
      return { ...state, deleteModalShow: true }
    case 'DELETE_MODAL_HIDE':
      return { ...state, deleteModalShow: false }
    case 'SERVER_MESSAGE_MODAL_VISIBLE':
      return { ...state, serverMessageModalShow: true }
    case 'SERVER_MESSAGE_MODAL_HIDE':
      return { ...state, serverMessageModalShow: false }
    case 'PROFICIENCY_SET':
      return { ...state, proficiency: action.payload }
    case 'PROFICIENCY_RESET':
      return { ...state, proficiency: '' }
    case 'TIP_SELECT_SET':
      return { ...state, tipSelected: action.payload }
    case 'TIP_SELECT_RESET':
      return { ...state, tipSelected: null }
    case 'CREATE_START_UP_INFO':
      return {
        ...state,
        startUpInfo: action.payload,
        startUpFormLoading: false,
      }
    case 'CREATE_CV':
      return { ...state, curriculumVitae: action.payload }
    case 'EDIT_CV':
      return { ...state, [action.payload._id]: action.payload }
    case 'FETCH_CV_ID':
      return { ...state, curriculumVitaeID: action.payload, loading: false }
    case 'SET_SHARE_CV_PHOTO_URL':
      return { ...state, shareCVAssignedPhotoUrl: action.payload }
    case 'CLEAR_SHARE_CV_PHOTO_URL':
      return { ...state, shareCVAssignedPhotoUrl: null }
    case 'HIDE_NAV_LINKS':
      return { ...state, hideNaveLink: action.payload }
    case 'TOGGLE_INSTRUCTION_MODAL':
      return { ...state, instructionModalShow: action.payload }
    case 'TOGGLE_PERMISSIONS_MODAL':
      return { ...state, permissionsModalShow: action.payload }
    case 'SET_OPTIONS_MODAL_SELECTED_OPTION':
      return { ...state, optionsModalSelectedOption: action.payload }
    case 'SET_OPTION_PICKER_SHOW':
      return { ...state, optionPickerShow: action.payload }
    case 'SET_OPTION_PICKER_PROPS':
      return { ...state, optionPickerProps: action.payload }
    case 'YEAR_PICKER_SHOW':
      return { ...state, yearPickerShow: action.payload }
    case 'YEAR_PICKER_PROPS':
      return { ...state, yearPickerProps: action.payload }
    case 'SET_START_YEAR':
      return { ...state, startYear: action.payload }
    case 'SET_END_YEAR':
      return { ...state, endYear: action.payload }
    case 'SET_START_MONTH':
      return { ...state, startMonth: action.payload }
    case 'SET_END_MONTH':
      return { ...state, endMonth: action.payload }
    case 'CLEAR_YEAR_PICKER_PROPS':
      return { ...state, yearPickerProps: action.payload }
    case 'MONTH_YEAR_PICKER_SHOW':
      return { ...state, monthYearPickerShow: action.payload }
    case 'MONTH_YEAR_PICKER_PROPS':
      return { ...state, monthYearPickerProps: action.payload }
    case 'CLEAR_MONTH_YEAR_PICKER_PROPS':
      return { ...state, monthYearPickerProps: action.payload }
    case 'SET_PHOTO_SAMPLE_VIEW_SHOW':
      return { ...state, showPhotoSample: action.payload }
    case 'SET_USER_PLATFORM_OS':
      return { ...state, userPlanformOS: action.payload }
    case 'SET_YEAT_SELECTED':
      return { ...state, yearSelected: action.payload }
    case 'SET_IMAGE_TO_VIEW_URL':
      return { ...state, imageToViewUrl: action.payload }
    case 'SET_INIT_DATA_FETCH_DONE':
      return { ...state, initDataFetchDone: action.payload }
    default:
      return state
  }
}

// Action
const createStartUpInfo = (dispatch) => async (formValues) => {
  dispatch({ type: 'START_UP_FORM_LOADING' })
  try {
    const response = await ngrokApi.post('/api/start-up', formValues)
    if (response.data.error) {
      dispatch({ type: 'ADD_ERROR', payload: response.data.error })
      return
    }
    dispatch({ type: 'CREATE_START_UP_INFO', payload: response.data })
  } catch (error) {
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const buildCV = (dispatch) => async () => {
  // Check if user has CV collection
  const curriculumVitaeCollection = await ngrokApi.get('/api/curriculum-vitae')
  if (curriculumVitaeCollection.data.length < 1) {
    // Create CV collection
    const response = await ngrokApi.post('/api/curriculum-vitae')
    dispatch({ type: 'CREATE_CV', payload: response.data })
    return
  } else {
    //Edit users CV
    const { _id } = curriculumVitaeCollection.data[0]
    const response = await ngrokApi.patch('/api/curriculum-vitae', { id: _id })
    dispatch({ type: 'EDIT_CV', payload: response.data })
    return
  }
}

const fetchCV_ID = (dispatch) => async () => {
  dispatch({ type: 'LOADING' })
  try {
    const response = await ngrokApi.get('/api/curriculum-vitae')
    dispatch({ type: 'FETCH_CV_ID', payload: response.data[0]._id })
    return
  } catch (error) {
    await ngrokApi.post('/error', { error: error })
    return
  }
}

const showBurgerMenu = (dispatch) => async () => {
  dispatch({ type: 'SHOW_BURGER_MENU' })
  return
}

const hideBurgerMenu = (dispatch) => async () => {
  dispatch({ type: 'HIDE_BURGER_MENU' })
  return
}

const showDeleteModal = (dispatch) => async () => {
  dispatch({ type: 'DELETE_MODAL_VISIBLE' })
  return
}

const hideDeleteModal = (dispatch) => async () => {
  dispatch({ type: 'DELETE_MODAL_HIDE' })
  return
}

const showServerMessageModal = (dispatch) => async () => {
  dispatch({ type: 'SERVER_MESSAGE_MODAL_VISIBLE' })
  return
}

const hideServerMessageModal = (dispatch) => async () => {
  dispatch({ type: 'SERVER_MESSAGE_MODAL_HIDE' })
  return
}

const setProficiency = (dispatch) => async (number) => {
  dispatch({ type: 'PROFICIENCY_SET', payload: number })
  return
}

const resetProficiency = (dispatch) => async () => {
  dispatch({ type: 'PROFICIENCY_RESET' })
  return
}

const tipSelect = (dispatch) => async (tip) => {
  dispatch({ type: 'TIP_SELECT_SET', payload: tip })
  return
}

const tipSelectReset = (dispatch) => async () => {
  dispatch({ type: 'TIP_SELECT_RESET' })
  return
}

const clearErrors = (dispatch) => async () => {
  dispatch({ type: 'CLEAR_ERRORS' })
  return
}

const toggleHideNavLinks = (dispatch) => async (value) => {
  dispatch({ type: 'HIDE_NAV_LINKS', payload: value })
  return
}

const toggleInstructionModal = (dispatch) => async (show) => {
  dispatch({ type: 'TOGGLE_INSTRUCTION_MODAL', payload: show })
  return
}

const togglePermissionsModal = (dispatch) => async (show) => {
  dispatch({ type: 'TOGGLE_PERMISSIONS_MODAL', payload: show })
  return
}

const setOptionsModalSelectedOption = (dispatch) => async (option) => {
  dispatch({
    type: 'SET_OPTIONS_MODAL_SELECTED_OPTION',
    payload: option,
  })
  return
}

const setOptionPickerShow = (dispatch) => async (value) => {
  dispatch({ type: 'SET_OPTION_PICKER_SHOW', payload: value })
}

const setOptionPickerProps = (dispatch) => async (value) => {
  dispatch({ type: 'SET_OPTION_PICKER_PROPS', payload: value })
}

const setYearPickerShow = (dispatch) => (value) => {
  dispatch({ type: 'YEAR_PICKER_SHOW', payload: value })
  return
}
const setYearPickerProps = (dispatch) => (props) => {
  dispatch({ type: 'YEAR_PICKER_PROPS', payload: props })
}

const setStartYear = (dispatch) => (props) => {
  dispatch({ type: 'SET_START_YEAR', payload: props })
}

const setEndYear = (dispatch) => (props) => {
  dispatch({ type: 'SET_END_YEAR', payload: props })
}

const setStartMonth = (dispatch) => (props) => {
  dispatch({ type: 'SET_START_MONTH', payload: props })
}

const setEndMonth = (dispatch) => (props) => {
  dispatch({ type: 'SET_END_MONTH', payload: props })
}

const clearYearPickerProps = (dispatch) => () => {
  dispatch({ type: 'CLEAR_YEAR_PICKER_PROPS', payload: null })
}

const setMonthYearPickerShow = (dispatch) => (value) => {
  dispatch({ type: 'MONTH_YEAR_PICKER_SHOW', payload: value })
  return
}
const setMonthYearPickerProps = (dispatch) => (props) => {
  dispatch({ type: 'MONTH_YEAR_PICKER_PROPS', payload: props })
}
const clearMonthYearPickerProps = (dispatch) => () => {
  dispatch({ type: 'CLEAR_MONTH_YEAR_PICKER_PROPS', payload: null })
}

const setPhotoSampleViewShow = (dispatch) => (value) => {
  dispatch({ type: 'SET_PHOTO_SAMPLE_VIEW_SHOW', payload: value })
}

const setUserPlatformOS = (dispatch) => (value) => {
  dispatch({ type: 'SET_USER_PLATFORM_OS', payload: value })
}

const setYearSelected = (dispatch) => (value) => {
  dispatch({ type: 'SET_YEAT_SELECTED', payload: value })
}

const setImageToViewUrl = (dispatch) => (data) => {
  dispatch({ type: 'SET_IMAGE_TO_VIEW_URL', payload: data })
}

const setInitDataFetchDone = (dispatch) => (value) => {
  dispatch({ type: 'SET_INIT_DATA_FETCH_DONE', payload: value })
}

const setShareCVPhotoUrl = (dispatch) => (photoUrl) => {
  dispatch({ type: 'SET_SHARE_CV_PHOTO_URL', payload: photoUrl })
}

const clearShareCVPhotoUrl = (dispatch) => () => {
  dispatch({ type: 'CLEAR_SHARE_CV_PHOTO_URL' })
}

export const { Context, Provider } = createDataContext(
  UniversalReducer,
  {
    createStartUpInfo,
    showDeleteModal,
    hideDeleteModal,
    showBurgerMenu,
    hideBurgerMenu,
    showServerMessageModal,
    hideServerMessageModal,
    setProficiency,
    resetProficiency,
    tipSelect,
    tipSelectReset,
    clearErrors,
    buildCV,
    fetchCV_ID,
    toggleHideNavLinks,
    toggleInstructionModal,
    togglePermissionsModal,
    setOptionsModalSelectedOption,
    setYearPickerShow,
    setYearPickerProps,
    setStartYear,
    setEndYear,
    setStartMonth,
    setEndMonth,
    clearYearPickerProps,
    setMonthYearPickerShow,
    setMonthYearPickerProps,
    clearMonthYearPickerProps,
    setPhotoSampleViewShow,
    setOptionPickerShow,
    setOptionPickerProps,
    setUserPlatformOS,
    setYearSelected,
    setImageToViewUrl,
    setInitDataFetchDone,
    setShareCVPhotoUrl,
    clearShareCVPhotoUrl,
  },
  // Initial state
  {
    deleteModalShow: false,
    serverMessageModalShow: false,
    burgerMenuShow: false,
    instructionModalShow: false,
    permissionsModalShow: false,
    proficiency: null,
    tipSelected: null,
    loading: null,
    startUpFormLoading: null,
    startUpInfo: null,
    error: null,
    curriculumVitae: null,
    curriculumVitaeID: null,
    hideNaveLink: false,
    optionsModalSelectedOption: null,
    yearPickerShow: false,
    yearPickerProps: null,
    startYear: null,
    endYear: null,
    startMonth: null,
    endMonth: null,
    monthYearPickerShow: false,
    monthYearPickerProps: null,
    showPhotoSample: null,
    optionPickerShow: false,
    optionPickerProps: null,
    userPlanformOS: 'android',
    yearSelected: null,
    imageToViewUrl: null,
    initDataFetchDone: false,
    shareCVAssignedPhotoUrl: null,
  }
)
