import authReducer from './auth.reducers'
import { combineReducers } from 'redux'
import adminReducer from './admin.reducer'
import clientsReducers from './projects.reducers'
import employeesReducers from './employees.reducers'
import routesReducers from './routes.reducers'

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  clients: clientsReducers,
  employees: employeesReducers,
  routes: routesReducers,
})

export default rootReducer
