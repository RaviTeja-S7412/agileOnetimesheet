const mongo = require('../../connection.js').getDb();

const employees = mongo.collection("tbl_employees");
const users = mongo.collection("tbl_auths");
const projects = mongo.collection("tbl_projects");
const roles = mongo.collection("tbl_roles");
const assigned_projects = mongo.collection("tbl_assigned_projects");
const timesheets = mongo.collection("tbl_timesheets");

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
                user["uploads_folder"] = "/timesheet/"
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
                    user: {"_id":user._id,"admin_name":user.employee_name,"email":user.office_email,"mobile":user.mobile_number,"user_image":user.user_image,"role_data":user.role_data,"role":user.role,"uploads_folder":"/timesheet/"},
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

                }else if(role == 2){

                    assigned_projects.find(projectquery).count(function(err,pcount){

                        result[0]["EMPCount"] = count;
                        result[0]["PROJECTCount"] = pcount;

                        timesheets.aggregate([
                            { $match : {"team_lead":user_id}},
                            { "$facet": {
                                "PendingCount": [
                                    { $match : {'status': { "$exists": true, "$in": [1] }}},
                                    { $sort: { _id: -1 } },
                                    {
                                        $bucket: {
                                          groupBy: "$status",
                                          boundaries: [0,1,2,3,4],
                                          default: "_id",
                                          output: {
                                            "count": { $sum: 1 },
                                            "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                          }
                                        }
                                    }
                                ],
                                "SubmittedCount": [
                                    { $match : {'status': { "$exists": true, "$in": [2] }}},
                                    { $sort: { _id: -1 } },
                                    {
                                        $bucket: {
                                          groupBy: "$status",
                                          boundaries: [0,1,2,3,4],
                                          default: "_id",
                                          output: {
                                            "count": { $sum: 1 },
                                            "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                          }
                                        }
                                    }
                                ],
                                "ApprovedCount": [
                                    { $match : {'status': { "$exists": true, "$in": [3] }}},
                                    { $sort: { _id: -1 } },
                                    {
                                        $bucket: {
                                          groupBy: "$status",
                                          boundaries: [0,1,2,3,4],
                                          default: "_id",
                                          output: {
                                            "count": { $sum: 1 },
                                            "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                          }
                                        }
                                    }
                                ],
                                "RejectedCount": [
                                    { $match : {'status': { "$exists": true, "$in": [0] }}},
                                    { $sort: { _id: -1 } },
                                    {
                                        $bucket: {
                                          groupBy: "$status",
                                          boundaries: [0,1,2,3,4],
                                          default: "_id",
                                          output: {
                                            "count": { $sum: 1 },
                                            "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                          }
                                        }
                                    }
                                ]
                            }}
                        ]).toArray(function(err,tcount){
    
                            result[0]["SubmittedCount"] = tcount[0]["SubmittedCount"][0] ? tcount[0]["SubmittedCount"][0]["count"] : 0;
                            result[0]["PendingCount"] = tcount[0]["PendingCount"][0] ? tcount[0]["PendingCount"][0]["count"] : 0;
                            result[0]["ApprovedCount"] = tcount[0]["ApprovedCount"][0] ? tcount[0]["ApprovedCount"][0]["count"] : 0;
                            result[0]["RejectedCount"] = tcount[0]["RejectedCount"][0] ? tcount[0]["RejectedCount"][0]["count"] : 0;
                            result[0]["SubmittedDates"] = tcount[0]["SubmittedCount"][0] ? tcount[0]["SubmittedCount"][0]["dates"] : [];
                            result[0]["PendingDates"] = tcount[0]["PendingCount"][0] ? tcount[0]["PendingCount"][0]["dates"] : [];
                            result[0]["ApprovedDates"] = tcount[0]["ApprovedCount"][0] ? tcount[0]["ApprovedCount"][0]["dates"] : [];
                            result[0]["RejectedDates"] = tcount[0]["RejectedCount"][0] ? tcount[0]["RejectedCount"][0]["dates"] : [];
    
                            return res.status(200).json({
                                dashboard_data: result,
                            });
    
                        });

                    });

                }else if(role == 3){

                    timesheets.aggregate([
                        { $match : {"employee_id":user_id}},
                        { $facet: {
                            "PendingCount": [
                                { $match : {'status': { "$exists": true, "$in": [1] }}},
                                { $sort: { _id: -1 } },
                                {
                                    $bucket: {
                                      groupBy: "$status",
                                      boundaries: [0,1,2,3,4],
                                      default: "_id",
                                      output: {
                                        "count": { $sum: 1 },
                                        "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                      }
                                    }
                                }
                            ],
                            "SubmittedCount": [
                                { $match : {'status': { "$exists": true, "$in": [2] }}},
                                { $sort: { _id: -1 } },
                                {
                                    $bucket: {
                                      groupBy: "$status",
                                      boundaries: [0,1,2,3,4],
                                      default: "_id",
                                      output: {
                                        "count": { $sum: 1 },
                                        "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                      }
                                    }
                                }
                            ],
                            "ApprovedCount": [
                                { $match : {'status': { "$exists": true, "$in": [3] }}},
                                { $sort: { _id: -1 } },
                                {
                                    $bucket: {
                                      groupBy: "$status",
                                      boundaries: [0,1,2,3,4],
                                      default: "_id",
                                      output: {
                                        "count": { $sum: 1 },
                                        "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                      }
                                    }
                                }
                            ],
                            "RejectedCount": [
                                { $match : {'status': { "$exists": true, "$in": [0] }}},
                                { $sort: { _id: -1 } },
                                {
                                    $bucket: {
                                      groupBy: "$status",
                                      boundaries: [0,1,2,3,4],
                                      default: "_id",
                                      output: {
                                        "count": { $sum: 1 },
                                        "dates": { $push: { "id": "$_id", "start_date": "$start_date", "end_date": "$end_date" } },
                                      }
                                    }
                                }
                            ]
                        }},
                    ]).toArray(function(err,tcount){

                        result[0]["EMPCount"] = 0;
                        result[0]["PROJECTCount"] = 0;
                        result[0]["SubmittedCount"] = tcount[0]["SubmittedCount"][0] ? tcount[0]["SubmittedCount"][0]["count"] : 0;
                        result[0]["PendingCount"] = tcount[0]["PendingCount"][0] ? tcount[0]["PendingCount"][0]["count"] : 0;
                        result[0]["ApprovedCount"] = tcount[0]["ApprovedCount"][0] ? tcount[0]["ApprovedCount"][0]["count"] : 0;
                        result[0]["RejectedCount"] = tcount[0]["RejectedCount"][0] ? tcount[0]["RejectedCount"][0]["count"] : 0;
                        result[0]["SubmittedDates"] = tcount[0]["SubmittedCount"][0] ? tcount[0]["SubmittedCount"][0]["dates"] : [];
                        result[0]["PendingDates"] = tcount[0]["PendingCount"][0] ? tcount[0]["PendingCount"][0]["dates"] : [];
                        result[0]["ApprovedDates"] = tcount[0]["ApprovedCount"][0] ? tcount[0]["ApprovedCount"][0]["dates"] : [];
                        result[0]["RejectedDates"] = tcount[0]["RejectedCount"][0] ? tcount[0]["RejectedCount"][0]["dates"] : [];

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


