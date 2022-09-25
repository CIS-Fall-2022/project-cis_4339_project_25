const express = require("express"); 
const router = express.Router();

//importing data model schemas
//let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 
let { organizationdata } = require("../models/models"); 
let { userdata } = require("../models/models"); 

/* add organization testing on postman
{
    "organizationName": "my testorganizationame",
    "organizationInformation": "this organization is a test organization",
    "organizationContact": {
        "email":"mytestorg@email.com",
        "phoneNumber":"8326664444",
        "address": {
            "line1":"this is line1",
            "line2":"this is line2",
            "city":"houston",
            "county": "texas",
            "zip": "77075"
        }
    }
}
*/


//GET all ogranizations
router.get("/", (req, res, next) => { 
    organizationdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single organization by ID
router.get("/id/:id", (req, res, next) => {
    organizationdata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


//GET events for a single organization
router.get("/events/:id", (req, res, next) => { 
    eventdata.find(
        {access: {orgid: req.params.id}},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    )
});




//GET users for a single organization
router.get("/users/:id", (req, res, next) => { 
    userdata.find(
        {access: {orgid: req.params.id}},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    )
});

/*

//POST
router.post("/", (req, res, next) => { 
    organizationdata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    organizationdata.createdAt;
    organizationdata.updatedAt;
    organizationdata.createdAt instanceof Date;
});

//PUT update organization, put org ID after / then put update info in body
router.put("/:id", (req, res, next) => { 
    organizationdata.findOneAndUpdate( 
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
*/

module.exports = router;