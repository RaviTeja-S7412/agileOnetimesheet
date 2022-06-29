const express = require('express');
const router = express.Router();
const {requireSignin} = require('../../controllers/admin/auth');
const { get_timesheets, create_timesheet, update_timesheet, get_singletimesheet, deleteTimesheet } = require('../../controllers/admin/timesheet');

router.post('/admin/get_timesheets',requireSignin,get_timesheets);
router.post('/admin/create_timesheet',requireSignin,create_timesheet);
router.post('/admin/update_timesheet',requireSignin,update_timesheet);
router.post('/admin/get_singletimesheet',requireSignin,get_singletimesheet);
router.post('/admin/deleteTimesheet',requireSignin,deleteTimesheet);

module.exports = router;