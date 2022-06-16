/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
import { employeeConstants } from '../actions/constants'

const initState = {
  loading: false,
  error: null,
  employees: [],
  get_employees: true,
  get_singleemployee: true,
  is_employee_added: false,
  assigned_projects: [],
  get_assigned_projects: true,
  get_singleassigned_project: true,
  is_assigned_project_added: false,
  pageIndex: 0,
  total_pages: 0,
  total_users_count: 0,
  prevPage: false,
  nextPage: false,
}

export default (state = initState, action) => {
  switch (action.type) {
    case employeeConstants.SAVE_EMPLOYEE_REQUEST:
      state = {
        ...state,
        loading: true,
        get_employees: false,
        is_employee_added: false,
      }
      break
    case employeeConstants.SAVE_EMPLOYEE_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_employees: true,
        is_employee_added: true,
        message: action.payload.message,
      }
      break
    case employeeConstants.SAVE_EMPLOYEE_FAILURE:
      state = {
        ...state,
        loading: false,
        get_employees: false,
        is_employee_added: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.UPDATE_EMPLOYEE_REQUEST:
      state = {
        ...state,
        loading: true,
        get_employees: false,
        is_employee_added: false,
      }
      break
    case employeeConstants.UPDATE_EMPLOYEE_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_employees: true,
        is_employee_added: true,
        message: action.payload.message,
      }
      break
    case employeeConstants.UPDATE_EMPLOYEE_FAILURE:
      state = {
        ...state,
        loading: false,
        get_employees: false,
        is_employee_added: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.DELETE_EMPLOYEE_REQUEST:
      state = {
        ...state,
        loading: true,
        get_employees: false,
        is_employee_added: false,
      }
      break
    case employeeConstants.DELETE_EMPLOYEE_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_employees: true,
        is_employee_added: true,
        message: action.payload.message,
      }
      break
    case employeeConstants.DELETE_EMPLOYEE_FAILURE:
      state = {
        ...state,
        loading: false,
        get_employees: false,
        is_employee_added: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.GET_EMPLOYEES_REQUEST:
      state = {
        ...state,
        loading: true,
        get_employees: true,
        is_employee_added: false,
      }
      break
    case employeeConstants.GET_EMPLOYEES_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_employees: false,
        is_employee_added: false,
        employees: action.payload.total_users,
        pageIndex: action.payload.pageIndex,
        total_pages: action.payload.total_pages,
        total_users_count: action.payload.total_users_count,
        prevPage: action.payload.prevPage,
        nextPage: action.payload.nextPage,
      }
      break
    case employeeConstants.GET_EMPLOYEES_FAILURE:
      state = {
        ...state,
        loading: false,
        get_employees: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.GET_SINGLEEMPLOYEE_REQUEST:
      state = {
        ...state,
        loading: true,
        get_singleemployee: true,
      }
      break
    case employeeConstants.GET_SINGLEEMPLOYEE_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_singleemployee: false,
        employee_data: action.payload,
      }
      break
    case employeeConstants.GET_SINGLEEMPLOYEE_FAILURE:
      state = {
        ...state,
        loading: false,
        get_singleemployee: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.SAVE_ASSIGNPROJECTS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_assigned_projects: false,
        is_assigned_project_added: false,
      }
      break
    case employeeConstants.SAVE_ASSIGNPROJECTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: true,
        is_assigned_project_added: true,
        message: action.payload.message,
      }
      break
    case employeeConstants.SAVE_ASSIGNPROJECTS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: false,
        is_assigned_project_added: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.UPDATE_ASSIGNPROJECTS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_assigned_projects: false,
        is_assigned_project_added: false,
      }
      break
    case employeeConstants.UPDATE_ASSIGNPROJECTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: true,
        is_assigned_project_added: true,
        message: action.payload.message,
      }
      break
    case employeeConstants.UPDATE_ASSIGNPROJECTS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: false,
        is_assigned_project_added: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.DELETE_ASSIGNPROJECTS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_assigned_projects: false,
        is_assigned_project_added: false,
      }
      break
    case employeeConstants.DELETE_ASSIGNPROJECTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: true,
        is_assigned_project_added: true,
        message: action.payload.message,
      }
      break
    case employeeConstants.DELETE_ASSIGNPROJECTS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: false,
        is_assigned_project_added: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.GET_ASSIGNPROJECTS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_assigned_projects: true,
        is_assigned_project_added: false,
      }
      break
    case employeeConstants.GET_ASSIGNPROJECTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: false,
        is_assigned_project_added: false,
        assigned_projects: action.payload.total_users,
        pageIndex: action.payload.pageIndex,
        total_pages: action.payload.total_pages,
        total_users_count: action.payload.total_users_count,
        prevPage: action.payload.prevPage,
        nextPage: action.payload.nextPage,
      }
      break
    case employeeConstants.GET_ASSIGNPROJECTS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_assigned_projects: false,
        message: action.payload.message,
      }
      break
    case employeeConstants.GET_SINGLEASSIGNPROJECTS_REQUEST:
      state = {
        ...state,
        loading: true,
        get_singleassigned_project: true,
      }
      break
    case employeeConstants.GET_SINGLEASSIGNPROJECTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        get_singleassigned_project: false,
        assign_project_data: action.payload,
      }
      break
    case employeeConstants.GET_SINGLEASSIGNPROJECTS_FAILURE:
      state = {
        ...state,
        loading: false,
        get_singleassigned_project: false,
        message: action.payload.message,
      }
      break
  }

  return state
}
