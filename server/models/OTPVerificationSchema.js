const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpverificationSchema = new Schema({
    email:String,
    otp : String,
    createdat : Date,
    expiresat : Date

});


const Otpverification = mongoose.model('Otpverification',OtpverificationSchema);

module.exports = Otpverification;