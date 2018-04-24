const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) return console.log('Oops! Unable to connect to the MongoDB Server.');

    const db = database.db('TodosApp');

    // Check the mongoDB docs for reference
    // const filterByID = {
    //     _id: new ObjectID('5adf32b2cd6555b0ae3f319f')
    // }
    // const valuesToUpdate = {
    //     $set: {
    //         completed: true
    //     }
    // }
    // const returnOptions = {
    //     returnOriginal: false 
    // }

    // db.collection('Todos').findOneAndUpdate(filterByID, valuesToUpdate, returnOptions).then((res) => {
    //     console.log(res);
    // });

    // Change user Jen to Hussey and increment age by 1
    const filterbyName = {
        name: 'Jen'
    }
    const valuesToUpdate = {
        $set: {
            name: 'Hussey'
        },
        $inc: {
            age: 1
        }
    }
    const returnOptions = {
        returnOriginal: false
    }

    db.collection('Users').findOneAndUpdate(filterbyName, valuesToUpdate, returnOptions).then((res) => {
        if(res.value !== null) return console.log('Successfully updated username Jen to Hussey and incremented age by 1');
        console.log('User Jen doesn\'t exist.')
    })

    // database.close();
});