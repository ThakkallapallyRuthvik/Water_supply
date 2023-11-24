const mongoose =  require('mongoose')

const User = new mongoose.Schema(
    {
        name:{type:String,required:true,unique:true},
        email:{type:String,required:true,unique:true},
        pass:{type:String,required:true},
    },
        {collection:'user-data'}
)

const model = mongoose.model('DataOfUsers',User)

module.exports = model

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       minlength: 8,
//       maxlength: 16,
//       match: /^[a-zA-Z0-9_-]+$/,
//     },
//     pass: {
//       type: String,
//       required: true,
//       minlength: 8,
//       validate: {
//         validator: function (value) {
//           return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value);
//         },
//         message: 'Password does not meet the requirements.',
//       },
//     },
//   },
//   { collection: 'user-data' }
// );

// const User = mongoose.model('DataOfUsers', userSchema);

// // Example usage
// const newUser = new User({
//   name: 'exampleUser',
//   pass: 'InvalidPassword123!',
// });

// newUser.save((error) => {
//   if (error) {
//     console.error('Error saving user:', error.message);
//   } else {
//     console.log('User saved successfully.');
//   }
//   mongoose.disconnect();
// });

// const model = mongoose.model('DataofUsers',userSchema)
// module.exports = model