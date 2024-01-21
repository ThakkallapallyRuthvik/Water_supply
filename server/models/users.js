const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    ID:String,
    name: String,
    email: String,
    password: String,
    role:String,
    add:String,
    houseAlloted:String,
    verified : Boolean
});

const User = mongoose.model('User',UserSchema);

module.exports = User;

