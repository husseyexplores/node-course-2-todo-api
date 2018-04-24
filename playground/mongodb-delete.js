const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) return console.log('Oops! Unable to connect to the MongoDB Server.');

    const db = database.db('TodosApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((res) => {
    //     console.log(res);
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((res) => {
    //     console.log(res);
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
    //     console.log(res)
    // })

    // delete by ID
    var id = '5adf63a9cd6555b0ae3f47d1';
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID(id)
    }).then((res) => {
        if(res.value !== null) return console.log(`Successfully delete user with an ID ${id}`);
        console.log(`Can't find any user with an ID ${id}`)
    }).catch((err) => {
            console.log(`ERROR occured while delete user with an ID of ${id} \n\n ${err}`)
    });

    // delete many Mikes'
    db.collection('Users').deleteMany({name: 'Mike'}).then((res) => {
        if(res.result.n !== 0) {
            return console.log('User Mike Deleted!');
        }
        console.log('No user with name Mike exist.')
    }).catch((err) => {
        console.log(`ERROR occured while deleting user(s) Mikes' \n\n ${err}`)
    });
        
    // database.close();
});