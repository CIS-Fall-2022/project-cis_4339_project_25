const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata2 } = require("../models/models"); 

/* add events on postman example

{
    "eventName": "my test event",
    "eventDate": "03/13/2023",
    "eventInfo": "this is my event information",
    "eventAttendees": [],
    "access": {
        "orgid": "7de45d00-3ad0-11ed-a9a4-05c1168e4d66"
    }
}

ADDING users to event example
{
    "date_signup": ""
}

*/

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata2.find( 
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
    eventdata2.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata2.find( 
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

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata2.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST
router.post("/", (req, res, next) => { 
    eventdata2.create( 
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

//PUT
router.put("/:id", (req, res, next) => {
    eventdata2.findOneAndUpdate(
        { _id: req.params.id },
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

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata2.find( 
        { _id: req.params.id, userid: req.body.userid }, 
        (error, data) => { 
            if (error) {
                return next(error); //need fix
            } else {
                if (data.length == 0) {
                    eventdata2.updateOne(
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
                
            }
        }
    );
    
});

module.exports = router;