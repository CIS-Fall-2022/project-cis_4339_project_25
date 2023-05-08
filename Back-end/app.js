const express = require("express");
const morgan = require("morgan"); //better debugging
const cors = require("cors");
const nodemailer = require("nodemailer");
const moment = require('moment-timezone');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
//allow using a .env file
require("dotenv").config();   

//creates a new instance of express application
const app = express();
app.use(bodyParser.json());

// add cors header to the server
app.use(cors({
  origin: '*'
}));

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


connection.connect((error) => {
  if (error) {
    console.log("mySQL connection Error", error)
  } else {
    console.log("Database connection successful!")
  }
});


//all routes below
//startget

//get main page test
//http://127.0.0.1:3000/
app.get("/", (req, res, next) => {
  res.json("Backend is up and running") 
})

app.post("/test", (req, res, next) => {
  //use this for any backend test function
  //service_id is a list [1,2,3] etc
  var newpass = hashPassword('DBA123');
})

//get all appointment info
//http://127.0.0.1:3000/appointmentInfo
app.get("/appointmentInfo", (req, res, next) => {
  const call = 'CALL getAllApptInfo()';
  connection.query(call, (error, results) => {
    if (error) {
      return next(error);
    } else {
      console.log(results)
      res.json(results)
    }
  }) 
})

//http://127.0.0.1:3000/daySchedule
app.get("/daySchedule", (req, res, next) => {
  const query = `select day_of_week from Employee_availability where employee_id = 1`;
  connection.query(query, (error, results) => {
    if (error) {
      return next(error);
    } else {
      res.json(results)
    }
  }) 
})

//http://127.0.0.1:3000/allServices
app.get("/allServices", (req, res, next) => {
  const query = `select * from Service`;
  connection.query(query, (error, results) => {
    if (error) {
      return next(error);
    } else {
      res.json(results)
    }
  }) 
})

//http://127.0.0.1:3000/Service/:id
app.get("/Service/:id", (req, res, next) => {
  const { id } = req.params;
  const query = `select * from Service where id = ${id}`;
  connection.query(query, (error, results) => {
    if (error) {
      return next(error);
    } else {
      res.json(results)
    }
  }) 
})

//http://127.0.0.1:3000/availableHour/20230302
app.get("/availableHour/:day", (req, res, next) => {
  //should be like availableHours 20230301 yyyymmdd
  const { day } = req.params;
  var myyear = day.substring(0,4);
  var mymonth = day.substring(4,6);
  var myday = day.substring(6,8);
  var fulldate = new Date(myyear, mymonth-1, myday);
  var myday = getDayofWeekfromDate(fulldate); //2023-03-01T06:00:00.000Z
  console.log(fulldate)
  const query = `select start_time, end_time from Employee_availability where employee_id = 1 AND day_of_week = ?`;
  connection.query(query, [myday], (error, results) => {
    if (error) {
      res.json("Not on availability list")
      return next(error);
    } else {
      //console.log(results[0].start_time);
      //console.log(results[0].end_time);
      var hourList = getHoursInRange(results[0].start_time, results[0].end_time);

      console.log(hourList)
      const query2 = `select * from Appointment where appt_date = ? and canceled != 'y'`
      connection.query(query2, [fulldate], (error, results2) => {
        if (error) {
          return next(error);
        } else {
          if (results2.length != 0) {
            //if there IS time taken then....
            console.log(results2);
            var timeTaken = []
            results2.forEach(element => timeTaken.push(convertTime(element.start_time)));
            var filteredTime = hourList.filter(num => !timeTaken.includes(num));
            res.json(filteredTime);
            //results2.forEach(element => console.log(convertTime(element.start_time)))
          } else {
            //if there IS NOT time taken then it return the normal time list
            res.json(hourList)
          }
        }
      })
    }
  }) 
})

//http://127.0.0.1:3000/getReport/?id=1
//id is 1 through 13
//http://127.0.0.1:3000/getReport/?date=20230314&id=1
//date is required for report number 1
//http://127.0.0.1:3000/getReport/?date=20230314-20230331&id=2
//2 date is required for report 2 and 6
//http://127.0.0.1:3000/getReport/?date=20230314&id=8
//report 8 also has an optional param of 'option' u can put 1 2 or 3 to get week, month, or year report, if u put none it'll
//give u a summary by week, month, AND year 
app.get("/getReport/", (req, res, next) => {
  const date = req.query.date;
  const id = req.query.id;
  //const { date } = req.params['date'];
  //console.log(id);
  if (date) {
    var myquery = getReportQuery(id, date);
  } else {
    var myquery = getReportQuery(id);
  }
  //console.log(myquery);

  connection.query(myquery, (error, results) => {
    if (error) {
      return next(error);
    } else {
      res.json(results)
    }
  }) 
})



app.get("/getAnnouncement", (req, res, next) => {
  const query = `select text_char from Text where id = 1;`;
  connection.query(query, (error, results) => {
    if (error) {
      return next(error);
    } else {
      res.json(results)
    }
  }) 
})

app.post("/changeAnnouncement", (req, res, next) => {
  const { newAnnouncement } = req.body;
  const query = `update Text set text_char = ? where id = 1;`;
  connection.query(query, [newAnnouncement], (error, results) => {
    if (error) {
      return next(error);
    } else {
      res.json(results)
    }
  }) 
})

app.get("/cancelSearch", (req, res, next) => {
  const { date, phone } = req.query;
  console.log(date, phone);
  const call = `call getSpecificApptInfo(?, ?)`;
  connection.query(call, [date, phone], (error, results) => {
    if (error) {
      return next(error);
    } else {
      console.log(results);
      res.json(results)
    }
  }) 
})



//endget
//allpost


//http://127.0.0.1:3000/login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  // Retrieve the hashed password from the database based on the username
  connection.query('SELECT * FROM Employee WHERE username = ?', [username], async (error, results) => {
    if (error) {
      // If an error occurs, send a 500 Internal Server Error response
      return res.status(500).json({ message: 'An error occurred' });
    }
    // If no user is found, send a 401 Unauthorized response
    if (results.length === 0) {
      return res.status(401).json({ message: 'Incorrect username1 or password' });
    }

    const user = results[0];
    console.log(user)
    console.log(password, user.password)
    // Compare the hashed password from the database with the password provided by the user
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      // If the password doesn't match, send a 401 Unauthorized response
      return res.status(401).json({ message: 'Incorrect username or password1' });
    }

    // If the username and password match, generate a session token and send it in the response
    const sessionToken = generateSessionToken();
    res.json({ sessionToken });
  });
});

//http://127.0.0.1:3000/addAppt1Service
app.post("/addAppt1Service", (req, res, next) => {
  //service_id is just a single value here
  //[1]
  const { client_name, contact_email, contact_phone, appt_date, start_time, service_id } = req.body;
  const call = 'CALL addClientAndAppt(?, ?, ?, ?, ?, ?)';
  const params = [client_name, contact_email, contact_phone, appt_date, start_time, service_id[0]];
  connection.query(call, params,(error, results) => {
    if (error) {
      return next(error);
    } else {
      sendMail(makeAppMessage(client_name, appt_date, start_time));
      res.json(results)
    }
  }) 
})


//http://127.0.0.1:3000/addApptMultiService
app.post("/addApptMultiService", (req, res, next) => {
  //service_id is a list [1,2,3] etc
  const { client_name, contact_email, contact_phone, appt_date, start_time, service_id } = req.body;
  const call1 = `CALL addClientAndApptWReturn(?, ?, ?, ?, ?)`;
  const param1 = [client_name, contact_email, contact_phone, appt_date, start_time];
  connection.query(call1, param1,(error, results) => {
    if (error) {
      return next(error);
    } else {
      //the call should return the last inserted id which should be the appointment id
      //we then use that id to insert multiple scheduled services
      //make long query logic, should add more than 1 value per call dependign on length of service_id
      var query2 = `insert into MAIN.Scheduled_service(appointment_id, service_id) values`
      //run through the list
      //object is should check for last index of array lengthwise
      service_id.forEach((element, index, array) => {
        if (Object.is(array.length - 1, index)) {
          query2 = query2.concat(` (${results[0][0]['last_insert_id()']}, ${element});`)
        } else {
          query2 = query2.concat(` (${results[0][0]['last_insert_id()']}, ${element}),`)
        }
        //it should end in commas(,) on every thing other than the last value which should end with semis(;)
        //should be this, insert into Scheduled_services(appointment_id, service_id) values (1, 2), (1, 4), (1, 3);
        //where 1 is the result from the earlier call
      });

      connection.query(query2, (error, results2) => {
        if (error) {
          return next(error);
        } else {

          sendMail(makeAppMessage(client_name, appt_date, start_time));
          res.json('Appointment succesfully created')
        }
      })
      //res.json(results)
    }
  }) 
})



//endpost
//start put
//http://127.0.0.1:3000/cancelAppointment
//sample of check login? doesnt really do anything as of right now
//need some token authenthication for frontend to check to show the report and schedule page
app.put("/cancelAppointment", (req, res, next) => {
  const { cancellation_reason, id } = req.body;
  const query = `UPDATE MAIN.Appointment SET canceled = 'y', cancellation_reason = ? where id = ?`;
  console.log(cancellation_reason, id);
  connection.query(query,[cancellation_reason, id], (error, results) => {
    if (error) {
      return next(error);
    } else {
      console.log('Appointment was canceled')
      res.json('Appointment was canceled')
    }
  }) 
})
//end put


/* bottom is query i used to insert client and then making the client appt, we only use appt_date for the date only the time is on start_time
insert into MAIN.Client(client_name, contact_email, contact_phone)
values('Dan Doan','Dan@email.com','832-566-3079');
SET @last_id := last_insert_id();
insert into MAIN.Appointment(client_id, employee_id, service_id, appt_date, start_time, canceled)
values (@last_id, 1, 1, '2023-03-01', 120000, 'n')
*/

//all routes end

//misc functions
function getDayofWeekfromDate(dateString) {
  const dayOfWeek = dateString.getDay();
  switch (dayOfWeek) {
    case 0:
      return "sunday";
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case  6:
      return "saturday";
    default:
      throw new Error(`Invalid day of week: ${dayOfWeek}`);
  }
}

function getHoursInRange(startTime, endTime) {
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);
  var hours = [];

  for (let i = startHour; i <= endHour; i++) {
    hours.push(`${i}:00:00`);
  }

  return hours;
}

function convertTime(timeValue) {
  const hours = timeValue.substring(0, 2);
  const minutes = timeValue.substring(2, 4);
  const seconds = timeValue.substring(4, 6);
  return `${hours}:${minutes}:${seconds}`;
}

function generateSessionToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


async function hashPassword(password) {
  const saltRounds = 5;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

//http://127.0.0.1:3000/getReport
//http://127.0.0.1:3000/getReport/0
//http://127.0.0.1:3000/getReport/1?date=2023-03-14
//http://127.0.0.1:3000/getReport/2?date=20230314-20230331
function getReportQuery(idInt, date = null) {
  var myint = Number(idInt);
  switch (myint) {
    case 0: //Customer Information Report
      return `select DISTINCT client_name as 'Client Name', contact_phone as 'Phone' from Client ORDER BY client_name;`;
    case 1: //Daily Appointment Report (just input current date)
      return `SELECT client_name as 'Client Name', contact_phone as 'Phone', appt_date as 'Appointment Date', start_time as 'Time', 
      GROUP_CONCAT(service_type SEPARATOR ', ') AS 'Service(s)', canceled as 'Is Canceled?'
      FROM Appointment a 
      JOIN Client c ON a.client_id = c.id 
      JOIN Scheduled_service ss ON ss.appointment_id = a.id 
      JOIN Service s ON s.id = ss.service_id  
      WHERE appt_date = '${date}'
      GROUP BY appointment_id, client_name, contact_phone, appt_date, start_time, canceled
      ORDER BY appt_date, start_time;`;
    case 2: //Appointment Report Between 2 Dates
      var startdate = date.substring(0,8)
      var enddate = date.substring(9,17)
      return `SELECT client_name as 'Client Name', contact_phone as 'Phone', appt_date as 'Appointment Date', start_time as 'Time', 
      GROUP_CONCAT(service_type SEPARATOR ', ') AS 'Service(s)', canceled as 'Is Canceled?'
      FROM Appointment a 
      JOIN Client c ON a.client_id = c.id 
      JOIN Scheduled_service ss ON ss.appointment_id = a.id 
      JOIN Service s ON s.id = ss.service_id  
      WHERE appt_date between '${startdate}' and '${enddate}'
      GROUP BY appointment_id, client_name, contact_phone, appt_date, start_time, canceled
      ORDER BY appt_date, start_time;`;
    case 3: //Canceled Appointment Report
      return `SELECT client_name as 'Client Name', contact_phone as 'Phone', appt_date as 'Appointment Date', start_time as 'Time', 
      GROUP_CONCAT(service_type SEPARATOR ', ') AS 'Service(s)', canceled as 'Is Canceled?', cancellation_reason as 'Reason'
      FROM Appointment a 
      JOIN Client c ON a.client_id = c.id 
      JOIN Scheduled_service ss ON ss.appointment_id = a.id 
      JOIN Service s ON s.id = ss.service_id  
      WHERE canceled = 'y'
      GROUP BY appointment_id, client_name, contact_phone, appt_date, start_time, canceled
      ORDER BY appt_date, start_time;`;
    case 4: //Traffic by Day Report
      return `select count(*) as Count, DATE(appt_date) as Date
      from Appointment 
      GROUP BY DATE(appt_date) 
      ORDER BY DATE(appt_date);`;
    case 5: //Returning Customer Report
      return `select count(*) as Count, client_name as 'Client Name'
      FROM Client
      GROUP BY client_name
      ORDER BY Count DESC;`;
    case  6: //Returning Customer Report Between 2 dates
      var startdate = date.substring(0,7)
      var enddate = date.substring(9,16)
      console.log(startdate, enddate)
      return `select client_name as 'Client Name', contact_phone as 'Phone', count(client_name) as Count
      FROM Client c 
      JOIN Appointment a on a.client_id = c.id
      WHERE appt_date between '${startdate}' and '${enddate}' 
      AND canceled = 'n'
      GROUP BY client_name
	    ORDER BY Count DESC;`;
    case 7: //Serviced-Based Report
      return `SELECT s.service_type as 'Service', c.client_name as 'Client Name', COUNT(*) AS Count
      FROM Service s
      JOIN Scheduled_service ss ON ss.service_id = s.id
      JOIN Appointment a ON ss.appointment_id = a.id
      JOIN Client c ON a.client_id = c.id
      GROUP BY s.service_type, c.client_name
      ORDER BY Count DESC, 'Client Name';`;
    case 8: //Earnings per week Report
      return `SELECT WEEK(appt_date) AS Week, SUM(price) AS Earnings
      FROM
      Appointment appointment
      INNER JOIN Scheduled_service scheduled_service ON scheduled_service.appointment_id = appointment.id
      INNER JOIN Service service ON service.id = scheduled_service.service_id
      WHERE
      appointment.canceled = 'n'
      AND YEAR(appointment.appt_date) = YEAR('${date}')
      AND WEEK(appointment.appt_date) = WEEK('${date}')
      GROUP BY
      WEEK(appointment.appt_date);`;
    case 9: //Earnings per month report
      return `SELECT MONTHNAME(appt_date) AS Month, SUM(price) AS Earnings
        FROM
        Appointment appointment
        INNER JOIN Scheduled_service scheduled_service ON scheduled_service.appointment_id = appointment.id
        INNER JOIN Service service ON service.id = scheduled_service.service_id
        WHERE
        appointment.canceled = 'n'
        AND YEAR(appointment.appt_date) = YEAR('${date}')
        AND MONTH(appointment.appt_date) = MONTH('${date}')
        GROUP BY
        MONTH(appointment.appt_date);`;
    case 10: //Earnings per year report
      return `SELECT YEAR(appt_date) AS Year, SUM(price) AS Earnings
        FROM
        Appointment appointment
        INNER JOIN Scheduled_service scheduled_service ON scheduled_service.appointment_id = appointment.id
        INNER JOIN Service service ON service.id = scheduled_service.service_id
        WHERE
        appointment.canceled = 'n'
        AND YEAR(appointment.appt_date) = YEAR('${date}')
        GROUP BY
        YEAR(appointment.appt_date)
        ORDER BY
        YEAR(appointment.appt_date) DESC;`
    case 11: // Earning report (for all data)
      return `SELECT YEAR(appt_date) AS year, MONTH(appt_date) AS month, WEEK(appt_date) AS week, SUM(price) AS Earnings
        FROM
        Appointment appointment
        INNER JOIN Scheduled_service scheduled_service ON scheduled_service.appointment_id = appointment.id
        INNER JOIN Service service ON service.id = scheduled_service.service_id
        WHERE
        appointment.canceled = 'n'
        AND appt_date <= curdate()
        GROUP BY
        YEAR(appointment.appt_date),
        MONTH(appointment.appt_date),
        WEEK(appointment.appt_date)
        ORDER BY
        YEAR(appointment.appt_date) DESC,
        MONTH(appointment.appt_date) DESC,
        WEEK(appointment.appt_date) DESC;`;
    case 12: //Earnings per customer lifetime Report
      return `select Client.client_name as 'Client Name', Client.contact_phone as 'Phone', sum(Service.price) as 'Earnings'
        from Client 
        join Appointment on Client.id = Appointment.client_id 
        join Scheduled_service on Scheduled_service.appointment_id = Appointment.id
        join Service on Scheduled_service.service_id = Service.id 
        where Appointment.canceled = 'n'
        GROUP BY Client.contact_phone
        ORDER BY sum(Service.price) DESC;`;
    case 13: //Most and least common service lifetime Report
      return `select Service.service_type as 'Service', count(Scheduled_service.service_id) as 'Count' from Scheduled_service
      left join Service on Scheduled_service.service_id = Service.id 
      GROUP BY Service.service_type
      ORDER BY count(Scheduled_service.service_id) DESC;`;
    case 14: //Most and least profitable service lifetime Report
      return `select Service.service_type as 'Service', count(Scheduled_service.service_id) as 'Count', sum(Service.price) as 'Earnings' from Scheduled_service
      left join Service on Scheduled_service.service_id = Service.id 
      GROUP BY Service.service_type 
      ORDER BY Service.price desc;`;
    case 15: //Busiest day of the week Report Lifetime
      return `SELECT DAYNAME(appt_date) as Day, COUNT(*) as Count
      FROM Appointment
      GROUP BY day;`;
    case 16: //Customers that most cancel appointments Report
      return `select count(Appointment.canceled) as 'Cancel Count', Client.client_name as 'Client Name', Client.contact_phone as 'Phone' from Client 
      join Appointment on Client.id = Appointment.client_id
      where canceled = 'y' 
      GROUP BY Client.contact_phone 
      ORDER BY count(Appointment.canceled) DESC, Client.client_name;`;
    default:
      throw new Error(`Invalid id: ${idInt}`);
  }
}

//email stuff
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dnrappointmentnotification@gmail.com",
    pass: "zqrpfxyjqgfpxquo"
    //pass: "TestP@SSW0rd123!"
  }
});

function makeAppMessage(client_name, appt_date, start_time) {
  var dateObject = new Date(appt_date);
  var dateOnlyString = dateObject.toISOString().substring(0, 10);
  return {
    from: "DNRAppointmentNotification@gmail.com",
    to: "daannn445@gmail.com",
    subject: "Appointment Notification",
    text: `Hello, an appointment has been made for
    ${client_name}
    on ${dateOnlyString} at ${moment(start_time, 'HHmmss').tz('America/Chicago').format('h:mm A')} for more information, please login to the Appointment App.`
  }
};

function sendMail(message) {
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: '+ info.message)
    }
  })
};


//
//declare port number for the api
const PORT = process.env.PORT || 3000;

//setup
app.use(express.json());
app.use(morgan("dev"));


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

module.exports = connection;