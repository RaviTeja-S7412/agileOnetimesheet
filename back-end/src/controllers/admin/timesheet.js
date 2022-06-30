const mongo = require('../../connection.js').getDb();
const bcrypt = require('bcrypt');

const timesheets = mongo.collection("tbl_timesheets");
var ObjectId = require('mongodb').ObjectID;

exports.create_timesheet = (req, res) => {

    var errors1 = [];
    const week_days = req.body.week_days;
    const ref = req.body.ref;
    week_days.forEach((val, index) => {
        if(val["week"] != "Sat" && val["week"] != "Sun"){
            if(!req.body.task_names[val['date']]){
                errors1.push({ message: "Task Names is Required for (" + val['date'] + ")" });
            }
            if(!req.body.start_time[val['date']]){
                errors1.push({ message: "Start Time is Required for (" + val['date'] + ")" });
            }
            if(!req.body.finish_time[val['date']]){
                errors1.push({ message: "Finish Time is Required for (" + val['date'] + ")" });
            }
            if(!req.body.total_hours[val['date']]){
                errors1.push({ message: "Total Hours is Required for (" + val['date'] + ")" });
            }
        }

        if(errors1.length > 0){
            return res.status(202).json(errors1[0]);
        }

        var timeStart = new Date(val['date'] +" "+ req.body.start_time[val['date']] + ":00").getTime();
        var timeEnd = new Date(val['date'] +" "+ req.body.finish_time[val['date']] + ":00").getTime();
        
        var hourDiff = timeEnd - timeStart;   
        var minutes = Math.floor(hourDiff / 60000);
        var hours = Math.floor(minutes / 60);
        // var seconds = ((hourDiff % 60000) / 1000).toFixed(0);
        // console.log(minutes + ":" + hours)

        if(minutes <= 0){
            return res.status(202).json({ message: "Start Time Should be less than Finish Time for (" + val['date'] + ")" });
        }

        if(req.body.total_hours[val['date']] > hours){
            return res.status(202).json({ message: "Task Hours Should be in between Start Time & Finish TIme for (" + val['date'] + ")" });
        }

    })

    if(req.body.task_names.length == 0){
        return res.status(202).json({ message: "Task Names is Required." });
    }
    if(req.body.start_time.length == 0){
        return res.status(202).json({ message: "Start Time is Required." });
    }
    if(req.body.finish_time.length == 0){
        return res.status(202).json({ message: "Finish Time is Required." });
    }
    if(req.body.total_hours.length == 0){
        return res.status(202).json({ message: "Total Hours is Required." });
    }

    if(ref == "save"){
        var data = {
            "start_date": req.body.start_date,
            "end_date": req.body.end_date,
            "week_days": req.body.week_days,
            "task_names": req.body.task_names,
            "start_time": req.body.start_time,
            "finish_time": req.body.finish_time,
            "comments": req.body.comments,
            "total_hours": req.body.total_hours,
            "created_date": new Date(),
            "employee_id": req.body.employee_id,
            "team_lead": req.body.team_lead,
            "updated_date": "",
            "status" : 1,
            "deleted" : 0
        }
    }else if(ref == "approve"){
        var data = {
            "status" : 3
        }
    }else if(ref == "submit"){
        var data = {
            "start_date": req.body.start_date,
            "end_date": req.body.end_date,
            "week_days": req.body.week_days,
            "task_names": req.body.task_names,
            "start_time": req.body.start_time,
            "finish_time": req.body.finish_time,
            "comments": req.body.comments,
            "total_hours": req.body.total_hours,
            "status" : 2
        }
    }

    var errors = [];
    timesheets.find({ start_date: req.body.start_date, employee_id: req.body.employee_id }).toArray((error, result1) => {
        if (result1.length > 0) {
            //errors.push({message:"Timesheet Already Added For This Week."});

            timesheets.updateOne({ start_date: req.body.start_date, employee_id: req.body.employee_id }, {$set: data}, function (error, result) {
                if (error) {
                    return res.status(202).json({
                        message: error
                    });
                }

                if (result) {
                    return res.status(200).json({
                        message: "Updated Successfully"
                    })
                }
            });

        }else{

            timesheets.insertOne(data, function (error, result) {
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
        }
    });
}

exports.update_timesheet = (req, res) => {

    var errors = [];
    const week_days = req.body.week_days;
    const ref = req.body.ref;
    week_days.forEach((val, index) => {

        if(val["week"] != "Sat" && val["week"] != "Sun"){
            if(!req.body.task_names[val['date']]){
                errors.push({ message: "Task Names is Required for (" + val['date'] + ")" });
            }
            if(!req.body.start_time[val['date']]){
                errors.push({ message: "Start Time is Required for (" + val['date'] + ")" });
            }
            if(!req.body.finish_time[val['date']]){
                errors.push({ message: "Finish Time is Required for (" + val['date'] + ")" });
            }
            if(!req.body.total_hours[val['date']]){
                errors.push({ message: "Total Hours is Required for (" + val['date'] + ")" });
            }
        }

        if(errors.length > 0){
            return res.status(202).json(errors[0]);
        }

        var timeStart = new Date(val['date'] +" "+ req.body.start_time[val['date']] + ":00").getTime();
        var timeEnd = new Date(val['date'] +" "+ req.body.finish_time[val['date']] + ":00").getTime();
        
        var hourDiff = timeEnd - timeStart;   
        var minutes = Math.floor(hourDiff / 60000);
        var hours = Math.floor(minutes / 60);
        // var seconds = ((hourDiff % 60000) / 1000).toFixed(0);
        // console.log(minutes + ":" + hours)

        if(minutes <= 0){
            return res.status(202).json({ message: "Start Time Should be less than Finish Time for (" + val['date'] + ")" });
        }

        if(req.body.total_hours[val['date']] > hours){
            return res.status(202).json({ message: "Task Hours Should be in between Start Time & Finish TIme for (" + val['date'] + ")" });
        }

    })

    if(req.body.task_names.length == 0){
        return res.status(202).json({ message: "Task Names is Required." });
    }
    if(req.body.start_time.length == 0){
        return res.status(202).json({ message: "Start Time is Required." });
    }
    if(req.body.finish_time.length == 0){
        return res.status(202).json({ message: "Finish Time is Required." });
    }
    if(req.body.total_hours.length == 0){
        return res.status(202).json({ message: "Total Hours is Required." });
    }
    if(!req.body.id){
        return res.status(202).json({ message: "ID is Required." });
    }

    if(ref == "save"){
        var  data = {
            "start_date": req.body.start_date,
            "end_date": req.body.end_date,
            "week_days": req.body.week_days,
            "task_names": req.body.task_names,
            "start_time": req.body.start_time,
            "finish_time": req.body.finish_time,
            "comments": req.body.comments,
            "total_hours": req.body.total_hours,
            "updated_by": req.body.employee_id,
            "updated_date": new Date(),
        }
    }else if(ref == "approve"){
        var data = {
            "comments": req.body.comments,
            "status" : 3
        }
    }else if(ref == "submit"){
        var data = {
            "start_date": req.body.start_date,
            "end_date": req.body.end_date,
            "week_days": req.body.week_days,
            "task_names": req.body.task_names,
            "start_time": req.body.start_time,
            "finish_time": req.body.finish_time,
            "comments": req.body.comments,
            "total_hours": req.body.total_hours,
            "status" : 2
        }
    }

    var errors = [];

    timesheets.find({ start_date: req.body.start_date, employee_id: req.body.employee_id }).toArray((error, result1) => {
        if (result1.length > 0) {
            if(result1[0]._id != req.body.id){
                errors.push({message:"Timesheet Already Added For This Week."});
            }
        }

        if(errors.length == 0){
    
            timesheets.updateOne({_id:new ObjectId(req.body.id)}, {$set: data}, function (error, result) {
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

exports.get_timesheets = (req, res) => {
    
    var perPage = req.body.perPage ? req.body.perPage : 10,
    page = req.body.page-1
    var search = req.body.search
    var role = req.body.role
    const data = []

    var query = {};
    if(role === 2){
        query["team_lead"] = req.body.employee_id;
    }else{
        query["employee_id"] = req.body.employee_id;
    }
    query["deleted"] = 0;
    // query["status"] = 1;

    timesheets.aggregate([
        { "$sort": { '_id' : -1 } },
        { "$limit": perPage * req.body.page },
        { "$skip": perPage * page },
        {$match: 
            {
                $and: [query],
                $or: 
                [ 
                    { start_date: { "$regex": search, "$options": "i"} },
                    { end_date: { "$regex": search, "$options": "i"} },
                ] 
            },
        },
        { "$addFields": {
            employee_id: {
                "$toObjectId": "$employee_id"
            }
        }},
        { $lookup: {
            from:'tbl_employees',
            localField: "employee_id",
            foreignField: "_id",
            as: "employee_data"                                                                  
        }},
    ])
    .toArray(function (err, db_data) {

            if(err){
                return res.status(202).json({message:err});
            }

            if(db_data.length > 0){
                db_data.forEach((element) => {
                  
                    var status = element.status;
                    if(status == 1){
                        status = "Pending";
                    }else if(status == 2){
                        status = "Submitted";
                    }else if(status == 3){
                        status = "Approved";
                    }else if(status == 4){
                        status = "Rejected";
                    }

                    data.push({
                        "id": element._id,
                        "employee_name": element.employee_data.length > 0 ?  element.employee_data[0].employee_name : '',
                        "start_date": element.start_date,
                        "end_date": element.end_date,
                        "created_date": new Date(element.created_date).toLocaleDateString('en-US'),
                        "status": status,
                    })

                });
            }

            timesheets.find({"deleted":0,"employee_id":req.body.employee_id, $or: 
                [ 
                  { start_date: { "$regex": search, "$options": "i"} },
                  { end_date: { "$regex": search, "$options": "i"} },
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

exports.deleteTimesheet = (req, res) => {

    const id = req.body.user_id;
    if(!id){
        return res.status(202).json({ message: "ID is Required." });
    }

    timesheets.deleteOne({ _id: new ObjectId(id) },(error, result) => {
        
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: "Timesheet Deleted Successfully" });
        }else{
            return res.status(202).json({ message: "Timesheet Not Found" });
        }

    });

}

exports.get_singletimesheet = (req, res) => {

    const tid = req.body.tid;
    const user_id = req.body.user_id;
    const sdate = req.body.sdate;
    const edate = req.body.edate;

    var query = {};

    if(tid){
        query["_id"] = new ObjectId(tid)
    }else{
        query["start_date"] = sdate;
        query["end_date"] = edate;
        query["employee_id"] = user_id;
    }
    // if(!id){
    //     return res.status(202).json({ message: "ID is Required." });
    // }

    timesheets.find(query).toArray((error, result) => {
        
        if (result.length > 0) {
            return res.status(200).json({ timesheet_data: result[0] });
        }else{
            return res.status(202).json({ message: "Timesheet Not Updated." });
        }

    });

}
