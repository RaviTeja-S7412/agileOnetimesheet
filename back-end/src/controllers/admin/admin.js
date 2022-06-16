const mongo = require('../../connection.js').getDb();

const employees = mongo.collection("tbl_employees");
const users = mongo.collection("tbl_auths");
const projects = mongo.collection("tbl_projects");
const roles = mongo.collection("tbl_roles");
const assigned_projects = mongo.collection("tbl_assigned_projects");

var ObjectId = require('mongodb').ObjectID;

exports.get_userdata = (req, res) => {

    if(req.body.loginType === "admin"){

        users.aggregate([
            { $match: {_id: new ObjectId(req.body.user_id) }},
            { $lookup: {
                from:'tbl_roles',
                localField: "role",
                foreignField: "id",
                as: "role_data"                                                                  
            }},
        ]).toArray((error, result) => {

            if (error) {
                return res.status(202).json({ message: error });
            }

            if (result[0]) {

                var user = result[0];
                return res.status(200).json({
                    user: user,
                });
                    
            } else {
                return res.status(202).json({
                    message: error
                });
            }
        })

    }else{

        employees.aggregate([
            { $match: {_id: new ObjectId(req.body.user_id) }},
            { $lookup: {
                from:'tbl_roles',
                localField: "role",
                foreignField: "id",
                as: "role_data"                                                                  
            }},
        ]).toArray((error, result) => {

            if (error) {
                return res.status(202).json({ message: error });
            }

            if (result[0]) {

                var user = result[0];
                return res.status(200).json({
                    user: {"_id":user._id,"admin_name":user.employee_name,"email":user.office_email,"mobile":user.mobile,"user_image":user.user_image,"role_data":user.role_data,"role":user.role},
                });
                    
            } else {
                return res.status(202).json({
                    message: error
                });
            }
        })

    }
}

exports.get_roles = (req, res) => {

    roles.find({id:{$ne:3}})
        .toArray((error, result) => {

            if (error) {
                return res.status(202).json({ message: error });
            }

            if (result.length > 0) {

                return res.status(200).json({
                    roles: result,
                });
                    
            } else {
                return res.status(202).json({
                    message: "Error Occured."
                });
            }
        })
}

exports.get_teamleads = (req, res) => {

    users.find({ "created_by": req.body.user_id, "role": 4 })
        .toArray((error, result) => {

            if (error) {
                return res.status(202).json({ message: error });
            }

            if (result) {

                return res.status(200).json({
                    team_leads: result,
                });
                    
            } else {
                return res.status(202).json({
                    message: error
                });
            }
        })
}

exports.get_tlemployees = (req, res) => {
    
    employees.find({ "team_lead": req.body.user_id })
        .toArray((error, result) => {

            if (error) {
                return res.status(202).json({ message: error });
            }

            if (result) {

                return res.status(200).json({
                    employees: result,
                });
                    
            } else {
                return res.status(202).json({
                    message: error
                });
            }
        })
}

exports.get_dashboarddata = (req, res) => {

    const role = req.body.role;
    const user_id = req.body.user_id;

    var empquery = {};
    var projectquery = {};
    var tlquery = {};
    if(role == 2){
        empquery["team_lead"] = user_id;
        projectquery["team_lead"] = user_id;
    }else if(role == 1){
        tlquery["role"] = { "$exists": true, "$in": [2] }
    }
    
    users.aggregate([
        { "$facet": {
          "TLCount": [
            { "$match" : tlquery},
            { "$count": "TLCount" },
          ]
        }},
        { "$project": {
          "TEAMLCount": { "$arrayElemAt": ["$TLCount.TLCount", 0] },
        }}
      ]).toArray((error, result) => {

        if (error) {
            return res.status(202).json({ message: error });
        }

        if (result) {

            employees.find(empquery).count(function(err,count){

                if(role == 1){

                    projects.find({}).count(function(err,pcount){

                        result[0]["EMPCount"] = count;
                        result[0]["PROJECTCount"] = pcount;

                        return res.status(200).json({
                            dashboard_data: result,
                        });

                    });

                }else{

                    assigned_projects.find(projectquery).count(function(err,pcount){

                        result[0]["EMPCount"] = count;
                        result[0]["PROJECTCount"] = pcount;

                        return res.status(200).json({
                            dashboard_data: result,
                        });

                    });

                }

            })
                
        } else {
            return res.status(202).json({
                message: error
            });
        }
    })
}


