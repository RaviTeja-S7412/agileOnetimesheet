/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
import { timesheetConstants } from '../actions/constants'

const initState = {
  loading: false,
  error: null,
  timesheets: [],
  all_timesheets: [],
  get_timesheets: true,
  get_alltimesheets: true,
  get_singletimesheet: true,
  is_timesheet_added: false,
  pageIndex: 0,
  total_pages: 0,
  total_users_count: 0,
  prevPage: false,
  nextPage: false,
}

export default (state = initState, action) => {
  switch (action.type) {
    case timesheetConstants.SAVE_TIMESHEET_REQUEST:
      state = {
        ...state,
        loading: true,
        get_timesheets: false,
        is_timesheet_added: false,
      }
      break
    case timesheetConstants.SAVE_TIMESHEET_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_timesheets: true,
        is_timesheet_added: true,
        message: action.payload.message,
      }
      break
    case timesheetConstants.SAVE_TIMESHEET_FAILURE:
      state = {
        ...state,
        loading: false,
        get_timesheets: false,
        is_timesheet_added: false,
        message: action.payload.message,
      }
      break
    case timesheetConstants.UPDATE_TIMESHEET_REQUEST:
      state = {
        ...state,
        loading: true,
        get_timesheets: false,
        is_timesheet_added: false,
      }
      break
    case timesheetConstants.UPDATE_TIMESHEET_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_timesheets: true,
        is_timesheet_added: true,
        message: action.payload.message,
      }
      break
    case timesheetConstants.UPDATE_TIMESHEET_FAILURE:
      state = {
        ...state,
        loading: false,
        get_timesheets: false,
        is_timesheet_added: false,
        message: action.payload.message,
      }
      break
    case timesheetConstants.DELETE_TIMESHEET_REQUEST:
      state = {
        ...state,
        loading: true,
        get_timesheets: false,
        is_timesheet_added: false,
      }
      break
    case timesheetConstants.DELETE_TIMESHEET_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_timesheets: true,
        is_timesheet_added: true,
        message: action.payload.message,
      }
      break
    case timesheetConstants.DELETE_TIMESHEET_FAILURE:
      state = {
        ...state,
        loading: false,
        get_timesheets: false,
        is_timesheet_added: false,
        message: action.payload.message,
      }
      break
    case timesheetConstants.GET_TIMESHEETS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_timesheets: true,
        is_timesheet_added: false,
      }
      break
    case timesheetConstants.GET_TIMESHEETS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_timesheets: false,
        is_timesheet_added: false,
        timesheets: action.payload.total_users,
        pageIndex: action.payload.pageIndex,
        total_pages: action.payload.total_pages,
        total_users_count: action.payload.total_users_count,
        prevPage: action.payload.prevPage,
        nextPage: action.payload.nextPage,
      }
      break
    case timesheetConstants.GET_TIMESHEETS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_timesheets: false,
        message: action.payload.message,
      }
      break
    case timesheetConstants.GET_ALLTIMESHEETS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_alltimesheets: true,
      }
      break
    case timesheetConstants.GET_ALLTIMESHEETS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_alltimesheets: false,
        all_timesheets: action.payload.all_projects,
      }
      break
    case timesheetConstants.GET_ALLTIMESHEETS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_alltimesheets: false,
        message: action.payload.message,
      }
      break
    case timesheetConstants.GET_SINGLETIMESHEET_REQUEST:
      state = {
        ...state,
        loading: true,
        timesheet_data: {},
        get_singletimesheet: true,
      }
      break
    case timesheetConstants.GET_SINGLETIMESHEET_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_singletimesheet: false,
        timesheet_data: action.payload,
      }
      break
    case timesheetConstants.GET_SINGLETIMESHEET_FAILURE:
      state = {
        ...state,
        loading: false,
        get_singletimesheet: false,
        message: action.payload.message,
      }
      break
  }

  return state
}
