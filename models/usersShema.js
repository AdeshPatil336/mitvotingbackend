const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    bdate: {
        type: Date,
        required: true,
    },
    dept: {
        type: String,
        required: true
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
    prn: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    profile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    votedNominees: [
        {
          nomineeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "nominees", 
          },
          post: String, 
        },
      ]
    
});


usersShema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password,12)
    next()
})

// Define a nominee schema
const nomineeSchema = new mongoose.Schema({
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
    bdate: {
        type: Date,
        required: true,
    },
    dept: {
        type: String,
        required: true
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
    prn: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    profile: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        default: 0,
    },
});




// Define a nominee schema
const deanSchema = new mongoose.Schema({
    deanemail: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Not Valid Email")
            }
        }
    },
    deandept: {
        type: String,
        required: true
    },
    deanpassword: {
        type: String,
        required: true
    }
});


//Vote schema

const voteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Reference to the users collection
        required: true,
    },
    nomineeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "nominees", // Reference to the nominees collection
        required: true,
    },
    voteCount: {
        type: Number,
        default: 0,
    },
    post: {
        type: String, // Store the post (e.g., "Class Representative")
        required: true,
    },
});

// Create a model for the nominee schema
const Nominee = new mongoose.model("nominees", nomineeSchema);
const users = new mongoose.model("registrations", usersShema);
const dean = new mongoose.model("deans", deanSchema);
const vote = mongoose.model("votes", voteSchema);

module.exports = {
    users,
    Nominee,
    dean,
    vote
};

