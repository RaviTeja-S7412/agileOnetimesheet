import React from 'react'
import { CRow, CCol, CWidgetStatsB } from '@coreui/react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const auth = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  const admin = useSelector((state) => state.admin)
  const dashboard_data = admin.dashboard_data && admin.dashboard_data[0]

  return (
    <>
      <CRow>
        {auth.role === 1 ? (
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              progress={{ color: 'success', value: 89.9 }}
              // text="Lorem ipsum dolor sit amet enim."
              title="Account Managers"
              value={dashboard_data ? dashboard_data.ASSTMCount : 0}
            />
          </CCol>
        ) : (
          ''
        )}
        {auth.role === 1 || auth.role === 3 ? (
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              value={dashboard_data ? dashboard_data.TEAMLCount : 0}
              title="Techinical Leads"
              progress={{ color: 'info', value: 89.9 }}
              // text="Lorem ipsum dolor sit amet enim."
            />
          </CCol>
        ) : (
          ''
        )}
        {auth.role === 1 || auth.role === 4 ? (
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsB
              className="mb-4"
              value={dashboard_data ? dashboard_data.EMPCount : 0}
              title="Employees"
              progress={{ color: 'warning', value: 89.9 }}
              // text="Lorem ipsum dolor sit amet enim."
            />
          </CCol>
        ) : (
          ''
        )}
      </CRow>
    </>
  )
}

export default Dashboard