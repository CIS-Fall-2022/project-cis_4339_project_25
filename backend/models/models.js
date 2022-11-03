const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for intakeData
let primaryDataSchemaold = new Schema({
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
let eventDataSchemaold = new Schema({
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
    organizationName: {type: String, require: true},
    organizationInformation: {type: String},
    organizationContact: {
        email: {type: String, require: true},
        phoneNumber: {type: Array, require: true},
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

let eventDataSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    eventName: {type: String, require: true},
    eventDate: {type: Date, require: true},
    eventInfo: {type: String},
    eventAddress: {
        line1: {type: String},
        line2: {type: String},
        city: {type: String},
        county: {type: String},
        zip: {type: String}
    },
    eventAttendees: [{
        userid: {type: String},
        date_signup: {type: Date}
    }],
    access: {
        orgid: {type: String, require: true}
    }
}, {
    collection: 'eventData'
});

let userDataSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    firstName: {type: String, require: true},
    middleName: {type: String},
    lastName: {type: String, require: true},
    userContact: {
        email: {type: String},
        phoneNumber: {type: Array, require: true},
        address: {
            line1: {type: String},
            line2: {type: String},
            city: {type: String},
            county: {type: String},
            zip: {type: String}
        },
    },
    access: {
        orgid: {type: String, require: true}
    }
}, {
    collection: 'userData',
    timestamps: true
})

// create models from mongoose schemas
//const primarydata = mongoose.model('primaryData', primaryDataSchema);
//const eventdata = mongoose.model('eventData', eventDataSchema);
const organizationdata = mongoose.model('organizationData', organizationDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const userdata = mongoose.model('userData', userDataSchema);


// package the models in an object to export 
module.exports = { eventdata, organizationdata, userdata }
