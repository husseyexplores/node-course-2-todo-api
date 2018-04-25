const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');    // Same as => const mongoose = require('./db/mongoose').mongoose
const {Todo} = require ('./models/todo');       // Same as => const Todo = require('./models/todo').Todo
const {User} = require ('./models/user');       // Same as => const User = require('./models/user').User

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
   var todo = new Todo({
      text: req.body.text
   });
   
   todo.save()
      .then((doc) => {
         res.json(doc);
      }, (e) => {
         res.status(400)
            .json(e);
      });
});

app.post('/users', (req, res) => {

});

app.listen(PORT, () => {
   console.log(`Todo REST API Server Started on port ${PORT}.`);
})

module.exports = {app};