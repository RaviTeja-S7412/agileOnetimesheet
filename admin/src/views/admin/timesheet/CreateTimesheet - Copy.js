/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from 'react'
import '@coreui/coreui/dist/css/coreui.css'
import DataTable from 'react-data-table-component'
import { CCard, CRow, CCol, CCardHeader, CCardBody, CButton, CFormTextarea, CFormInput } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { Create_Timesheet, updateTimesheet } from 'src/actions/timesheets.actions'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {CustomLoader,customStyles, Pagination} from 'src/components/datatables/index'
import moment from 'moment'
import './form.css'
import { get_dashboard_data } from 'src/helpers/Admin'
import Getlinks from './Getlinks'

const CreateTimesheet = () => {

  const get_timesheet = useSelector((state) => state.timesheets)
  const [data, setData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [weekDays, setWeekdays] = useState([])
  const [taskName, setTaskname] = useState([])
  const [startTime, setStarttime] = useState([])
  const [finishTime, setFinishtime] = useState([])
  const [comments, setComments] = useState([])
  const [totalHours, setTotalhours] = useState([0])
  const [startDate, setStartdate] = useState("")
  const [endDate, setEnddate] = useState("")
  const [sumHours, setSumhours] = useState(0)
  const [readOnly, setReadonly] = useState(false)
  const [creadOnly, setCReadonly] = useState(false)
  const [prepageindex, setprePageindex] = useState(false)
  const [nexpageindex, setnexPageindex] = useState(false)
  const [prevLink, setPrevlink] = useState("#")
  const [nextLink, setNextlink] = useState("#")

  const id = searchParams.get('id')
  const st_date = searchParams.get('sdate')
  const en_date = searchParams.get('edate')
  var pageNumber = searchParams.get('page')
  const ref = searchParams.get('ref')
  const status = searchParams.get('status')
  const dispatch = useDispatch()
  const location = useNavigate()
  const auth = JSON.parse(localStorage.getItem('user'))
  const admin = useSelector((state) => state.admin)

  var tName = {};
  var sTime = {};
  var fTime = {};
  var aComments = {};
  var aTotalhours = {};

  const columns = useMemo(
    () => [
      {
        name: 'Day',
        selector: (row) => `${row.day}`,
        grow: 0.5,
        sortable: false
      },
      {
        name: 'Date',
        grow: 0.5,
        selector: (row) => `${row.date}`,
        sortable: false,
      },
      {
        name: 'Task',
        selector: (row) => `${row.task}`,
        sortable: false,
        cell: (row) =>
                      <CFormTextarea
                        type="text"
                        id="name"
                        name="task_name"
                        required
                        placeholder="Task Name"
                        autoComplete="off"
                        style={{marginTop: "10px", marginBottom: "10px" }}
                        readOnly={row.readonly}
                        onBlur={(e) => {
                          tName[row.date] = e.target.value
                          setTaskname(tName)
                        }}
                      />
      },
      {
        name: 'Start Time',
        selector: (row) => `${row.start_time}`,
        sortable: false,
        cell: (row) => <CFormInput
                        type="time"
                        id="name"
                        name="client_name"
                        required
                        placeholder="Task Name"
                        autoComplete="off"
                        readOnly={row.readonly}
                        onBlur={(e) => {
                          sTime[row.date] = e.target.value
                          setStarttime(sTime)
                        }}
                      />
      },
      {
        name: 'Finish Time',
        selector: (row) => `${row.finish_time}`,
        sortable: false,
        cell: (row) => <CFormInput
                        type="time"
                        id="name"
                        name="client_name"
                        required
                        placeholder="Task Name"
                        readOnly={row.readonly}
                        autoComplete="off"
                        onBlur={(e) => {
                          fTime[row.date] = e.target.value
                          setFinishtime(fTime)
                        }}
                      />
      },
      {
        name: 'Comments',
        selector: (row) => `${row.comments}`,
        sortable: false,
        cell: (row) => <CFormTextarea
                        type="text"
                        id="name"
                        name="client_name"
                        required
                        style={{marginTop: "10px", marginBottom: "10px" }}
                        placeholder="Comments"
                        autoComplete="off"
                        readOnly={row.creadonly}
                        onBlur={(e) => {
                          aComments[row.date] = e.target.value
                          setComments(aComments)
                        }}
                      />
      },
      {
        name:"Total Hours",
        grow: 0.5,
        selector: (row) => `${row.total_hours}`,
        sortable: false,
        cell: (row) => <CFormInput
                        type="number"
                        id="name"
                        name="client_name"
                        required
                        placeholder="Hrs"
                        readOnly={row.readonly}
                        autoComplete="off"
                        min={0}
                        onBlur={(e) => {
                          aTotalhours[row.date] = e.target.value
                          setTotalhours(aTotalhours)
                          sum(aTotalhours)
                        }}
                      />
      }
    ],
    [],
  )

  useEffect(() => {

    if (get_timesheet && get_timesheet.is_timesheet_added) {
      dispatch(get_dashboard_data())
      location(admin.get_data.uploads_folder + 'admin/time-sheets')
    }

  }, [get_timesheet.is_timesheet_added])


  const sum = (obj) => {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
      }
    }
    setSumhours(sum)
  }

  useEffect(() => {

    const singleTimesheet = get_timesheet.timesheet_data;
    var startOfWeek = "";
    var endOfWeek = "";
    if (id) {
      startOfWeek = singleTimesheet && singleTimesheet.start_date;
      endOfWeek = singleTimesheet && singleTimesheet.end_date;
    } else {
      startOfWeek = new Date(moment().startOf("isoWeek").toDate()).toLocaleDateString('en-US');
      endOfWeek = new Date(moment().endOf("isoWeek").toDate()).toLocaleDateString('en-US');
    }
    setStartdate(startOfWeek)
    setEnddate(endOfWeek)

    var preLink = "";
    var nexLink = "";
    var prepagenumber = 0;
    var nexpagenumber = 0;
    if(status === "pending"){

      var links = Getlinks(pageNumber,dashboard_data.PendingDates)
      preLink = links.preLink;
      nexLink = links.nexLink;
      prepagenumber = links.prepagenumber;
      nexpagenumber = links.nexpagenumber;
      setprePageindex(links.prePageindex)
      setnexPageindex(links.nexPageindex)

    }

    setPrevlink(admin.get_data.uploads_folder + 'admin/time-sheets/create-time-sheet?status=' + status + '&id=' + preLink + '&page=' + prepagenumber )
    setNextlink(admin.get_data.uploads_folder + 'admin/time-sheets/create-time-sheet?status=' + status + '&id=' + nexLink + '&page=' + nexpagenumber )

    var weekDates = [];

    const sdate = new Date(startOfWeek),
      edate = new Date(endOfWeek),
      diff = (edate-sdate)/864e5,
      dateFormat = {weekday:'short',month:'numeric',day:'numeric',year:'numeric'},
      dates = Array.from(
        {length: diff+1},
        (_,i) => {
          const date = new Date()
          date.setDate(sdate.getDate()+i)
          const [weekdayStr, dateStr] = date.toLocaleDateString('en-US',dateFormat).split(', ')
          weekDates.push({"week":weekdayStr, "date":dateStr, "task": taskName, "start_time": startTime, "finish_time": finishTime, "comments": comments, "total_hours": totalHours, "readonly": readOnly, "creadonly": creadOnly})
          return `${dateStr} ${weekdayStr}`
        }
      )

      const displayColumns = ["day","date","task","start_time","finish_time","comments","total_hours", "readonly", "creadonly"];
      var udata = Pagination(weekDates, 1, 1, 10, displayColumns)
      setData(udata)
      setWeekdays(weekDates)

  },[id, get_timesheet.timesheet_data, pageNumber])

  const previousNavigate = () => {
    setLoading(true)
    location(prevLink)
    setLoading(false)
  }
  const nextNavigate = () => {
    setLoading(true)
    location(nextLink)
    setLoading(false)
  }
  const saveData = (ref) => {

    const fdata = {
      "start_date": startDate,
      "end_date": endDate,
      "task_names": taskName,
      "start_time": startTime,
      "finish_time": finishTime,
      "comments": comments,
      "total_hours": totalHours,
      "employee_id": auth._id,
      "week_days": weekDays,
      "team_lead": auth.team_lead,
      "ref": ref
    }
    if (id === null) {
      dispatch(Create_Timesheet(fdata))
    } else {
      fdata['id'] = id
      dispatch(updateTimesheet(fdata))
    }
  }
  var button = "";

  if (!readOnly) {
    if (auth && auth.role === 3) {
      button = <CCol>
                <CCol className='align-self-center' style={{ textAlign: "center" }}>
                  <CButton className="m-2" onClick={()=>saveData("save")}>Save</CButton>
                  <CButton onClick={()=>saveData("submit")}>Submit Timesheet</CButton>
                </CCol>
              </CCol>
    }
  }else{
    if (auth && auth.role === 2 && status !== "approved") {
      button = <CCol xs={12} style={{ textAlign: "center" }}>
                <CButton onClick={()=>saveData("approve")}>Approve</CButton>
              </CCol>
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3 border-top-primary border-top-3">
            <CCardHeader>
              <CRow>
                <CCol xs={5}>
                  { (ref === 'view') ? (
                      <strong>View Timesheet</strong>
                    ) : (
                    <strong>{id === null ? 'Create' : 'Update'} Timesheet</strong>
                    )
                  }
                </CCol>
                <CCol xs={7}>
                  <strong>
                    { prepageindex ? (
                        <a onClick={previousNavigate} style={{ color: "black", cursor: 'pointer' }}><i className='fa fa-chevron-left'></i> </a>
                    ) : '' }
                        {startDate} - {endDate}
                    { nexpageindex ? (
                        <a onClick={nextNavigate} style={{ color: "black", cursor: 'pointer' }}> <i className='fa fa-chevron-right'></i> </a>
                    ) : '' }
                  </strong>
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
                customStyles={customStyles}
              />
              <CRow>
                <CCol xs={12} style={{textAlign: "right", marginTop: "50px"}}>
                  <strong>Total Hours: {sumHours} Hrs</strong>
                </CCol>
                {button}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CreateTimesheet
