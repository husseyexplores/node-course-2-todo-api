const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.removeToken = function (token) {
   var user = this;

   return user.update({
      $pull : {
         tokens: {
            token: token
         }
      }
   });
}

UserSchema.statics.findByToken = function (token) {
   var User = this;
   var decoded;

   try {
      decoded = jwt.verify(token, 'abc123');
   } catch (e) {
      return  Promise.reject();
   }

   return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
   });

}

UserSchema.statics.findByCredentials = function (email, password) {
   var User = this;
   var hashedPw;
   
   return User.findOne({email: email})
      .then((user) => {
         if (!user) return Promise.reject('User not found');
         
         return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, compRes) => {
               if (!compRes || err) return reject('Password Incorrect');
               
               if (compRes) {
                  resolve(User.findOne({email: email, password: user.password}))
               }
            });
         });
      });
}

UserSchema.pre('save', function(next) {
   var user = this;

   if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
         });
      });
   } else {
      next();
   }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User}