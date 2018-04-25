const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
   text: {
      type: String,
      required: [true, 'What you actually want to do? Specify that!'],
      minlength: [2, 'Text too small! Write what you actually want to do in a proper way.'],
      trim: true
   },
   completed: {
      type: Boolean,
      default: false
   },
   completedAt: {
      type: Number,
      default: null
   }
});

module.exports = {Todo};
