const mongoose = require("mongoose");
const validator = require("validator");


const usersShema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trime: true
    },
    lname: {
        type: String,
        required: true,
        trime: true
    },
    date: {
        type: Date,
        required: true,
    },
    department: {
        type: String,
        required: true,
        trime: true
    },
    qual1: {
        type: String,
        
        trime: true
    },
    qual2: {
        type: String,
        
        trime: true
    },
    status: {
        type: String,
        
    },
    status2: {
        type: String,
        
    },
    designation: {
        type: String,
        required: true,
        trime: true
    },
    experience: {
        type: String,
        required: true,
        trime: true
    },
    cctc: {
        type: String,
        required: true,
        trime: true
    },
    ectc: {
        type: String,
        required: true,
        trime: true
    },
    period: {
        type: String,
        required: true,
        trime: true
    },
    industry: {
        type: String,
        required: true,
        trime: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Not Valid Email")
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    almobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    gender: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    datecreated: Date,
    dateUpdated: Date
});

// model
const users = new mongoose.model("users", usersShema);

module.exports = users;

