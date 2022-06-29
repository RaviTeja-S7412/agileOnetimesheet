import authReducer from './auth.reducers'
import { combineReducers } from 'redux'
import adminReducer from './admin.reducer'
import clientsReducers from './projects.reducers'
import employeesReducers from './employees.reducers'
import routesReducers from './routes.reducers'
import timesheetsReducers from './timesheets.reducers'

const appReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  clients: clientsReducers,
  employees: employeesReducers,
  routes: routesReducers,
  timesheets: timesheetsReducers,
})
const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

/* const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  clients: clientsReducers,
  employees: employeesReducers,
  routes: routesReducers,
  timesheets: timesheetsReducers,
}) */

export default rootReducer
