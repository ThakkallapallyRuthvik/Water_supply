const express = require('express');
const app = express();
const cors = require('cors')            //cors need not be used during production but is needed during development on browsers
const mongoose = require('mongoose')
const User = require('./models/users')
const Coordinates = require('./models/coordinates')
// const jwt = require('jsonwebtoken')``

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/Water_supply')

app.post("/api/register", async (req,res) => {
    console.log(req.body)
    try{
        const user = await User.create({
            name:req.body.name,
            email:req.body.email,
            pass:req.body.pass,
        })
        if(user){
            return res.json({status:'registered',user:true})
        }
    }
    catch(err){
        res.json({status:'error:username already exists',err:'Duplicate name'})
    }
})

app.post("/api/login", async (req,res) => {
    const user = await User.findOne({
            name:req.body.name,
            pass:req.body.pass,
        })
        if (user){
            return res.json({status:'login successful',user:true})
        }
        else{
            return res.json({status:'error:invalid login',user:false})
        }
})

app.post("/api/map",async(req,res) =>{
    const del = await Coordinates.deleteOne({
        "_id":"6560b0c0c0a53e4fadc0d420"
    })
    const coord = await Coordinates.create({
        "_id":"6560b0c0c0a53e4fadc0d420",
        coordinates:req.body.coordinates
    })

    if(coord){
        return res.json({status:'coordinates saved'})
    }
    else{
        return res.json({status:'coordinates not saved'})
    }
})

app.post("/api/import",async(req,res) =>{
    const coord = await Coordinates.findOne();
    if(coord){
        return res.json(coord.coordinates)
    }
    else{
        return res.json({status:'error coords not imported'})
    }
})

app.listen(5000, () => {
    console.log("Server started on port 5000");
})