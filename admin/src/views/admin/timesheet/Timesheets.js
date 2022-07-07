/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from 'react'
import '@coreui/coreui/dist/css/coreui.css'
import DataTable from 'react-data-table-component'
import { CCard, CRow, CCol, CCardHeader, CCardBody, CButton, CBadge } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTimesheet, getTimesheets } from 'src/actions/timesheets.actions'
import CIcon from '@coreui/icons-react'
import { cibStatuspage, cilPenAlt, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import {SearchInput,CustomLoader,customStyles} from 'src/components/datatables/index'
import Pagination from 'src/components/datatables/Pagination'
import './form.css'

const Timesheets = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [hideColumn, setHidecolumn] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [searchText, setSearchtext] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const get_timesheets = useSelector((state) => state.timesheets)
  const dispatch = useDispatch()
  const location = useNavigate()
  const auth = JSON.parse(localStorage.getItem('user'))
  const udata = useSelector((state) => state.admin)

  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Want to delete this timesheet.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
          dispatch(deleteTimesheet({ user_id: id }))
          swal("Timesheet has been deleted!", {
            icon: "success",
          });
      } else {
        swal("Timesheet is safe!");
      }
    });
  }

  const handleEdit = (id) => {
    location(udata.get_data.uploads_folder + 'admin/time-sheets/update-time-sheet?id='+id)
  }

  const handleView = (id) => {
    location(udata.get_data.uploads_folder + 'admin/time-sheets/view-time-sheet?id='+id + '&ref=view')
  }

  const handleCreate = () => {
    location(udata.get_data.uploads_folder + 'admin/time-sheets/create-time-sheet')
  }

  const columns = useMemo(
    () => [
      {
        name: '#',
        selector: (row) => `${row.serial}`,
      },
      {
        name: 'Employee Name',
        selector: (row) => `${row.employee_name}`,
        sortable: true,
        omit: hideColumn,
      },
      {
        name: 'Start Date',
        selector: (row) => `${row.start_date}`,
        sortable: true,
      },
      {
        name: 'End Date',
        selector: (row) => `${row.end_date}`,
        sortable: true,
      },
      {
        name: 'Created Date',
        selector: (row) => `${row.created_date}`,
        sortable: true,
      },
      {
        name: 'Status',
        cell: (row) => (
          <>
          { row.status === "Pending" ? (
                  <CBadge color="warning">Pending</CBadge>
              ) : (
                row.status === "Submitted" ? (
                  <CBadge color="info">Submitted</CBadge>
                ) : row.status === "Approved" ? (
                  <CBadge color="success">Approved</CBadge>
                ) : row.status === "Rejected" ? (
                  <CBadge color="danger">Rejected</CBadge>
                ) : ( '' )
              )
          }
          </>
        ),
        sortable: true,
      },
      {
        name:"Action",
        cell: (row) => (
          <><CIcon icon={cibStatuspage} customClassName="nav-icon favicon" onClick={() => handleView(row.id)} />
          { row.status === "Pending" ? (
                  <><CIcon icon={cilPenAlt} customClassName="nav-icon favicon" onClick={() => handleEdit(row.id)} /><CIcon icon={cilTrash} customClassName="nav-icon favicon" onClick={() => handleDelete(row.id)} /></>
              ) : (
                auth.role === 2 && row.status === "Submitted" ? (
                  <><CIcon icon={cilPenAlt} customClassName="nav-icon favicon" onClick={() => handleEdit(row.id)} /></>
                ) : ( '' )
              )
          }
          </>
        )
      }

    ],
    [handleDelete],
  )

  const fetchUsers = (page1, size = perPage, search = searchText) => {
    setLoading(true)
    const post_data = {
      page: page1,
      perPage: size,
      search: search,
      employee_id: auth._id,
      role: auth.role
    }
    dispatch(getTimesheets(post_data))
    setLoading(false)
  }

  const handlePageChange = (page) => {
    fetchUsers(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = (newPerPage, page) => {
    fetchUsers(page, newPerPage)
    setPerPage(newPerPage)
  }

  const searchData = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  useEffect(() => {
    if (auth.role === 3) {
      setHidecolumn(true)
    }
    if (get_timesheets.get_timesheets) {
      fetchUsers(currentPage)
    } else {
      const displayColumns = ["id","employee_name","start_date","end_date","created_date","status"];
      var udata = Pagination(get_timesheets.timesheets, get_timesheets.nextPage, currentPage, perPage, displayColumns)
      setData(udata)
      setTotalRows(get_timesheets.total_users_count)
    }
  }, [get_timesheets.timesheets, get_timesheets.get_timesheets])

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3 border-top-primary border-top-3">
            <CCardHeader>
              <CRow>
                <CCol xs={4}>
                  <strong>All Timesheets</strong>
                </CCol>
                <CCol xs={8}>
                  { auth && auth.role === 3 ? (
                    <CButton color="primary" onClick={handleCreate} size="sm" className="float-end">
                      Create
                    </CButton>
                  ) : (
                    ''
                  ) }
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <DataTable
                // title="Clients"
                columns={columns}
                data={data}
                progressPending={loading}
                progressComponent={<CustomLoader />}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                onChangePage={handlePageChange}
                subHeader
                subHeaderComponent={<SearchInput submitFunction={searchData} setSearchtext={setSearchtext} />}
                customStyles={customStyles}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Timesheets
