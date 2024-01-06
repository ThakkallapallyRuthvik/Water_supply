const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema({
    email: String,
    resetString: String,
    createdAT: Date,
    expiredAT: Date,
});

const PasswordReset = mongoose.model('PasswordReset',PasswordResetSchema);

module.exports = PasswordReset;