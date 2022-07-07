/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-script-url */
import React, { useEffect, useState } from 'react'
import { CRow, CCol, CWidgetStatsB } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { get_dashboard_data } from 'src/helpers/Admin'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const dispatch = useDispatch()
  const auth = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  const admin = useSelector((state) => state.admin)
  const dashboard_data = admin.dashboard_data && admin.dashboard_data[0]
  const location = useNavigate()

  const [submittedLink, setSubmittedlink] = useState('')
  const [pendingLink, setPendinglink] = useState('')
  const [approvedLink, setApprovedlink] = useState('')
  const [rejectedLink, setRejectedlink] = useState('')

  useEffect(() => {
    if (admin.get_dashboard_data) {
      dispatch(get_dashboard_data())
    }

    if (dashboard_data && dashboard_data.SubmittedDates) {
      setSubmittedlink(dashboard_data.SubmittedDates[0] && dashboard_data.SubmittedDates[0]['id'])
    }
    if (dashboard_data && dashboard_data.PendingDates) {
      setPendinglink(dashboard_data.PendingDates[0] && dashboard_data.PendingDates[0]['id'])
    }
    if (dashboard_data && dashboard_data.ApprovedDates) {
      setApprovedlink(dashboard_data.ApprovedDates[0] && dashboard_data.ApprovedDates[0]['id'])
    }
    if (dashboard_data && dashboard_data.RejectedDates) {
      setRejectedlink(dashboard_data.RejectedDates[0] && dashboard_data.RejectedDates[0]['id'])
    }
  }, [admin.get_dashboard_data])

  const submitLink = () => {
    location(
      submittedLink
        ? admin.get_data.uploads_folder +
            'admin/time-sheets/view-time-sheet?status=submitted&id=' +
            submittedLink +
            '&page=0'
        : '#',
    )
  }
  const pendLink = () => {
    location(
      pendingLink
        ? admin.get_data.uploads_folder +
            'admin/time-sheets/update-time-sheet?status=pending&id=' +
            pendingLink +
            '&page=0'
        : '#',
    )
  }
  const apprLink = () => {
    location(
      approvedLink
        ? admin.get_data.uploads_folder +
            'admin/time-sheets/view-time-sheet?status=approved&id=' +
            approvedLink +
            '&page=0'
        : '#',
    )
  }
  const rejLink = () => {
    location(
      rejectedLink
        ? admin.get_data.uploads_folder +
            'admin/time-sheets/view-time-sheet?status=rejected&id=' +
            rejectedLink +
            '&page=0'
        : '#',
    )
  }

  // status codes
  // 1 for pending timesheets
  // 2 for submitted timesheets
  // 3 for approved timesheets
  // 0 for rejected timesheets

  return (
    <>
      <CRow>
        {auth.role === 1 ? (
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              value={dashboard_data ? dashboard_data.TEAMLCount : 0}
              title="Team Leads"
              progress={{ color: 'info', value: 89.9 }}
              // text="Lorem ipsum dolor sit amet enim."
            />
          </CCol>
        ) : (
          ''
        )}
        {auth.role === 1 || auth.role === 2 ? (
          <CCol xs={12} sm={6} lg={3}>
            <a href={admin.get_data.uploads_folder + 'admin/employees'} style={{ color: '#000' }}>
              <CWidgetStatsB
                className="mb-4"
                value={dashboard_data ? dashboard_data.EMPCount : 0}
                title="Employees"
                progress={{ color: 'warning', value: 89.9 }}
                // text="Lorem ipsum dolor sit amet enim."
              />
            </a>
          </CCol>
        ) : (
          ''
        )}
        {auth.role === 1 || auth.role === 2 ? (
          <CCol xs={12} sm={6} lg={3}>
            <a
              href={admin.get_data.uploads_folder + 'admin/employees/assign-projects'}
              style={{ color: '#000' }}
            >
              <CWidgetStatsB
                className="mb-4"
                value={dashboard_data ? dashboard_data.PROJECTCount : 0}
                title="Projects"
                progress={{ color: 'primary', value: 89.9 }}
                // text="Lorem ipsum dolor sit amet enim."
              />
            </a>
          </CCol>
        ) : (
          ''
        )}
        {auth.role === 3 || auth.role === 2 ? (
          <>
            <CCol xs={12} sm={6} lg={3}>
              <a onClick={submitLink} style={{ color: '#000', cursor: 'pointer' }}>
                <CWidgetStatsB
                  className="mb-4"
                  value={dashboard_data ? dashboard_data.SubmittedCount : 0}
                  title="Submitted Timesheets"
                  progress={{ color: 'primary', value: 89.9 }}
                  style={{ height: '115px' }}
                />
              </a>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <a onClick={pendLink} style={{ color: '#000', cursor: 'pointer' }}>
                <CWidgetStatsB
                  className="mb-4"
                  value={dashboard_data ? dashboard_data.PendingCount : 0}
                  title="Pending Timesheets"
                  style={{ height: '115px' }}
                  progress={{ color: 'warning', value: 89.9 }}
                />
              </a>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <a onClick={apprLink} style={{ color: '#000', cursor: 'pointer' }}>
                <CWidgetStatsB
                  className="mb-4"
                  value={dashboard_data ? dashboard_data.ApprovedCount : 0}
                  title="Approved Timesheets"
                  style={{ height: '115px' }}
                  progress={{ color: 'success', value: 89.9 }}
                />
              </a>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <a onClick={rejLink} style={{ color: '#000', cursor: 'pointer' }}>
                <CWidgetStatsB
                  className="mb-4"
                  value={dashboard_data ? dashboard_data.RejectedCount : 0}
                  title="Rejected Timesheets"
                  style={{ height: '115px' }}
                  progress={{ color: 'danger', value: 89.9 }}
                />
              </a>
            </CCol>
          </>
        ) : (
          ''
        )}
      </CRow>
    </>
  )
}

export default Dashboard
