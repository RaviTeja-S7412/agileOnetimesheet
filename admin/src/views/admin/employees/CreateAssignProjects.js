import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CButton,
} from '@coreui/react'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import {
  createAssignProjects,
  updateAssignProjects,
  get_singleAssignProjects,
} from 'src/actions/employees.actions'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { get_allprojects } from 'src/actions/projects.actions'
import { get_employees } from 'src/helpers/Admin'

const CreateClient = () => {
  const dispatch = useDispatch()
  const location = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get('id')
  const get_employee = useSelector((state) => state.employees)
  const projects = useSelector((state) => state.clients)
  const get_allemployees = useSelector((state) => state.admin)
  const login_user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))

  const [project, setProject] = useState('')
  const [uproject, setUProject] = useState('')
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    if (id) {
      dispatch(get_singleAssignProjects({ user_id: id }))
    } else {
      setProject('')
      setEmployees([])
      setUProject('')
    }
    if (get_employee && get_employee.is_assigned_project_added) {
      location(get_allemployees.get_data.uploads_folder + 'admin/employees/assign-projects')
    }
  }, [id, get_employee.is_assigned_project_added])

  useEffect(() => {
    if (get_employee.assign_project_data && id) {
      setProject(get_employee.assign_project_data && get_employee.assign_project_data.project_id)
      setUProject(get_employee.assign_project_data && get_employee.assign_project_data.project_id)
      setEmployees(get_employee.assign_project_data && get_employee.assign_project_data.employees)
    }
  }, [get_employee.assign_project_data, id])

  const saveData = (e) => {
    e.preventDefault()
    var selEmployees = []
    employees.forEach((emp) => {
      selEmployees.push(emp.value)
    })
    var fdata = {
      project_id: typeof project === 'object' ? project.value : uproject,
      employees: selEmployees,
      team_lead: login_user && login_user._id,
    }
    if (id === null) {
      dispatch(createAssignProjects(fdata))
    } else {
      fdata['id'] = id
      dispatch(updateAssignProjects(fdata))
    }
  }

  let all_projects = projects && projects.all_clients
  const projects_data = []
  if (all_projects) {
    var index = 0
    all_projects.forEach((element) => {
      if (project == element.id) {
        setProject(index)
      }
      projects_data.push({
        label: element.project_name,
        value: element.id,
      })
      index++
    })
  }

  useEffect(() => {
    if (all_projects.length === 0) {
      dispatch(get_allprojects())
    }
  }, [all_projects, dispatch])

  // employees start

  let all_employees = get_allemployees && get_allemployees.employees
  const employees_data = []
  if (all_employees && all_employees.length > 0) {
    all_employees.forEach((emp) => {
      employees_data.push({
        label: emp.employee_name,
        value: emp._id,
      })
    })
  }

  useEffect(() => {
    if (get_allemployees.get_employees) {
      dispatch(get_employees(login_user._id))
    }
  }, [get_allemployees.get_employees, dispatch])
  // employees end

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3 border-top-primary border-top-3">
            <CCardHeader>
              <strong>{id === null ? 'Create' : 'Update'} Assign Project</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={saveData} id="fdata">
                <CRow>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="project">Projects</CFormLabel>
                      <Select
                        className="basic-single"
                        classNamePrefix="Select Projects"
                        value={projects_data && projects_data[project]}
                        name="project"
                        options={projects_data}
                        required
                        onChange={(e) => setProject(e)}
                      />
                    </div>
                  </CCol>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="employees">Employees</CFormLabel>
                      <Select
                        className="basic-single"
                        classNamePrefix="Select Projects"
                        value={employees}
                        name="employees"
                        options={employees_data}
                        required
                        isMulti
                        onChange={(e) => setEmployees(e)}
                      />
                    </div>
                  </CCol>
                  <CCol xs={4} style={{ marginTop: '30px' }}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="role"></CFormLabel>
                      <CButton color="primary" type="submit">
                        Submit
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CreateClient
