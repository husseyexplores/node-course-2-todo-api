//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); // Same as above
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server.');
    }
    console.log('Connected to MongoDB Server.');

    // const db = database.db('TodosApp');
    // db.collection('Todos');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo.', err)
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //const db = database.db('TodosApp');

    // db.collection('Users').insertOne({
    //     name: 'Hussey',
    //     age: 22,
    //     location: 'Lahore'
    // }, (err, result) => {
    //     if(err) return console.log('Unable to insert the user.', err);

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    database.close();
});