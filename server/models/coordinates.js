const mongoose = require('mongoose')

const coordinates = new mongoose.Schema(
    {
        coordinates : {type:Array,required:true},
        // housecoords : {type:Array,required:true},
        housecoords : [{
            CANID : { type: String, required: true },
            userid : {type:String},
            hcoords : { type: Object },
            waterSupplied : {type: Boolean },
            assignedJunction : { type: String },
        }],
        // junctions : {type:Array,required:true},
        junctions :[{
            JID : {type: String, required:true},
            jcoords :{type:Object},
            houses :{type:Array},
            waterSupplied :{type:Boolean},
        }],
        waterReservoirCoords : {type:Array , required:true},
    },
    {collection:'coordinatesDB'}
)

const model = mongoose.model('MapCoordinates', coordinates)

module.exports = model