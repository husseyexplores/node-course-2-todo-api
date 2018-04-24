const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) return console.log('Oops! Unable to connect to the MongoDB Server.');

    const db = database.db('TodosApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5adf1617190199032048322d')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch the todos', err)
    // })

    db.collection('Users').find({name: 'Hussey'}).toArray().then((count) => {
        console.log('User: ', count);
    }, (err) => {
        console.log('Unable to fetch the users', err)
    })

    // database.close();
});