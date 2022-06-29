import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormTextarea,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { createProject, updateProject, get_singleproject } from 'src/actions/projects.actions'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CreateClient = () => {
  const dispatch = useDispatch()
  const location = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get('id')
  const get_client = useSelector((state) => state.clients)
  const auth = JSON.parse(localStorage.getItem('user'))
  const udata = useSelector((state) => state.admin)
  const [client_name, setClientname] = useState('')
  const [project_name, setProjectname] = useState('')
  const [project_start_date, setProjectstartdate] = useState('')
  const [project_due_date, setProjectduedate] = useState('')
  const [project_description, setProjectdescription] = useState('')

  useEffect(() => {
    if (id) {
      dispatch(get_singleproject({ user_id: id }))
    } else {
      setClientname('')
      setProjectname('')
      setProjectstartdate('')
      setProjectduedate('')
      setProjectdescription('')
    }
    if (get_client && get_client.is_client_added) {
      location(udata.get_data.uploads_folder + 'admin/projects')
    }
  }, [id, get_client.is_client_added])

  useEffect(() => {
    if (get_client.client_data && id) {
      setClientname(get_client.client_data && get_client.client_data.client_name)
      setProjectname(get_client.client_data && get_client.client_data.project_name)
      setProjectstartdate(get_client.client_data && get_client.client_data.project_start_date)
      setProjectduedate(get_client.client_data && get_client.client_data.project_due_date)
      setProjectdescription(get_client.client_data && get_client.client_data.project_description)
    }
  }, [get_client.client_data, id])

  const saveData = (e) => {
    e.preventDefault()
    var fdata = {
      client_name: client_name,
      project_name: project_name,
      project_start_date: project_start_date,
      project_due_date: project_due_date,
      project_description: project_description,
    }
    if (id === null) {
      dispatch(createProject(fdata))
    } else {
      fdata['id'] = id
      dispatch(updateProject(fdata))
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3 border-top-primary border-top-3">
            <CCardHeader>
              <strong>{id === null ? 'Create' : 'Update'} Project</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={saveData} id="fdata">
                <CRow>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="name">Client Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="name"
                        name="client_name"
                        required
                        placeholder="Enter Client Name"
                        defaultValue={client_name}
                        autoComplete="off"
                        onChange={(e) => setClientname(e.target.value)}
                      />
                    </div>
                  </CCol>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="name">Project Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="name"
                        name="project_name"
                        required
                        placeholder="Enter Project Name"
                        defaultValue={project_name}
                        autoComplete="off"
                        onChange={(e) => setProjectname(e.target.value)}
                      />
                    </div>
                  </CCol>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="name">Project Start Date</CFormLabel>
                      <CFormInput
                        type="date"
                        id="name"
                        name="project_start_date"
                        required
                        placeholder="Project Start Date"
                        defaultValue={project_start_date}
                        autoComplete="off"
                        onChange={(e) => setProjectstartdate(e.target.value)}
                      />
                    </div>
                  </CCol>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="name">Project Due Date</CFormLabel>
                      <CFormInput
                        type="date"
                        id="name"
                        name="project_due_date"
                        required
                        placeholder="Project Due Date"
                        defaultValue={project_due_date}
                        autoComplete="off"
                        onChange={(e) => setProjectduedate(e.target.value)}
                      />
                    </div>
                  </CCol>
                  <CCol xs={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="name">Project Description</CFormLabel>
                      <CFormTextarea
                        type="date"
                        id="name"
                        name="project_description"
                        required
                        placeholder="Project Description"
                        defaultValue={project_description}
                        autoComplete="off"
                        onChange={(e) => setProjectdescription(e.target.value)}
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
