const mongo = require('../../connection.js').getDb();
const bcrypt = require('bcrypt');

const employees = mongo.collection("tbl_employees");
const assigned_projects = mongo.collection("tbl_assigned_projects");
var ObjectId = require('mongodb').ObjectID;


exports.create_employee = (req, res) => {
    
    if(!req.body.employee_name){
        return res.status(202).json({ message: "Employee Name is Required." });
    }
    if(!req.body.employee_id){
        return res.status(202).json({ message: "Employee ID is Required." });
    }
    if(!req.body.mobile_number){
        return res.status(202).json({ message: "Mobile Number is Required." });
    }
    if(!req.body.email){
        return res.status(202).json({ message: "Email is Required." });
    }

    const data = {
        "employee_name": req.body.employee_name,
        "employee_id": req.body.employee_id,
        "password": bcrypt.hashSync(req.body.password, 10),
        "mobile_number": req.body.mobile_number,
        "email": req.body.email,
        "office_email": req.body.office_email,
        "address": req.body.address,
        "designation": req.body.designation,
        "created_date": new Date(),
        "team_lead": req.body.team_lead_id,
        "updated_date": "",
        "status" : 1,
        "deleted" : 0,
        "role" : 3,
        "user_image" : ""
    }
    
    employees.find({ employee_id: req.body.employee_id }).toArray((error, result) => {
        if (result.length > 0) {
            return res.status(202).json({
                message: 'Employee ID Already Exists.'
            });
        }

        employees.insertOne(data, function (error, result) {
            if (error) {
                return res.status(202).json({
                    message: 'error occured'
                });
            }

            if (result) {
                return res.status(200).json({
                    message: "Created Successfully"
                })
            }
        });
    });
}

exports.update_employee = (req, res) => {
    
    if(!req.body.employee_name){
        return res.status(202).json({ message: "Employee Name is Required." });
    }
    if(!req.body.employee_id){
        return res.status(202).json({ message: "Employee ID is Required." });
    }
    if(!req.body.mobile_number){
        return res.status(202).json({ message: "Mobile Number is Required." });
    }
    if(!req.body.email){
        return res.status(202).json({ message: "Email is Required." });
    }
    if(!req.body.id){
        return res.status(202).json({ message: "ID is Required." });
    }

    const data = {
        "employee_name": req.body.employee_name,
        "employee_id": req.body.employee_id,
        "mobile_number": req.body.mobile_number,
        "email": req.body.email,
        "office_email": req.body.office_email,
        "address": req.body.address,
        "designation": req.body.designation,
        "updated_date": new Date(),
        "team_lead": req.body.team_lead_id,
    }

    var errors = [];

    employees.find({ employee_id: req.body.employee_id }).toArray((error, result) => {
        if (result.length > 0) {
            if(result[0]._id != req.body.id){
                errors.push({message:"Employee ID Already Exists."});
            }
        }

        if(errors.length == 0){
    
            employees.updateOne({_id:new ObjectId(req.body.id)}, {$set: data}, function (error, result) {
                if (error) {
                    return res.status(202).json({
                        message: 'error occured'
                    });
                }

                if (result) {
                    return res.status(200).json({
                        message: "Updated Successfully"
                    })
                }
            });

        }else{
    
            return res.status(202).json(errors[0]);
    
        }
        
    });
}

exports.get_employees = (req, res) => {
    
    var perPage = req.body.perPage ? req.body.perPage : 10,
    page = req.body.page-1
    var search = req.body.search
    const data = []

    employees.aggregate([
        { "$sort": { '_id' : -1 } },
        { "$limit": perPage * req.body.page },
        { "$skip": perPage * page },
        {$match: 
            {"status":1,"deleted":0,"team_lead":req.body.team_lead_id,
                $or: 
                [ 
                    { employee_name: { "$regex": search, "$options": "i"} },
                    { employee_id: { "$regex": search, "$options": "i"} },
                    { mobile_number: { "$regex": search, "$options": "i"} },
                    { email: { "$regex": search, "$options": "i"} },
                    { office_email: { "$regex": search, "$options": "i"} },
                    { designation: { "$regex": search, "$options": "i"} },
                    { address: { "$regex": search, "$options": "i"} },
                ] 
            },
        },
    ])
    .toArray(function (err, db_data) {

            if(err){
                return res.status(202).json({message:err});
            }

            if(db_data.length > 0){
                db_data.forEach((element) => {
                  
                    data.push({
                        "id": element._id,
                        "employee_name": element.employee_name,
                        "employee_id": element.employee_id,
                        "mobile_number": element.mobile_number,
                        "email": element.email,
                        "office_email": element.office_email,
                        "address": element.address,
                        "designation": element.designation,
                        "created_date": new Date(element.created_date).toLocaleDateString('en-US'),
                    })

                });
            }

            employees.find({"status":1,"deleted":0,"team_lead":req.body.team_lead_id, $or: 
                [ 
                    { employee_name: { "$regex": search, "$options": "i"} },
                    { employee_id: { "$regex": search, "$options": "i"} },
                    { mobile_number: { "$regex": search, "$options": "i"} },
                    { email: { "$regex": search, "$options": "i"} },
                    { office_email: { "$regex": search, "$options": "i"} },
                    { designation: { "$regex": search, "$options": "i"} },
                    { address: { "$regex": search, "$options": "i"} },
                ] 
            }).count(function (err, count) {
                return res.status(200).json({
                    total_users: data,
                    pageIndex: req.body.page,
                    total_pages: Math.ceil(count / perPage),
                    total_users_count: count,
                    prevPage: page > 0 ? true : false,
                    nextPage: Math.ceil(count / perPage) === req.body.page ? false : true
                });   
            })
        })
}

exports.deleteEmployee = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "Employee ID is Required." });
    }

    employees.deleteOne({ _id: new ObjectId(id) },(error, result) => {
        
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: "Employee Deleted Successfully" });
        }else{
            return res.status(202).json({ message: "Employee Not Found" });
        }

    });

}

exports.get_singleemployee = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "Employee ID is Required." });
    }

    employees.find({ _id: new ObjectId(id) }).toArray((error, result) => {
        
        if (result.length > 0) {
            return res.status(200).json({ employee_data: result[0] });
        }else{
            return res.status(202).json({ message: "Employee Not Found." });
        }

    });

}

exports.get_allemployees = (req, res) => {

    const data = []

    employees.aggregate([
        { "$sort": { '_id' : -1 } },
        {
            $match: {"status":1,"deleted":0,"team_lead":req.body.team_lead_id},
        },
        {
            $project: {employee_name:1}  
        }
    ])
    .toArray(function (err, db_data) {

            if(err){
                return res.status(202).json({message:err});
            }

            if(db_data.length > 0){
                db_data.forEach((element) => {
                  
                    data.push({
                        "id": element._id,
                        "employee_name": element.employee_name,
                    })

                });
            }

            return res.status(200).json({
                all_employees: data,
            });   
        })
}

exports.get_assigned_projects = (req, res) => {
    
    var perPage = req.body.perPage ? req.body.perPage : 10,
    page = req.body.page-1
    var search = req.body.search
    const data = []

    assigned_projects.aggregate([
        { "$sort": { '_id' : -1 } },
        { "$limit": perPage * req.body.page },
        { "$skip": perPage * page },
        { $match: 
            {"status":1,"deleted":0,"team_lead":req.body.team_lead,
                $or: 
                [ 
                    { project_id: { "$regex": search, "$options": "i"} },
                    { employees: { "$regex": search, "$options": "i"} },
                    { team_lead: { "$regex": search, "$options": "i"} },
                ] 
            },
        },
        {$project: {
            project_id:1,
            employees:1,
            created_date:1,
            project_id:{
               $toObjectId:"$project_id"
            },
         }},
        { $lookup: {
            from:'tbl_projects',
            localField: "project_id",
            foreignField: "_id",
            pipeline: [
                { "$project": { project_name: 1, client_name: 1 }}
            ],
            as: "project_data"                                                                  
        }},
        { $lookup: {
            from: "tbl_employees",
            let: { "employees": "$employees" },
            pipeline: [
              { "$match": { "$expr": { "$in": [{ "$toString": "$_id" }, "$$employees"] }}},
              { "$project": { employee_name: 1, employee_id: 1 }}
            ],
            as: "employee_data"
        }}

    ])
    .toArray(function (err, db_data) {

            if(err){
                return res.status(202).json({message:err});
            }

            if(db_data.length > 0){
                db_data.forEach((element) => {
                    
                    var employees = [];
                    if(element.employee_data.length > 0){
                        element.employee_data.forEach((emp) => {
                            employees.push(emp.employee_name);
                        })
                    }    

                    data.push({
                        "id": element._id,
                        "client_name": element.project_data.length > 0 ?  element.project_data[0].client_name : '',
                        "project_name": element.project_data.length > 0 ?  element.project_data[0].project_name : '',
                        "employees": employees.join(', '),
                        "created_date": new Date(element.created_date).toLocaleDateString('en-US')
                    })

                });
            }

            assigned_projects.find({"status":1,"deleted":0,"team_lead":req.body.team_lead, $or: 
                [ 
                    { project_id: { "$regex": search, "$options": "i"} },
                    { employees: { "$regex": search, "$options": "i"} },
                    { team_lead: { "$regex": search, "$options": "i"} },
                ] 
            }).count(function (err, count) {
                return res.status(200).json({
                    total_users: data,
                    pageIndex: req.body.page,
                    total_pages: Math.ceil(count / perPage),
                    total_users_count: count,
                    prevPage: page > 0 ? true : false,
                    nextPage: Math.ceil(count / perPage) === req.body.page ? false : true
                });   
            })
        })
}

exports.create_assignproject = (req, res) => {
    
    if(!req.body.team_lead){
        return res.status(202).json({ message: "ID is Required." });
    }
    if(!req.body.project_id){
        return res.status(202).json({ message: "Project is Required." });
    }
    if(!req.body.employees){
        return res.status(202).json({ message: "Employees is Required." });
    }

    const data = {
        "project_id": req.body.project_id,
        "employees": req.body.employees,
        "created_date": new Date(),
        "team_lead": req.body.team_lead,
        "updated_date": "",
        "status" : 1,
        "deleted" : 0
    }
    
    assigned_projects.find({ project_id: req.body.project_id }).toArray((error, result) => {
        if (result.length > 0) {
            return res.status(202).json({
                message: 'Already Assigned Employees To This Project.'
            });
        }
        
        assigned_projects.insertOne(data, function (error, result) {
            if (error) {
                return res.status(202).json({
                    message: 'error occured'
                });
            }

            if (result) {
                return res.status(200).json({
                    message: "Project Successfully Assigned To Employees"
                })
            }
        });
    });
}

exports.update_assignproject = (req, res) => {
    
    if(!req.body.id){
        return res.status(202).json({ message: "ID is Required." });
    }
    if(!req.body.team_lead){
        return res.status(202).json({ message: "Team Lead is Required." });
    }
    if(!req.body.project_id){
        return res.status(202).json({ message: "Project is Required." });
    }
    if(!req.body.employees){
        return res.status(202).json({ message: "Employees is Required." });
    }

    const data = {
        "project_id": req.body.project_id,
        "employees": req.body.employees,
        "updated_date": new Date(),
        "team_lead": req.body.team_lead,
    }

    var errors = [];
    
    assigned_projects.find({ project_id: req.body.project_id }).toArray((error, result) => {
        if (result.length > 0) {
            if(result[0]._id != req.body.id){
                errors.push({message:"Already Assigned Employees To This Project."});
            }
        }
        
        if(errors.length == 0){
            assigned_projects.updateOne({_id:new ObjectId(req.body.id)}, {$set: data}, function (error, result) {
                if (error) {
                    return res.status(202).json({
                        message: 'error occured'
                    });
                }

                if (result) {
                    return res.status(200).json({
                        message: "Project Successfully Assigned To Employees"
                    })
                }
            });
        }else{
    
            return res.status(202).json(errors[0]);
    
        }

    });
}

exports.get_singleassignproject = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "ID is Required." });
    }

    assigned_projects.aggregate([
        {
            $match: {_id: new ObjectId(id)},
        },
        { $lookup: {
            from: "tbl_employees",
            let: { "employees": "$employees" },
            pipeline: [
              { "$match": { "$expr": { "$in": [{ "$toString": "$_id" }, "$$employees"] }}},
              { "$project": { employee_name: 1 }}
            ],
            as: "employee_data"
        }}
    ]
    ).toArray((error, result) => {
        
        const data = []
        if (result.length > 0) {

            var apdata = result[0];
            var employees = [];
            apdata.employee_data.forEach((emp) => {
                employees.push({
                    "label": emp.employee_name,
                    "value": emp._id
                })        
            });
            data.push({
                "_id": apdata._id,
                "project_id": apdata.project_id,
                "employees": employees,
            })

            return res.status(200).json({ assigned_project_data: data[0] });
        }else{
            return res.status(202).json({ message: "Assigned Project Not Found." });
        }

    });

}

exports.deleteAssignproject = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "ID is Required." });
    }

    assigned_projects.deleteOne({ _id: new ObjectId(id) },(error, result) => {
        
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: "Assigned Project Deleted Successfully" });
        }else{
            return res.status(202).json({ message: "Assigned Project Not Found" });
        }

    });

}