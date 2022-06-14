const mongo = require('../../connection.js').getDb();

const projects = mongo.collection("tbl_projects");
var ObjectId = require('mongodb').ObjectID;


exports.create_project = (req, res) => {
    
    if(!req.body.client_name){
        return res.status(202).json({ message: "Client Name is Required." });
    }
    if(!req.body.project_name){
        return res.status(202).json({ message: "Project Name is Required." });
    }
    if(!req.body.project_start_date){
        return res.status(202).json({ message: "Project Start Date is Required." });
    }
    if(!req.body.project_due_date){
        return res.status(202).json({ message: "Project Due Date is Required." });
    }
    if(!req.body.project_description){
        return res.status(202).json({ message: "Project Description is Required." });
    }

    const data = {
        "client_name": req.body.client_name,
        "project_name": req.body.project_name,
        "project_start_date": req.body.project_start_date,
        "project_due_date": req.body.project_due_date,
        "project_description": req.body.project_description,
        "created_date": new Date(),
        "updated_date": "",
        "status" : 1,
        "deleted" : 0
    }
    
    projects.find({ project_name: req.body.project_name }).toArray((error, result) => {
        if (result.length > 0) {
            return res.status(202).json({
                message: 'Project Name Already Exists.'
            });
        }

        projects.insertOne(data, function (error, result) {
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

exports.update_project = (req, res) => {
    
    if(!req.body.id){
        return res.status(202).json({ message: "ID is Required." });
    }
    if(!req.body.client_name){
        return res.status(202).json({ message: "Client Name is Required." });
    }
    if(!req.body.project_name){
        return res.status(202).json({ message: "Project Name is Required." });
    }
    if(!req.body.project_start_date){
        return res.status(202).json({ message: "Project Start Date is Required." });
    }
    if(!req.body.project_due_date){
        return res.status(202).json({ message: "Project Due Date is Required." });
    }
    if(!req.body.project_description){
        return res.status(202).json({ message: "Project Description is Required." });
    }

    const data = {
        "client_name": req.body.client_name,
        "project_name": req.body.project_name,
        "project_start_date": req.body.project_start_date,
        "project_due_date": req.body.project_due_date,
        "project_description": req.body.project_description,
        "updated_date": new Date(),
    }

    var errors = [];

    projects.find({ project_name: req.body.project_name }).toArray((error, result) => {
        if (result.length > 0) {
            if(result[0]._id != req.body.id){
                errors.push({message:"Project Name Already Exists."});
            }
        }

        if(errors.length == 0){
    
            projects.updateOne({_id:new ObjectId(req.body.id)}, {$set: data}, function (error, result) {
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

exports.get_projects = (req, res) => {

    var perPage = req.body.perPage ? req.body.perPage : 10,
    page = req.body.page-1
    var search = req.body.search
    const data = []

    projects.aggregate([
        { "$sort": { '_id' : -1 } },
        { "$limit": perPage * req.body.page },
        { "$skip": perPage * page },
        {$match: 
            {"status":1,"deleted":0,
                $or: 
                [ 
                    { client_name: { "$regex": search, "$options": "i"} },
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
                        "client_name": element.client_name,
                        "project_name": element.project_name,
                        "project_start_date": element.project_start_date,
                        "project_due_date": element.project_due_date,
                        "created_date": new Date(element.created_date).toLocaleDateString('en-US'),
                        "project_description": element.project_description,
                    })

                });
            }

            projects.find({"status":1,"deleted":0, $or: 
                [ 
                    { client_name: { "$regex": search, "$options": "i"} },
                    { project_name: { "$regex": search, "$options": "i"} },
                    { project_start_date: { "$regex": search, "$options": "i"} },
                    { project_due_date: { "$regex": search, "$options": "i"} },
                    { project_description: { "$regex": search, "$options": "i"} },
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

exports.deleteProject = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "ID is Required." });
    }

    projects.deleteOne({ _id: new ObjectId(id) },(error, result) => {
        
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: "Project Deleted Successfully" });
        }else{
            return res.status(202).json({ message: "Project Not Found" });
        }

    });

}

exports.get_singleproject = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "ID is Required." });
    }

    projects.find({ _id: new ObjectId(id) }).toArray((error, result) => {
        
        if (result.length > 0) {
            return res.status(200).json({ project_data: result[0] });
        }else{
            return res.status(202).json({ message: "Project Not Found." });
        }

    });

}

exports.get_allprojects = (req, res) => {

    const data = []

    projects.aggregate([
        { "$sort": { '_id' : -1 } },
        {$match: 
            {"status":1,"deleted":0},
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
                    "client_name": element.client_name,
                    "project_name": element.project_name,
                    "project_start_date": element.project_start_date,
                    "project_due_date": element.project_due_date,
                    "project_description": element.project_description,
                    "created_date": new Date(element.created_date).toLocaleDateString('en-US'),
                })

            });
        }

        return res.status(200).json({
            all_projects: data,
        });   
    })
}

