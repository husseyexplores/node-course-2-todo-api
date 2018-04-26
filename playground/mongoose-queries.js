const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

//const id = '5ae172c54a2d7a2810761d2b1';

// if (!ObjectID.isValid(id)) return console.log('ID not Valid')

// Todo.find({
//    _id: id
// }).then((todos) => {
//    console.log('Todos', todos)
// });

// Todo.findOne({
//    _id: id
// }).then((todo) => {
//    console.log('Todo', todo)
// });

// Todo.findById(id).then((todo) => {
//    if (!todo) return console.log('ID not found')
//    console.log('Todo by ID', todo)
// }).catch((e) => console.log(e))

const userID = '5adfded4ce856f1960d7d7d9';
if (!ObjectID.isValid(userID)) return console.log('userID not Valid')
User.findById(userID)
   .then((user) => {
      if (!user) return console.log('userID not found')
      console.log('User found: ', user);
   })
   .catch((e) => console.log('User not found: ', e));