const express = require('express');
const router = express.Router();
const {requireSignin} = require('../../controllers/admin/auth');
const { get_projects, get_allprojects, create_project, update_project, get_singleproject, deleteProject } = require('../../controllers/admin/projects');

router.post('/admin/get_projects',requireSignin,get_projects);
router.get('/admin/get_allprojects',requireSignin,get_allprojects);
router.post('/admin/create_project',requireSignin,create_project);
router.post('/admin/update_project',requireSignin,update_project);
router.post('/admin/get_singleproject',requireSignin,get_singleproject);
router.post('/admin/delete_project',requireSignin,deleteProject);

module.exports = router;