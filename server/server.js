const express = require('express');
const app = express();
const cors = require('cors')            //cors need not be used during production but is needed during development on browsers
const mongoose = require('mongoose')
const User = require('./models/users')
const Coordinates =  require('./models/coordinates')
const bcrypt = require('bcrypt');
const UserVerification = require('./models/UserVerification');
const PasswordReset = require('./models/PasswordReset')
const Otpverification = require('./models/OTPVerificationSchema')
const Complaints = require('./models/complaints')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const path = require("path");
const { error } = require('console');

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/Water_supply')


// nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: 'projectwatersupply@gmail.com',
      pass: 'jtxa jcbs ytgb dpql',
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

let ID;
//signup
app.post("/api/register", async (req, res) => {
  ID = uuidv4().slice(0,7);
  let { name, email, password, role, add } = req.body;
  if (name === "" || password === "" || email === "" || add === "" ) {
      return res.json({
          status: "FAILED",
          message: "Empty credentials supplied!"
      });
  } else if (!/^[a-zA-Z0-9@!_$]*$/.test(name)) {
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
                let newUser;
                if (role == "Customer"){
                    newUser = new User({
                        ID,
                        name,
                        email,
                        password: hashedPassword,
                        role,
                        verified: false,
                        add,
                        houseAlloted:false,
                    });
                }
                else{
                    newUser = new User({
                        ID,
                        name,
                        email,
                        password: hashedPassword,
                        role,
                        verified: false,
                    });
                }
                newUser
                    .save()
                    .then(result => {

                        // handle acc verification
                        // sendVerificationEmail(result, res);
                        sendOTP(result,res);
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


//sending otp email

const sendOTP = async ({ _id , email}, res) =>{
    try{
        const Otp = `${Math.floor(1000 + Math.random() * 9000)}`

        // mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your account",
            html: `<p>Verify your account by using <b>${Otp}</b> to complete the signup and login into your account</p>
            <p>This otp <b>expires in 1 hours</b>.</p>`,
        };
        const newOtpverification = new Otpverification({
            email : email,
            otp : Otp,
            createdat : Date.now(),
            expiresat : Date.now() + 21600000
        });
        newOtpverification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status : "PENDING",
            message : "OTP has been sent to your email",
            data : {
                email,
            },
        });
    }
    catch(error) {
        console.log(error)
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};

// verify said otp 
app.post("/verifyotp" , async (req,res)=>{
    try{
        let { email , otp} = req.body;
        if (!email || !otp){
            throw Error("Empty otp details are not allowed");
        } else {
            const otpverificationrecord = await Otpverification.find({
                email,
            });
            if(otpverificationrecord.length <= 0){
                throw new Error(
                    "Account has already been verified or doesn't exist. Please signup again or login!"
                );
            } else {
                // record exists 
                const { expiresat } = otpverificationrecord[0];
                const hashedotp = otpverificationrecord[0].otp;
                if( expiresat < Date.now() ){
                    //expired 
                    await Otpverification.deleteMany({ email });
                    throw new Error("the code has expired , please request again!");
                } else {
                    if(!(otp == hashedotp)) {
                        //otp is wrong 
                        throw new Error("Invalid otp, please try again!(check inbox)");
                    } else {
                        //Matching otp
                        await User.updateOne({ email : email}, {verified : true});
                        const deleteddocs = await Otpverification.deleteMany({ email });
                        console.log(deleteddocs)
                        res.json({
                            status : "SUCCESS",
                            message : "Your account has been verified successfully!",
                        });
                    }
                }
            }
        }
    } catch(error){
        console.log(error);
        res.json({
            status : "FAILED",
            message : error.message,
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
                          status: "SUCCESS",
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
                      ID = data.ID
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

//password reset

app.post("/requestPasswordReset", (req,res)=>{
    const {email} = req.body;
    User
    .find({email})
    .then((data)=>{
        if(data.length){
            //user exists

            

            if(!data[0]['verified']){
                res.json({
                    status: "FAILED",
                    message: "Email has not been verified!"
                }); 
            } else{
                //continue wiht email reset-pass

                sendResetEmail(data[0],res);
            }
        } else{
            console.log(error);
            res.json({
                status: "FAILED",
                message: "No account with the supplied email exists!"
            });
        }
    })
    .catch(error =>{
        console.log(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while checking for existing user"
    });
});
});


// sending password reset mail

const sendResetEmail = ({email},res) =>{
let resetString = uuidv4();
resetString = resetString.slice(0,6)

PasswordReset
.deleteMany({email : email})
.then(result => {
    //reset record deleted
    //sending the email
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Reset your password",
        html: `<p>To reset your password , use the token below</p>
        <p>This token <b>expires in 1 hour</b>.</p>
        <p> <b> ${resetString} </b>is your token</p>`,
    };

        //password reset collection
        const newPasswordReset = new PasswordReset({
            email : email,
            resetString : resetString,
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
                    status : "SUCCESS",
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
.catch(error => {
    res.json({
        status: "FAILED",
        message: "Cleaing exisiting passsowrd reset record failed"
    });
})
}

//actaully reset the password
app.post("/resetPassword",(req,res)=>{
let {email , resetString , newPassword} = req.body;

let role;

User.findOne({ email }).exec().then(data => {
    // console.log(data);
    role = data['role']
  });  

PasswordReset
.find({email})
.then(result =>{
    // console.log(result);
    if(result.length > 0){
        //pass record exists

        const {expiredAT} = result[0];
        const hashedResetString = result[0].resetString;
        if(expiredAT < Date.now()){
            PasswordReset.deleteOne({email})
            .then(() => {
                res.json({
                    status: "FAILED",
                    message: "password reset link has expired"
                });
            })
            .catch(error => {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "Cleaing passsword reset record failed"
                });
            })
        } else{
            return new Promise((resolve, reject) => {
                if (resetString == hashedResetString) {
                    resolve();  // Successful match
                } else {
                    reject("Incorrect reset string details passed");
                }
            })
            .then(() => {
                // console.log(result);
                if(result.length > 0){
                    // hashing new password
                    const saltrounds = 10;
                    bcrypt
                    .hash(newPassword,saltrounds)
                    .then(hashednewPassword => {
                        // update the user password
                        User
                        .updateOne({email : email},{password: hashednewPassword})
                        .then(() =>{
                            //update complete 
                            //deling the password reset record
                            PasswordReset.deleteOne({email})
                            .then(() => {
                                //both the records updated 
                                res.json({
                                    status: "SUCCESS",
                                    message: "Pasword has been reset successfully",
                                    role:role
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                res.json({
                                    status: "FAILED",
                                    message: "An error occured while finalizing pass reset"
                                });
                            })
                        })
                        .catch(error => {
                            console.log(error);
                            res.json({
                                status: "FAILED",
                                message: "Updating user record with new password failed"
                            });
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        res.json({
                            status: "FAILED",
                            message: "Hashing the passowrd failed (error)"
                        });
                    })
                } else{
                    console.log(result); 
                    console.log(error);
                    res.json({
                        status: "FAILED",
                        message: "Incorrect reset string details passed"
                    });
                }
            })
            .catch(error => {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: error
                });
            });
        }
    } else{
        res.json({
            status: "FAILED",
            message: "Password reset request not found"
        });
    }
})
.catch(error => {
    console.log(error);
    res.json({
        status: "FAILED",
        message: "Checking for exsisting password reset string failed"
    });
})
})

app.post("/api/map",async(req,res) =>{
    const del = await Coordinates.deleteOne({
        "_id":"6560b0c0c0a53e4fadc0d420"
    })
    const coord = await Coordinates.create({
        "_id":"6560b0c0c0a53e4fadc0d420",
        coordinates:req.body.coordinates,
        housecoords:req.body.housecoords,
        junctions:req.body.junctioncoords,
        waterReservoirCoords:req.body.waterReservoirCoords,
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
        return res.json({coordinates:coord.coordinates,housecoords:coord.housecoords,junctions:coord.junctions,waterReservoirCoords:coord.waterReservoirCoords})
    }
    else{
        return res.json({status:'error coords not imported'})
    }
})

  app.post("/api/mapCust/:ID",async(req,res) => {
    console.log("Submitted")
    console.log(ID)
    const {description} = req.body;
    if (description==""){
        res.json({
            status:"FAILED",
            message:"Please describe your problem"
        })
    }else{
    const complaints = await Complaints.create({
        ID:ID,
        // HouseID:req.body.HouseID,
        description:req.body.description,
        datecomplained:Date.now(),
        dateresolved:Date.now()+100000,
    })
    res.json({
        status:"SUCCESS",
        message:"Complaint submitted successfully"
    })
    }
  })

  app.listen(5000, () => {
      console.log("Server started on port 5000");
  })

