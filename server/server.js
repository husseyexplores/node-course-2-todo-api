require('./config/config');
const configENV = require('./config/config').configENV;

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');    // Same as => const mongoose = require('./db/mongoose').mongoose
const {Todo} = require ('./models/todo');       // Same as => const Todo = require('./models/todo').Todo
const {User} = require ('./models/user');       // Same as => const User = require('./models/user').User
const {authenticate} = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT;

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
      return res.status(404).send();
   }

   Todo.findById(id)
      .then((todo) => {
         if(!todo){
            res.status(404).send();
         }
         res.json({todo})
      })
      .catch((e) => {
         res.status(400).send(); 
      });
});

app.delete('/todos/:id', (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findByIdAndRemove(id)
      .then((todo) => {
         if(!todo){
            res.status(404).send();
         }
         res.json({todo})
      })
      .catch((e) => {
         res.status(400).send(); 
      });
});

app.patch('/todos/:id', (req, res) => {
   const id = req.params.id;

   var body = _.pick(req.body, ['text', 'completed']);
   
   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
   } else {
      body.completed = false;
      body.completedAt = null;
   }

   Todo.findByIdAndUpdate(id, {$set: body}, { new: true})
      .then((todo) => {
         if(!todo) return res.status(404).send();

         res.json({todo});
      })
      .catch((e) => {
         res.status(400).send();
      });
});

// USERS ROUTES

app.post('/users', (req, res) => {

   var body = _.pick(req.body, ['email', 'password']);
   const user = new User(body);

  // User.findByToken        // User Model Method
  // user.generateAuthToken  // user instance method

   user.save()
      .then(() => {
         return user.generateAuthToken();
      })
      .then((token) => {
         res.header('x-auth', token).send(user);
      })
      .catch((e) => {
         res.status(400)
            .send(e);
      });
});

app.get('/users/me', authenticate,(req, res) => {
   res.send(req.user);
})

app.listen(PORT, () => {
   console.log(`Todo REST API Server Started in *${configENV}* environment on port ${PORT}.`);
})

module.exports = {app};