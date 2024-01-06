const mongoose = require('mongoose')

const coordinates = new mongoose.Schema(
    {
        coordinates:{type:Array,required:true},
        housecoords:{type:Array,required:true},
        junctions:{type:Array,required:true}
    },
    {collection:'coordinatesDB'}
)

const model = mongoose.model('MapCoordinates', coordinates)

module.exports = model