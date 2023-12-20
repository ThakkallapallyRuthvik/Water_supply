const express = require('express');
const app = express();
const cors = require('cors')            //cors need not be used during production but is needed during development on browsers
const mongoose = require('mongoose')
const User = require('./models/users')
const Coordinates =  require('./models/coordinates')
const bcrypt = require('bcrypt');
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/Water_supply')

//signup
app.post("/api/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    // const { ID, email, password } = req.body;
  
    if (!name || !email || !pass ) {
      return res.json({
        status: "FAILED",
        message: "Empty input fields!",
      });
    }else if (!/^[a-zA-Z]*$/.test(name)) {
      return res.json({
          status: "FAILED",
          message: "Invalid name entered"
      });
  } 
  else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
      return res.json({
          status: "FAILED",
          message: "Invalid email entered"
      });
  } 
  else if (typeof pass !== 'string' || pass.length <= 6 || pass.length >= 15) {
      // password validation
      return res.json({
          status: "FAILED",
          message: "Password is too short!"
        });
  }
  
    try {
      // Checking if user already exists
      const existingUser = await User.findOne({ email });

      // Checking if ID already exists
      const existingID = await User.findOne({ name });
      
      if(existingID) {
        return res.json({
          status : "FAILED",
          message : "This user-ID already exists , try another one",
        });
      }
      if (existingUser) {
        return res.json({
          status: "FAILED",
          message: "User with the provided email already exists",
        });
      }
  
      // Password hashing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(pass, saltRounds);
  
      // Creating a new user
      const newUser = await User.create({
        name,
        email,
        pass: hashedPassword
      });

      res.json({
        status: "SUCCESS",
        message: "Sign up successful",
        data: newUser,
      });
    } catch (error) {
      console.error("Error during user registration:", error);
  
      res.json({
        status: "FAILED",
        message: "An error occurred while processing the request",
      });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { name, pass } = req.body;
  
    try {
      if (!name || !pass) {
        return res.json({
          status: "FAILED",
          message: "Empty credentials supplied!",
        });
      }
  
      // Check if user exists
      const data = await User.find({ name });
  
      if (data.length) {
        // User exists
        const hashedPassword = data[0].pass;
        const passwordMatch = await bcrypt.compare(pass, hashedPassword);
  
        if (passwordMatch) {
          // Password match
          return res.json({
            status: "SUCCESS",
            message: "Sign in successful!",
            data: data,
          });
        } else {
          return res.json({
            status: "FAILED",
            message: "Invalid password entered!",
          });
        }
      } else {
        return res.json({
          status: "FAILED",
          message: "Invalid credentials entered",
        });
      }
    } catch (error) {
      console.error("Error during user login:", error);
      return res.json({
        status: "FAILED",
        message: "An error occurred while processing the request",
      });
    }
  });
  
  app.post("/api/map",async(req,res) =>{
      const del = await Coordinates.deleteOne({
          "_id":"6560b0c0c0a53e4fadc0d420"
      })
      const coord = await Coordinates.create({
          "_id":"6560b0c0c0a53e4fadc0d420",
          coordinates:req.body.coordinates,
          housecoords:req.body.housecoords,
      })

      if(coord){
          return res.json({status:'coordinates saved'})
      }
      else{
          return res.json({status:'coordinates not saved'})
      }
  })

  app.post("/api/default",async(req,res) =>{
      const coord = await Coordinates.findOne();
      if(coord){
          return res.json({coordinates:coord.coordinates,housecoords:coord.housecoords})
      }
      else{
          return res.json({status:'error coords not imported'})
      }
  })

  app.listen(5000, () => {
      console.log("Server started on port 5000");
  })
