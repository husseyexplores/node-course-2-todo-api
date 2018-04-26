const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
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
         res.send(doc);
      }, (e) => {
         res.status(400)
            .send(e);
      });
});

app.get('/todos', (req, res) => {
   Todo.find()
      .then((todos) => {
         res.json({todos});
      }, (e) => {
         res.status(400)
            .json(e);
      });
});

app.get('/todos/:id', (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      res.status(404).send("Invalid ID");
   }

   Todo.findById(id)
      .then((todo) => {
         if(!todo){
            res.status(404).send();
         }
         res.json(todo)
      })
      .catch((e) => {
         res.status(400).send("ERROR :("); 
      });
});

app.listen(PORT, () => {
   console.log(`Todo REST API Server Started on port ${PORT}.`);
})

module.exports = {app};