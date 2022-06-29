/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from 'react'
import '@coreui/coreui/dist/css/coreui.css'
import DataTable from 'react-data-table-component'
import { CCard, CRow, CCol, CCardHeader, CCardBody, CButton, CFormTextarea, CFormInput } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { Create_Timesheet, get_singletimesheet, updateTimesheet } from 'src/actions/timesheets.actions'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {CustomLoader,customStyles, Pagination} from 'src/components/datatables/index'
import moment from 'moment'
import './form.css'

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

  const id = searchParams.get('id')
  const sdate = searchParams.get('sdate')
  const edate = searchParams.get('edate')
  const ref = searchParams.get('ref')
  const status = searchParams.get('status')
  const dispatch = useDispatch()
  const location = useNavigate()
  const auth = JSON.parse(localStorage.getItem('user'))
  const udata = useSelector((state) => state.admin)

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
                        defaultValue={row.task && row.task[row.date]}
                        autoComplete="off"
                        style={{marginTop: "10px", marginBottom: "10px" }}
                        readOnly={row.readonly}
                        onBlur={(e) => {
                          if(id){
                            row.task[row.date] = e.target.value
                            setTaskname(row.task)
                          }else{
                            tName[row.date] = e.target.value
                            setTaskname(tName)
                          }
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
                        defaultValue={row.start_time && row.start_time[row.date]}
                        autoComplete="off"
                        readOnly={row.readonly}
                        onBlur={(e) => {
                          if(id){
                            row.start_time[row.date] = e.target.value
                            setTaskname(row.start_time)
                          }else{
                            sTime[row.date] = e.target.value
                            setStarttime(sTime)
                          }
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
                        defaultValue={row.finish_time && row.finish_time[row.date]}
                        autoComplete="off"
                        onBlur={(e) => {
                          if(id){
                            row.finish_time[row.date] = e.target.value
                            setTaskname(row.finish_time)
                          }else{
                            fTime[row.date] = e.target.value
                            setFinishtime(fTime)
                          }
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
                        defaultValue={row.comments && row.comments[row.date]}
                        autoComplete="off"
                        readOnly={row.creadonly}
                        onBlur={(e) => {
                          if(id){
                            row.comments[row.date] = e.target.value
                            setComments(row.comments)
                          }else{
                            aComments[row.date] = e.target.value
                            setComments(aComments)
                          }
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
                        defaultValue={row.total_hours && row.total_hours[row.date]}
                        readOnly={row.readonly}
                        autoComplete="off"
                        min={0}
                        onBlur={(e) => {
                          if(id){
                            row.total_hours[row.date] = e.target.value
                            setTotalhours(row.total_hours)
                            sum(row.total_hours)
                          }else{
                            aTotalhours[row.date] = e.target.value
                            setTotalhours(aTotalhours)
                            sum(aTotalhours)
                          }
                        }}
                        /* onChange={(e) => {
                          checkTotal(e.target.value, row.date)
                        }} */
                      />
      }

    ],
    [],
  )

  useEffect(() => {
    if (sdate || id) {

      var query = {};
      if (id){
        query = { tid: id }
      }else{
        query = { user_id: auth._id, sdate: sdate, edate: edate }
      }

      dispatch(get_singletimesheet(query))
    } else {
      setTaskname([])
      setStarttime([])
      setFinishtime([])
      setComments([])
      setTotalhours([])
    }
    if (get_timesheet && get_timesheet.is_timesheet_added) {
      location(udata.get_data.uploads_folder + 'admin/time-sheets')
    }
  }, [id, get_timesheet.is_timesheet_added])

  useEffect(() => {
    const singleTimesheet = get_timesheet.timesheet_data;
    if (singleTimesheet) {
      setTaskname(singleTimesheet && singleTimesheet.task_names)
      setStarttime(singleTimesheet && singleTimesheet.start_time)
      setFinishtime(singleTimesheet && singleTimesheet.finish_time)
      setComments(singleTimesheet && singleTimesheet.comments)
      setTotalhours(singleTimesheet && singleTimesheet.total_hours)
      sum(singleTimesheet && singleTimesheet.total_hours)
    }
  }, [get_timesheet.timesheet_data, id])

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

      if (ref === "view") {
        setReadonly(true)
        setCReadonly(true)
      }else if(status !== "pending" && id === "") {
        setReadonly(true)
        setCReadonly(true)
      }else if(status === "submitted" || status === "approved") {
        setReadonly(true)
        if(auth.role === 2 && status !== "approved"){
          setCReadonly(false)
        }else{
          setCReadonly(true)
        }
      }else if(auth.role === 2){
        setReadonly(true)
        setCReadonly(false)
      }

  },[get_timesheet.timesheet_data, taskName && taskName[startDate]])

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
                  <strong>({startDate} - {endDate})</strong>
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
