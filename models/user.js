const mongoose = require('mongoose')
const Schema = mongoose.Schema //defines the structure of the data that we create

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    aadharNumber: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob:{
        type:Date,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avtar:{
        type:String
    }
}, {timestamps: true});

//creating the model based on the schema
const User = mongoose.model('User', userSchema)

module.exports = User;