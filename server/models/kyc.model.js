const mongoose = require('mongoose');
const kycSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    fullName : {
        type : String,
        required : true
    },
    dob : {
        type : Date,
        required : true
    },
    gender : {
        type : String,
        enum : ['Male','Female','Other'],
        required : true
    },
    address : {
        type : String,
        required : true
    },
    pan : {
        type : String,
        required : true,
        unique : true
    },
    aadhar : {
        type : String,
        required : true,
        unique : true
    },
    city : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    bankName : {
        type : String,
        required : true
    },
    accountNo : {
        type : String,
        required : true,
        unique : true
    },
    ifsc : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['pending','verified','rejected'],
        default : 'Pending'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
},{timestamps : true});


module.exports = mongoose.model('Kyc',kycSchema);