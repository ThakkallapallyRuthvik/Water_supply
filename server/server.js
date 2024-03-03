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
const Reports = require('./models/Reports')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const path = require("path");
const { error } = require('console');
const cron = require('node-cron');
const moment = require('moment');

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/Water_supply')

//automate water supply timing at 3:00 PM
cron.schedule('00 18 * * *', async () => {
    console.log('Running scheduled task...');
    try {
        // Fetch all users from the database
        const users = await User.find({ role: 'Customer', houseAlloted: { $exists: true, $ne: null }});
        const Hquantity = await Coordinates.updateMany({'housecoords': { $elemMatch: { 'Hquantity': { $exists: true } } }},{$set:{'housecoords.$[element].Hquantity':5}},
        { arrayFilters: [{ 'element.Hquantity': { $exists: true } }] })
        // console.log(Hquantity)
        // console.log(thfrffe ${users});
        // console.log(${users.length} for creating reports.)
        // Create a new report for each user
        const reportsArray = [];
        for (const user of users) {
            const newReport = {
                CANID: user.houseAlloted,
                USERID: user.ID,
                suppliedAt: moment().format('MM/DD/YYYY'),  
                expiresAt: moment().add(1, 'day').format('MM/DD/YYYY'),
                waterquantitysupplied:5,
            };
            reportsArray.push(newReport);
        }
        // console.log(reportsArray)
        await Reports.create({
            suppliedat: moment().format('MM/DD/YYYY'),
            reports:reportsArray,
        })
        console.log('New reports added successfully.');
    } catch (error) {
        console.error('Error adding new reports:', error);
    }
});

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
  let { name, email, password, confirmpassword , role, add } = req.body;
  if (name === "" || password === "" || confirmpassword ==="" || email === "" || add === "" ) {
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
        }else if(password!=confirmpassword){
            return res.json({
                status:"FAILED",
                message:"Passwords do not match"
            })
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
                        houseAlloted:"None",
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
                        // console.log(deleteddocs)
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
const userdoc = await User.findOne({email:email})

if (!email || !password) {
    return res.json({
        status: "FAILED",
        message: "Empty credentials supplied!",
    });
} else {
    if(userdoc){
        // console.log(userdoc)
        const houseAlloted = userdoc.houseAlloted
        if(houseAlloted=="None"){
            return res.json({
                status:"FAILED",
                message:"You have not been allocated a house, please try again later!"
            })
        }
    }
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
                            const mailOptions = {
                                from: process.env.AUTH_EMAIL,
                                to: email,
                                subject: "Password Reset Successful",
                                html: `<p>Your password has been reset successfully!</p>
                                <p>You can proceed to login</p>`,
                            };
                            transporter
                            .sendMail(mailOptions)
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
        waterTreatmentplantCoords:req.body.treatmentplantCoords
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
        return res.json({coordinates:coord.coordinates,housecoords:coord.housecoords,junctions:coord.junctions,waterReservoirCoords:coord.waterReservoirCoords,waterTreatmentplantCoords:coord.waterTreatmentplantCoords})
    }
    else{
        return res.json({status:'error coords not imported'})
    }
})

app.post("/api/eligibleusers", async (req, res) => {
    try {
        const eligibleUsers = await User.find({ role: 'Customer', houseAllotted: null });
        // console.log(eligibleUsers)
        res.json(eligibleUsers);
    } catch (error) {
        console.error('Error fetching eligible users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/saveupdateddata", async (req, res) => {
    try {
        const updatedUserData = req.body.updatedUserData;

        // Ensure that updatedUserData is an array
        if (!Array.isArray(updatedUserData)) {
            return res.status(400).json({ error: 'Invalid input format' });
        }

        for (const userData of updatedUserData) {
            const { name, houseAlloted } = userData;

            // Check if name and houseAlloted are present
            if (!name || houseAlloted === undefined) {
                continue; // Skip this iteration if data is incomplete
            }

            // Use async/await to wait for the update operation to complete
            await User.updateOne({ name }, { $set: { houseAlloted } });
        }

        res.json({ status: 'SUCCESS', message: 'User data updated successfully' });
    } catch (error) {
        console.error('Error saving updated user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/houseAllotedEmail",async(req,res) => {
    const { HouseID, UserID } = req.body;
    // console.log(HouseID,UserID)
    const userdoc = await User
    .findOne({ID:UserID})
    .catch((error) => {
        console.log(error);
        res.json({
            status: "FAILED",
            message: "Failed to send email",
        });
    });
    // console.log(userdoc)
    if (!userdoc) {
        return res.json({
          status: "FAILED",
          message: "User not found",
        });
      }
    if(userdoc){
        const userEmail = userdoc.email;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: userEmail,
            subject: "House Alloted",
            html: `<p>User: ${UserID} </p>
            <p>Your house has been alloted to <b>${HouseID}</b></p>
            <p>You can proceed to login</p>`,
        };
        transporter
        .sendMail(mailOptions)
        .then(() => {
            // email sent and verification record saved
            res.json({
                status: "SUCCESS",
                message: "House Alloted successfully",
            });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: "FAILED",
                message: "Failed to send email",
            });
        });
    } 

    
})

app.post("/api/mapDept/viewComplaints",async(req,res) => {
    const viewComplaints = await Complaints.find({status:'Active'})
    // console.log(viewComplaints)
    res.json(viewComplaints)
  })

  app.post("/api/mapDept/resolveComplaints",async(req,res) => {
    const {id} = req.body;
    // console.log(description.slice(0,16),'abc')
    // console.log(description.slice(17,18),'abc')
    const complaint = await Complaints.findOne({ID:id,status:'Active'})
    const description = complaint.description
    if(description.slice(0,16)=="Need extra water"){
        console.log(description.slice(17, 18))
        const incrementValue = parseInt(description.slice(17, 18))
        console.log(id)
        const Report = await Reports.findOne({'reports.USERID':id})
        console.log(Report,Report.waterquantitysupplied)
        const newHQuantity = Report.waterquantitysupplied + parseInt(description.slice(17, 18))
        console.log(newHQuantity)
        await Coordinates.updateOne({'housecoords.userid':id},
            {$set: {'$housecoords.$.Hquantity':10}})
        await Reports.updateOne({'reports.USERID':id},{$inc:{'$reports.$.waterquantitysupplied':incrementValue}})
    }
    const inputDateString = Date.now();
    const inputDate = new Date(inputDateString);
    const formattedDateString = inputDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
    });
    await Complaints.updateOne({ID:id,status:"Active"},{$set:{status:"Resolved",dateresolved:formattedDateString}})
    await Coordinates.updateOne({'housecoords.userid':id},{$set:{'housecoords.$.waterSupplied':true}})
    return res.json({status:'SUCCESS',message:'Complaint resolved!'})
  })

  app.post("/api/getID",async(req,res) => {
    return res.json({ID:ID})
  })

  app.post("/api/mapCust/:ID",async(req,res) => {
    // console.log(ID)
    const {description} = req.body;
    const existingComplaint = await Complaints.find({ID:ID,status:"Active"})
    const inputDateString = Date.now();
    const inputDate = new Date(inputDateString);
    const formattedDateString = inputDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
    });
    if (description==""){
        res.json({
            status:"FAILED",
            message:"Please describe your problem"
        })
    }else if(existingComplaint.length>0){
        res.json({
            status:"FAILED",
            message:"You have already raised a complaint, please wait until it is resolved and then complaint again"
        })
    }else{
    const complaints = await Complaints.create({
        ID:ID,
        // HouseID:req.body.HouseID,
        description:req.body.description,
        status:"Active",
        datecomplained:formattedDateString,
        // dateresolved:Date.now(),
    })
    await Coordinates.updateOne({'housecoords.userid':ID},{$set:{'housecoords.$.waterSupplied':false}})
    res.json({
        status:"SUCCESS",
        message:"Complaint submitted successfully",
    })
    }
  })

  app.post("/api/getreports",async(req,res)=>{
    const calendar = req.body.calendar
    try {
        const allreports = await Reports.find({"reports.suppliedAt":calendar});
        // console.log(allreports)
        res.json(allreports)
    } catch(error){
        console.error("Error fetching reports",error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/api/sendreports', async (req, res) => {
    const rep = await Reports.create({
        reports:req.body.reportsarray,
    })
    if(rep){
        return res.json({status:'reports saved'})
    }
    else{
        return res.json({status:'reports not saved'})
    }
  });
  
  app.listen(5000, () => {
      console.log("Server started on port 5000");
  })

