const { string } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const auctionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    productName: {
        type : String,
        required:true
    },
    productDescription: {
        type : String,
        required:true
    },
    productImage:{
        type:String,
        required: true
    },
    productPrice:{
        type:Number,
        required:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime:{
        type:String,
        default:"9:00 am"
    },
    endTime:{
        type:String,
        default:"10:00 pm"
    },
    status: {
        type : String,
        required:true
    },
    Bid: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("auction", auctionSchema);