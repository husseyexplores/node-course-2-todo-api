const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
   email: {
      type: String,
      required: [true, 'Please enter a valid email address.'],
      minlength: [2, 'Email too short.'],
      trim: true,
      unique: [true, 'Email already exists'],
      validate: {
         validator: validator.isEmail,
         message: '{VALUE} is not a valid email.'
      }
   },
   password: {
      type: String,
      minlength: [6, 'Password must be atleat 6 characters long.'],
   },
   tokens: [{
      access: {
         type: String,
         required: true
      },
      token: {
         type: String,
         required: true
      }
   }]
});

UserSchema.methods.toJSON = function () {
   var user = this;
   userObject = user.toObject();

   return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
   var user = this;
   var access = 'auth';
   var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

   user.tokens.push({access, token});
   
   return user.save()
      .then(() => {
         return token;
      })
}

const User = mongoose.model('User', UserSchema);

module.exports = {User}