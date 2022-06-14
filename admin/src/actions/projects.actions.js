import { clientConstants } from './constants'
import axios from '../helpers/axios'

export const createProject = (udata) => {
  return async (dispatch) => {
    dispatch({ type: clientConstants.SAVE_CLIENT_REQUEST })
    const res = await axios.post(`/admin/create_project`, udata)

    if (res.status === 200) {
      dispatch({
        type: clientConstants.SAVE_CLIENT_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: clientConstants.SAVE_CLIENT_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const updateProject = (udata) => {
  return async (dispatch) => {
    dispatch({ type: clientConstants.UPDATE_CLIENT_REQUEST })
    const res = await axios.post(`/admin/update_project`, udata)

    if (res.status === 200) {
      dispatch({
        type: clientConstants.UPDATE_CLIENT_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: clientConstants.UPDATE_CLIENT_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const deleteProject = (udata) => {
  return async (dispatch) => {
    dispatch({ type: clientConstants.DELETE_CLIENT_REQUEST })
    const res = await axios.post(`/admin/delete_project`, udata)

    if (res.status === 200) {
      dispatch({
        type: clientConstants.DELETE_CLIENT_SUCCESS,
        payload: { message: res.data.message },
      })
    } else {
      dispatch({
        type: clientConstants.DELETE_CLIENT_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const getProjects = (udata) => {
  return async (dispatch) => {
    dispatch({ type: clientConstants.GET_CLIENTS_REQUEST })
    const res = await axios.post(`/admin/get_projects`, udata)

    if (res.status === 200) {
      dispatch({
        type: clientConstants.GET_CLIENTS_SUCCESS,
        payload: res.data,
      })
    } else {
      dispatch({
        type: clientConstants.GET_CLIENTS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const get_allprojects = () => {
  return async (dispatch) => {
    dispatch({ type: clientConstants.GET_ALLCLIENTS_REQUEST })
    const res = await axios.get(`/admin/get_allprojects`)

    if (res.status === 200) {
      dispatch({
        type: clientConstants.GET_ALLCLIENTS_SUCCESS,
        payload: res.data,
      })
    } else {
      dispatch({
        type: clientConstants.GET_ALLCLIENTS_FAILURE,
        payload: { message: res.data.message },
      })
    }
  }
}

export const get_singleproject = (udata) => {
  return async (dispatch) => {
    dispatch({ type: clientConstants.GET_SINGLECLIENT_REQUEST })
    const res = await axios.post(`/admin/get_singleproject`, udata)

    if (res.status === 200) {
      dispatch({
        type: clientConstants.GET_SINGLECLIENT_SUCCESS,
        payload: res.data.project_data,
      })
    } else {
      if (res.status === 202) {
        dispatch({
          type: clientConstants.GET_SINGLECLIENT_FAILURE,
          payload: { message: res.data.message },
        })
      }
    }
  }
}
