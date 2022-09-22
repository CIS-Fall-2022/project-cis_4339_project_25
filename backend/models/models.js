const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for intakeData
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: String
    }]
}, {
    collection: 'eventData'
});

let organizationDataSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    organizationName: {type: String, require: True},
    organizationInformation: {type: String},
    organizationContact: {
        email: {type: String, require: True},
        phoneNumber: {type: Array, require: True},
        address: {
            line1: {type: String},
            line2: {type: String},
            city: {type: String},
            county: {type: String},
            zip: {type: String}
        },
    }
}, {
    collection: 'organizationData'
});

let eventDataSchema2 = new Schema({
    _id: {type: String, default: uuid.v1},
    eventName: {type: String, require: True},
    eventDate: {type: Date, require: True},
    eventInfo: {type: String},
    eventAttendees: [{
        userid: {type: String},
        date_signup: {type: Date}
    }],
    access: {
        orgid: {type: String, require: True}
    }
}, {
    collection: 'eventData'
});

let userDataSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    firstName: {type: String, require: True},
    middleName: {type: String},
    lastName: {type: String, require: True},
    userContact: {
        email: {type: String},
        phoneNumber: {type: Array, require: True},
        address: {
            line1: {type: String},
            line2: {type: String},
            city: {type: String},
            county: {type: String},
            zip: {type: String}
        },
    },
    access: {
        orgid: {type: String, require: True}
    }
}, {
    collection: 'userData',
    timestamps: true
})

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const organizationdata = mongoose.model('organizationData', organizationDataSchema);
const eventdata2 = mongoose.model('eventData2', eventDataSchema2);
const userdata = mongoose.model('userData', userDataSchema);


// package the models in an object to export 
module.exports = { primarydata, eventdata, organizationdata, eventdata2, userdata }
