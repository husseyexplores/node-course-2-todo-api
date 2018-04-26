const mongoose = require('mongoose');

const User = mongoose.model('User', {
   user: {
      type: String,
      required: [true, 'Username can\'t be left empty.'],
      trim: true
   },
   email: {
      type: String,
      required: [true, 'Please enter a valid email address.'],
      minlength: [2, 'Email too short.'],
      trim: true
   }
});

module.exports = {User}