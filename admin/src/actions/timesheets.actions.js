import { timesheetConstants } from './constants'
import axios from '../helpers/axios'

export const Create_Timesheet = (udata) => {
  return async (dispatch) => {
    dispatch({ type: timesheetConstants.SAVE_TIMESHEET_REQUEST })
    const res = await axios.post(`/admin/create_timesheet`, udata)

    if (res.status === 200) {
      dispatch({
        type: timesheetConstants.SAVE_TIMESHEET_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: timesheetConstants.SAVE_TIMESHEET_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const updateTimesheet = (udata) => {
  return async (dispatch) => {
    dispatch({ type: timesheetConstants.UPDATE_TIMESHEET_REQUEST })
    const res = await axios.post(`/admin/update_timesheet`, udata)

    if (res.status === 200) {
      dispatch({
        type: timesheetConstants.UPDATE_TIMESHEET_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: timesheetConstants.UPDATE_TIMESHEET_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const deleteTimesheet = (udata) => {
  return async (dispatch) => {
    dispatch({ type: timesheetConstants.DELETE_TIMESHEET_REQUEST })
    const res = await axios.post(`/admin/deleteTimesheet`, udata)

    if (res.status === 200) {
      dispatch({
        type: timesheetConstants.DELETE_TIMESHEET_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: timesheetConstants.DELETE_TIMESHEET_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const getTimesheets = (udata) => {
  return async (dispatch) => {
    dispatch({ type: timesheetConstants.GET_TIMESHEETS_REQUEST })
    const res = await axios.post(`/admin/get_timesheets`, udata)

    if (res.status === 200) {
      dispatch({
        type: timesheetConstants.GET_TIMESHEETS_SUCCESS,
        payload: res.data,
      })
    } else {
      dispatch({
        type: timesheetConstants.GET_TIMESHEETS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const get_singletimesheet = (udata) => {
  return async (dispatch) => {
    dispatch({ type: timesheetConstants.GET_SINGLETIMESHEET_REQUEST })
    const res = await axios.post(`/admin/get_singletimesheet`, udata)

    if (res.status === 200) {
      dispatch({
        type: timesheetConstants.GET_SINGLETIMESHEET_SUCCESS,
        payload: res.data.timesheet_data,
      })
    } else {
      if (res.status === 202) {
        dispatch({
          type: timesheetConstants.GET_SINGLETIMESHEET_FAILURE,
          payload: { message: res.data.message },
        })
      }
    }
  }
}
