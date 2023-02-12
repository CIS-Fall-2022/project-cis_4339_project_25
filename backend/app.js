const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); //better debugging
const cors = require("cors");
//allow using a .env file
require("dotenv").config();   

//creates a new instance of express application
const app = express();

// add cors header to the server
app.use(cors({
  origin: '*'
}));

//sets up mongoose for the mongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection Success!");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

//declare port number for the api
const PORT = process.env.PORT || 3001;

//setup
app.use(express.json());
app.use(morgan("dev"));

//import routes
//const primaryDataRoute  = require('./routes/primaryData');
//const eventsDataRoute  = require('./routes/eventsData');
const organizationsDataRoute  = require('./routes/organizationsData');
const eventsDataRoute  = require('./routes/eventsData');
const usersDataRoute  = require('./routes/userData');

//setup middle ware for routes
//app.use('/primaryData', primaryDataRoute);
//app.use('/eventData', eventsDataRoute);
app.use('/organizationData', organizationsDataRoute);
app.use('/eventData', eventsDataRoute);
app.use('/userData', usersDataRoute);

//orgs ID: "7de45d00-3ad0-11ed-a9a4-05c1168e4d66"
//test event on cloud id = 947dfb10-3ad6-11ed-9108-0b10f13c1449
//test peter userid = 5f052090-3ad5-11ed-941c-5fe58bea6717


app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});

//error handler
app.use(function (err, req, res, next) {
  // logs error and error code to console
  console.error(err.message, req);
  if (!err.statusCode)
    err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});