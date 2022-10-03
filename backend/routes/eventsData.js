const express = require("express");
const router = express.Router();
require("dotenv").config();  

//importing data model schemas
let { eventdata } = require("../models/models"); 

var orgaccess = process.env.ORGANIZATION_ACCESS;

//GET all events
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single event by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});
//db.eventData.aggregate([{$match: {_id: "ff502450-3d00-11ed-aba5-793b1e63ba89"}}, {$project: {mycount: {$size: {$filter: {input: "$eventAttendees", as: "attendees", cond: {$and: [{$gte: ["$$attendees.date_signup", ISODate("2022-03-01")]}, {$lte: ["$$attendees.date_signup", ISODate("2022-04-01")]}]}}}}}}])
//GET user count for certain event by signup date range
router.get("/count", (req, res, next) => {
    var curdate = new Date();
    var curdatestring = new Date().toISOString().slice(0,10);
    curdate.setMonth(curdate.getMonth() -2);
    var bottomlimitdate = curdate.toISOString().slice(0,10);
    console.log(curdatestring, bottomlimitdate)
    eventdata.aggregate([{$match: {_id: req.body.eventid}}, 
        {$project: 
            {mycount: 
                {$size: 
                    {$filter: 
                        {input: "$eventAttendees", as: "attendees", cond: 
                        {$and: [{$gte: ["$$attendees.date_signup", new Date(req.body.startDate)]}, 
                        {$lte: ["$$attendees.date_signup", new Date(req.body.endDate)]}]}}}}}}], 
                        (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//db.eventData.aggregate([{$project: {mycount: {$size: {$filter: {input: "$eventAttendees", as: "attendees", cond: {$and: [{$gte: ["$$attendees.date_signup", ISODate("2022-08-03")]}, {$lte: ["$$attendees.date_signup", ISODate("2022-10-03")]}]}}}}}}, {$match: {"mycount": {$gt: 0}}}])
//GET all events that has user signed up in the past 2 months
router.get("/countall", (req, res, next) => {
    var curdate = new Date();
    var curdatestring = new Date().toISOString().slice(0,10).toString();
    curdate.setMonth(curdate.getMonth() -2);
    var bottomlimitdate = curdate.toISOString().slice(0,10).toString();
    console.log(curdatestring, bottomlimitdate)
    eventdata.aggregate([
        {$project: 
            {mycount: 
                {$size: 
                    {$filter: 
                        {input: "$eventAttendees", as: "attendees", cond: 
                        {$and: [{$gte: ["$$attendees.date_signup", new Date(bottomlimitdate)]}, 
                        {$lte: ["$$attendees.date_signup", new Date(curdatestring)]}]}}}}}},
                    {$match: {"mycount": {$gt: 0}}}],(error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET events by single date
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            eventDate:  req.query["eventDate"]
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for which a user is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { eventAttendees: {$elemMatch: {userid: req.params.id}}}, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST add event
router.post("/", (req, res, next) => { 
    req.body.access = { orgid: orgaccess };
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});
/*
//PUT update event by id
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                var authorized_access = data.access.orgid;
                if (orgaccess == authorized_access) {
                    res.json(data);
                }
                else{
                    res.json(`This organization does not have access to this event`);
                }
            }
        }
    );
});
*/
//put update check org access before updating user
router.put("/:id", (req, res, next) => {
    eventdata.findOne(
        {_id: req.params.id},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                console.log(orgaccess, process.env.ORGANIZATION_ACCESS)
                var authorized_access = data.access.orgid;
                if (orgaccess == authorized_access) {
                    eventdata.findOneAndUpdate(
                        {_id: req.params.id},
                        req.body,
                        (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                res.json("Event Update Successful");
                            }
                        }
                    );
                }
                else{
                    res.json(`This organization does not have access to this event`);
                }
            }
        }
    );
});



//PUT add attendee to event with event id and user id
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, eventAttendees: {$elemMatch: {userid: req.body.userid}} }, 
        (error, data) => { 
            if (error) {
                return next(error); //need fix
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { eventAttendees: req.body } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                if (data.length > 0) {
                    var signupdate = data[0].eventAttendees.filter(user => user.userid === req.body.userid)[0].date_signup.toDateString();

                    res.json(`You already signed up for the event on ${signupdate}.`);
                }
                
            }
        }
    );
    
});


router.delete("/:id", (req, res, next) => {
    eventdata.findOne(
        {_id: req.params.id},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                console.log(orgaccess, process.env.ORGANIZATION_ACCESS)
                var authorized_access = data.access.orgid;
                if (orgaccess == authorized_access) {
                    eventdata.deleteOne(
                        {_id: req.params.id},
                        (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                res.json("Event Delete Successful");
                            }
                        }
                    );
                }
                else{
                    res.json(`This organization does not have access to this event`);
                }
            }
        }
    );
});

//db.eventData.aggregate([{$match: {_id: "ff502450-3d00-11ed-aba5-793b1e63ba89"}},{$project: {mycount: {$size: "$eventAttendees"}}}]) 
//^^this works it returns 2 which is correct amount of user signing up but we need to figure out how to make it filter out by dates
//db.eventData.aggregate([{$match: {_id: "ff502450-3d00-11ed-aba5-793b1e63ba89"}},{$project: {mycount: {$size: {$filter: {input: "$eventAttendees", as "attendees", cond: {$gt: ["$$attendees.date_signup", "2021-01-01"]}}}}}}])

//db.eventData.aggregate([{$match: {_id: "ff502450-3d00-11ed-aba5-793b1e63ba89"}}, {$project: {mycount: {$filter: {input: "$eventAttendees", as: "attendees", cond: {$gte: ["$$attendees.date_signup", ISODate("2022-01-01")]}}}}}]) 
//db.eventData.aggregate([{$match: {_id: "ff502450-3d00-11ed-aba5-793b1e63ba89"}}, {$project: {mycount: {$filter: {input: "$eventAttendees", as: "attendees", cond: {$and: [{$gte: ["$$attendees.date_signup", ISODate("2021-01-01")]}, {$lte: ["$$attendees.date_signup", ISODate("2022-01-01")]}]}}}}}])

//WORKING FUNCTION BELOW
//db.eventData.aggregate([{$match: {_id: "ff502450-3d00-11ed-aba5-793b1e63ba89"}}, {$project: {mycount: {$size: {$filter: {input: "$eventAttendees", as: "attendees", cond: {$and: [{$gte: ["$$attendees.date_signup", ISODate("2022-03-01")]}, {$lte: ["$$attendees.date_signup", ISODate("2022-04-01")]}]}}}}}}])
//above return a specific table where poeple have signed up between certain date

//below return ALL EVENTS WHERE USER HAVE SIGNED UP IN THE PAST 2 MONTHS
//db.eventData.aggregate([{$project: {mycount: {$size: {$filter: {input: "$eventAttendees", as: "attendees", cond: {$and: [{$gte: ["$$attendees.date_signup", ISODate("2022-08-03")]}, {$lte: ["$$attendees.date_signup", ISODate("2022-10-03")]}]}}}}}}, {$match: {"mycount": {$gt: 0}}}])
module.exports = router;