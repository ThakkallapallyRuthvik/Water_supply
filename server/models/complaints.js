const mongoose = require('mongoose')

const complaints = new mongoose.Schema(
    {
        // UserID:String,
        // HouseID:String,
        description:String,
        datecomplained:Date,
        dateresolved:Date,
    },
    {collection:"complaints"}
    )

const Complaints = mongoose.model('Complaints',complaints)

module.exports = Complaints