const express = require("express");
const router = express.Router();
require("dotenv").config();  

//importing data model schemas
let { userdata } = require("../models/models");
let { eventdata } = require("../models/models"); 

var orgaccess = process.env.ORGANIZATION_ACCESS;


//GET all users
router.get("/", (req, res, next) => { 
    userdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single user by ID
router.get("/id/:id", (req, res, next) => { 
    userdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET user entries based on search query
//Ex: '...?lastName=Nguyen&searchBy=lastLame' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'firstName') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'lastName') {
        dbQuery = { firstName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    };
    userdata.find( 
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

/*
//POST
router.post("/", (req, res, next) => { 
    req.body.access = { orgid: orgaccess };
    userdata.create( 
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
//creating user with check for existing phone number under the organization ID
router.post("/", (req, res, next) => {
    userdata.find(
        {'access.orgid': orgaccess, 'userContact.phoneNumber': req.body.userContact.phoneNumber},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                if (data.length > 0) {
                    res.json('User exist with that phone number already.');
                }
                if (data.length == 0) {
                    req.body.access = { orgid: orgaccess };
                    userdata.create( 
                        req.body, 
                        (error, data) => { 
                            if (error) {
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

/*
//PUT
router.put("/:id", (req, res, next) => {
    userdata.findOneAndUpdate(
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
//put check organization access before updating user data
router.put("/:id", (req, res, next) => {
    userdata.findOne(
        {_id: req.params.id},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                console.log(orgaccess, process.env.ORGANIZATION_ACCESS)
                var authorized_access = data.access.orgid;
                if (orgaccess == authorized_access) {
                    userdata.findOneAndUpdate(
                        {_id: req.params.id},
                        req.body,
                        (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                res.json("User Update Successful");
                            }
                        }
                    );
                }
                else{
                    res.json(`This organization does not have access to this user`);
                }
            }
        }
    );
});


router.delete("/:id", (req, res, next) => {
    userdata.findOne(
        {_id: req.params.id},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                console.log(orgaccess, process.env.ORGANIZATION_ACCESS)
                var authorized_access = data.access.orgid;
                if (orgaccess == authorized_access) {
                    userdata.deleteOne(
                        {_id: req.params.id},
                        (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                res.json("User Delete Successful");
                            }
                        }
                    );
                }
                else{
                    res.json(`This organization does not have access to this User`);
                }
            }
        }
    );
});


module.exports = router;