import { employeeConstants } from './constants'
import axios from '../helpers/axios'

export const createEmployee = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.SAVE_EMPLOYEE_REQUEST })
    const res = await axios.post(`/admin/create_employee`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.SAVE_EMPLOYEE_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: employeeConstants.SAVE_EMPLOYEE_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const updateEmployee = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.UPDATE_EMPLOYEE_REQUEST })
    const res = await axios.post(`/admin/update_employee`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.UPDATE_EMPLOYEE_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: employeeConstants.UPDATE_EMPLOYEE_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const deleteEmployee = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.DELETE_EMPLOYEE_REQUEST })
    const res = await axios.post(`/admin/delete_employee`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.DELETE_EMPLOYEE_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: employeeConstants.DELETE_EMPLOYEE_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const getEmployees = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.GET_EMPLOYEES_REQUEST })
    const res = await axios.post(`/admin/get_employees`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.GET_EMPLOYEES_SUCCESS,
        payload: res.data,
      })
    } else {
      dispatch({
        type: employeeConstants.GET_EMPLOYEES_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const get_singleemployee = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.GET_SINGLEEMPLOYEE_REQUEST })
    const res = await axios.post(`/admin/get_singleemployee`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.GET_SINGLEEMPLOYEE_SUCCESS,
        payload: res.data.employee_data,
      })
    } else {
      if (res.status === 202) {
        dispatch({
          type: employeeConstants.GET_SINGLEEMPLOYEE_FAILURE,
          payload: { message: res.data.message },
        })
      }
    }
  }
}

export const createAssignProjects = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.SAVE_ASSIGNPROJECTS_REQUEST })
    const res = await axios.post(`/admin/create_assignproject`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.SAVE_ASSIGNPROJECTS_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: employeeConstants.SAVE_ASSIGNPROJECTS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const updateAssignProjects = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.UPDATE_ASSIGNPROJECTS_REQUEST })
    const res = await axios.post(`/admin/update_assignproject`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.UPDATE_ASSIGNPROJECTS_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: employeeConstants.UPDATE_ASSIGNPROJECTS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const deleteAssignProjects = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.DELETE_ASSIGNPROJECTS_REQUEST })
    const res = await axios.post(`/admin/deleteAssignproject`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.DELETE_ASSIGNPROJECTS_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: employeeConstants.DELETE_ASSIGNPROJECTS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const getAssignProjects = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.GET_ASSIGNPROJECTS_REQUEST })
    const res = await axios.post(`/admin/get_assigned_projects`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.GET_ASSIGNPROJECTS_SUCCESS,
        payload: res.data,
      })
    } else {
      dispatch({
        type: employeeConstants.GET_ASSIGNPROJECTS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const get_singleAssignProjects = (udata) => {
  return async (dispatch) => {
    dispatch({ type: employeeConstants.GET_SINGLEASSIGNPROJECTS_REQUEST })
    const res = await axios.post(`/admin/get_singleassignproject`, udata)

    if (res.status === 200) {
      dispatch({
        type: employeeConstants.GET_SINGLEASSIGNPROJECTS_SUCCESS,
        payload: res.data.assigned_project_data,
      })
    } else {
      if (res.status === 202) {
        dispatch({
          type: employeeConstants.GET_SINGLEASSIGNPROJECTS_FAILURE,
          payload: { message: res.data.message },
        })
      }
    }
  }
}
