const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Removes all todos docs - No docs gets back as a result
// Todo.remove({}).then((result) => {
//    console.log(result);
// });

// Finds and removes and returns the removed doc
// Todo.findByIdAndRemove({
//    _id: "5ae184e7a025dc2d74d75b95"
// }).then((todo) => {
//    console.log(JSON.stringify(todo, undefined, 2))
// })

Todo.findByIdAndRemove('5ae184e7a025dc2d74d75b95').then((todo) => {
   console.log(JSON.stringify(todo, undefined, 2))
})