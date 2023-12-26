const express = require('express');
const app = express();
const cors = require('cors')            //cors need not be used during production but is needed during development on browsers
const mongoose = require('mongoose')
const User = require('./models/users')
const Coordinates =  require('./models/coordinates')
const bcrypt = require('bcrypt');
const UserVerification = require('./models/UserVerification');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const path = require("path");

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/Water_supply')


// nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: 'bunnygp8@gmail.com',
      pass: 'bhkr uyzz utgf vrla',
  }
});

// testing success
transporter.verify((error, success) => {
  if (error) {
      console.log(error);
  } else {
      console.log("Ready for message");
      console.log(success);
  }
});

//signup
app.post("/api/register", async (req, res) => {
  let { name, email, password, role } = req.body;
  if (name === "" || password === "" || email === "" ) {
      return res.json({
          status: "FAILED",
          message: "Empty input fields!"
      });
  } else if (!/^[a-zA-Z]*$/.test(name)) {
      return res.json({
          status: "FAILED",
          message: "Invalid name entered"
      });
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
      return res.json({
          status: "FAILED",
          message: "Invalid email entered"
      });
  }  else if (password.length < 6) {
      // password validation
      res.json({
          status: "FAILED",
          message: "Password is too short!"
      });
  }else if( role==''){
    res.json({
        status:"FAILED",
        message:"Select your role!"
    })
  }else {
    // Checking if user already exists
    User.findOne({ email }).then(result => {
        if (result) {
            // A user already exists
            return res.json({
                status: "FAILED",
                message: "User with the provided email already exists"
            });
        } else {
            // Try to create a new user

            // Password handling
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    verified: false,
                });
                newUser
                    .save()
                    .then(result => {
                        // res.json({
                        //     status: "SUCCESS",
                        //     message: "Sign up successful",
                        //     data: result
                        // });

                        // handle acc verification
                        sendVerificationEmail(result, res);
                    })
                    .catch(err => {
                      res.json({
                          status: "FAILED",
                          message: "An error occurred while saving user account"
                      });
                  });

          }).catch(err => {
              res.json({
                  status: "FAILED",
                  message: "An error occurred while hashing password"
              });
          });
      }
  }).catch(err => {
      console.log(err);
      res.json({
          status: "FAILED",
          message: "An error occurred while checking for an existing user"
      });
  });
}
});

// send verif email
const sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used in email
  const currentUrl = "http://localhost:5000/";

  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Verify your email address to complete the signup and login into your account</p>
      <p>This link <b>expires in 6 hours</b>.</p>
      <p>press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here</a>to proceed.</p>`,
  };

  // hashing unique string
  const saltRounds = 10;
  bcrypt
      .hash(uniqueString, saltRounds)
      .then((hashedUniqueString) => {
          // set values for user verification collection
          const newVerification = new UserVerification({
              userID: _id,
              uniqueString: hashedUniqueString,
              createdAT: Date.now(),
              expiredAT: Date.now() + 21600000,
          });
          newVerification
          .save()
          .then(() => {
              transporter
                  .sendMail(mailOptions)
                  .then(() => {
                      // email sent and verification record saved
                      res.json({
                          status: "PENDING",
                          message: "Verification email sent",
                      });
                  })
                  .catch((error) => {
                      console.log(error);
                      res.json({
                          status: "FAILED",
                          message: "Verification of email FAILED",
                      });
                  });
          })
          .catch((error) => {
              console.log(error);
              res.json({
                  status: "FAILED",
                  message: "An error occurred while saving verified email data!",
              });
          });
  })
  .catch((error) => {
      console.log(error);
      res.json({
          status: "FAILED",
          message: "An error occurred while hashing email data!",
      });
  });
};

app.get("/user/verify/:userID/:uniqueString", (req, res) => {
  let { userID, uniqueString } = req.params;

  UserVerification
      .find({ userID })
      .then((result) => {
          if (result.length > 0) {
              // user verificiation record exists

              const { expiredAT } = result[0];

              const hashedUniqueString = result[0].uniqueString;

              // checking for expiration
              if (expiredAT < Date.now()) {
                  // record expired
                  UserVerification
                      .deleteOne({ userID })
                      .then(result => {
                          User.deleteOne({ _id: userID })
                              .then(() => {
                                  let message = "Link expired please login again! ";
                                  res.redirect(`/user/verified/error=true&message=${message}`);
                              })
                              .catch(error => {
                                  let message = "Clearing user with required unique string failed";
                                  res.redirect(`/user/verified/error=true&message=${message}`);
                              })
                            })
                            .catch((error) => {
                              console.log(error);
                              let message = "An error occurred while clearing expired user verification record ";
                              res.redirect(`/user/verified/error=true&message=${message}`);
                          })
                  } else {
                      // valid record so we validate
  
                      bcrypt
                          .compare(uniqueString, hashedUniqueString)
                          .then((result) => {
                              if (result) {
                                  // matching
                                  User
                                      .updateOne({ _id: userID }, { verified: true })
                                      .then(() => {
                                          UserVerification
                                          .deleteOne({ userID })
                                          .then(() => {
                                              res.sendFile(path.join(__dirname, "./../server/views/verified.html"));
                                          })
                                          .catch(error => {
                                              let message = "An error occurred while finalizing successful verification ";
                                              res.redirect(`/user/verified/error=true&message=${message}`);
                                          })
                                  })
                                  .catch(error => {
                                    console.log(error);
                                    let message = "An error occurred while updating record to show verified as true ";
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                })
                        } else {
                            // existing record, but invalid details
                            let message = "Invalid verification details passed, please check your inbox ";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        }
                    })
                    .catch(error => {
                        let message = "An error occurred while comparing hashed strings ";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    })

            }
        } else {
            // no record, so error
            let message = "Account record doesn't exist or has been verified already. Please sign up or log in";
            res.redirect(`/user/verified/error=true&message=${message}`);
        }
    })
    .catch((error) => {
        console.log(error);
        let message = "An error occurred while checking for existing user verification record";
        res.redirect(`/user/verified/error=true&message=${message}`);
    });
});
  
// verified email route
app.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./../server/views/verified.html"));
  });
  


  app.post("/api/login", async (req, res) => {
    let {email, password} = req.body;
email = email.trim();
password = password.trim();

if (!email || !password) {
    return res.json({
        status: "FAILED",
        message: "Empty credentials supplied!",
    });
} else {
    // check if user exists
    User
    .findOne({email})
    .then(data => {
        // console.log(data);
        // console.log(data['name']);
        // console.log(data[0]);
        if (data['name']) {
            // User exists
           
            // check if user is verified 
            console.log();
            console.log(data.verified);
            console.log();
            console.log(data['verifed']);
            if(!data.verified){
                res.json({
                    status : "FAILED",
                    message : "Email has not been verified yet. check your inbox."
                })
            } else{
              const hashedPassword = data.password;
              bcrypt.compare(password, hashedPassword).then(result => {
                  if (result) {
                      // Password match
                      res.json({
                          status: "SUCCESS",
                          message: "Sign in successful!",
                          data: data
                      });
                  } else {
                      res.json({
                          status: "FAILED",
                          message: "Invalid password entered!"
                      });
                  }
              })
                  .catch(err => {
                      res.json({
                          status: "FAILED",
                          message: "An error occurred while comparing passwords!"
                      });
                  });
              }  
      } else {
          res.json({
              status: "FAILED",
              message: "Invalid credentials entered"
          });
      }
  })
  .catch(err => {
    // console.log(data);
    res.json({
        status: "FAILED",
        message: "An error occurred while checking for an existing user"
    });
});
}

  });
  

  const sendResetEmail = ({_id,email},redirectUrl,res) =>{
    const resetString = uuidv4 + _id;

    PasswordReset
    .deleteMany({userID : _id})
    .then(result => {
        //reset record deleted
        //sending the email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Reset your password",
            html: `<p>To reset your password , use the link below</p>
            <p>This link <b>expires in 1 hour</b>.</p>
            <p>press <a href=${redirectUrl +  _id + "/" + resetString}>here</a>to proceed.</p>`,
        };

        //hash the reset strng
        const saltRounds = 10;
        bcrypt
        .hash(resetString , saltRounds)
        .then(hashedResetString =>{
            //password reset collection
            const newPasswordReset = new PasswordReset({
                userID : _id,
                resetString : hashedResetString,
                createdAT : Date.now(),
                expiredAT : Date.now() + 3600000
            });
            newPasswordReset
            .save()
            .then(() =>{
                transporter
                .sendMail(mailOptions)
                .then(() => {
                    // reset email sent
                    res.json({
                        status : "PENDING",
                        message : "Password reset mail sent"
                    })
                })
                .catch(error => {
                    console.log(error);
                    res.json({
                        status: "FAILED",
                        message: "Password reset email failed!"
                    });
                })
            })
            .catch(error => {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "Could not save password reset data!"
                });
            })
        })
        .catch(error =>{
            console.log(error);
            res.json({
                status: "FAILED",
                message: "An error occurred while hashing password reset string"
            })
        })
    })
    .catch(error => {
        res.json({
            status: "FAILED",
            message: "Cleaing exisiting passsowrd reset record failed"
        });
    })
}

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

