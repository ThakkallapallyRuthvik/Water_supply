const mongoose = require('mongoose')

const complaints = new mongoose.Schema(
    {
        ID:String,
        // HouseID:String,
        description:String,
        status:String,
        datecomplained:String,
        dateresolved:String,
    },
    {collection:"complaints"}
    )

const Complaints = mongoose.model('Complaints',complaints)

module.exports = Complaints