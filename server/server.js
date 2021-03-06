require('./config/config');
const { configENV } = require('./config/config');

const _ = require('lodash');
const express = require('express');
const { json } = require('body-parser');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose');    // Same as => const mongoose = require('./db/mongoose').mongoose
const { Todo } = require('./models/todo');       // Same as => const Todo = require('./models/todo').Todo
const { User } = require('./models/user');       // Same as => const User = require('./models/user').User
const { authenticate } = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT;

app.use(json());

app.post('/todos', authenticate, (req, res) => {

   var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
   });
   
   todo.save()
      .then((doc) => {
         res.send(doc);
      }, (e) => {
         res.status(400)
            .send(e);
      });
});

app.get('/todos', authenticate, (req, res) => {
   Todo.find({ _creator: req.user._id })
      .then((todos) => {
         res.json({todos});
      }, (e) => {
         res.status(400)
            .json(e);
      });
});

app.get('/todos/:id', authenticate, (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findOne({
      _id: id,
      _creator: req.user._id
   })
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

app.delete('/todos/:id', authenticate, async (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   try {
      const todo = await Todo.findOneAndRemove({
         _id: id,
         _creator: req.user._id
      });

      if(!todo){
         res.status(404).send();
      }

      res.json({todo})
   } catch (e) {
      res.status(400).send();
   }

   // Todo.findOneAndRemove({
   //    _id: id,
   //    _creator: req.user._id
   // })
   //    .then((todo) => {
   //       if(!todo){
   //          res.status(404).send();
   //       }
   //       res.json({todo})
   //    })
   //    .catch((e) => {
   //       res.status(400).send(); 
   //    });
});

app.patch('/todos/:id', authenticate, async (req, res) => {
   const id = req.params.id;
   const body = _.pick(req.body, ['text', 'completed']);
   
   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
   } else {
      body.completed = false;
      body.completedAt = null;
   }

   try {
     const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, { new: true});
     if(!todo) return res.status(404).send();
     res.json({todo});
   } catch (e) {
      res.status(400).send();
   }
      // Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, { new: true}).then((todo) => {
      //    if(!todo) return res.status(404).send();
      //    res.json({todo});
      // })
      // .catch((e) => {
      //    res.status(400).send();
      // });
});

// USERS ROUTES

app.post('/users', async (req, res) => {
   try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
   } catch (e) {
      res.status(400).send(e);
   }

   // user.save()
   //    .then(() => {
   //       return user.generateAuthToken();
   //    })
   //    .then((token) => {
   //       res.header('x-auth', token)
   //          .send(user);
   //    })
   //    .catch((e) => {
   //       res.status(400)
   //          .send(e);
   //    });
});

app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
})

app.post('/users/login', async (req, res) => {

   // ===***=== My Own Method ===***=== 
   // const email = req.body.email;
   // const password = req.body.password;
   // User.findOne({email: email })
   //    .then((user) => {
   //       if (!user) return res.status(404).send('No user found');
         
   //       bcrypt.compare(password, user.password, (err, compRes) => {
   //          if (!compRes || err) return res.status(404).send('Bad Password');

   //          if (compRes) return res.json({user});
   //       });

   //    })
   //    .catch((e) => res.status(404).send());

   try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = await   User.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
   } catch (e) {
      res.status(400).send(e)
   }

   // const body = _.pick(req.body, ['email', 'password']);
   // User.findByCredentials(body.email, body.password)
   //    .then((user) => {
   //       if(!user) return res.status(404).send('User not found')
   //       // res.json({user})
   //       return user.generateAuthToken()
   //          .then((token) => {
   //             res.header('x-auth', token)
   //                .send(user);
   //          });
   //    })
   //    .catch((e) => {
   //       res.status(400)
   //          .send(e)
   //    })
});

app.delete('/users/me/token', authenticate, async (req, res) => {
   try {
      await req.user.removeToken(req.token) 
      res.status(200).send('Token Deleted');  
   } catch (e) {
      res.status(400).send('Token NOT Deleted');
   }

   // req.user.removeToken(req.token)
   // .then(() => {
   //    res.status(200).send('Token Deleted');
   // }, () => {
      
   // });
})

app.listen(PORT, () => {
   console.log(`Todo REST API Server Started in *${configENV}* environment on port ${PORT}.`);
});

module.exports = { app };