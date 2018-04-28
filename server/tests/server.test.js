const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {User} = require('../models/user');
const {Todo} = require('../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
   it('should create a new todo', (done) => {
      var text = 'Test todo text';

      request(app)
         .post('/todos')
         .send({text})
         .expect(200)
         .expect((res) => {
            expect(res.body.text).toBe(text);
         })
         .end((err, res) => {
            if (err) return done(err);

            Todo.find({text})
               .then((todos) => {
                  expect(todos.length).toBe(1);
                  expect(todos[0].text).toBe(text);
                  done();
               })
               .catch((e) => done(e));    // Statement syntax instead of Expression syntax
         });
   });

   it('should not create todo with invalid body data', (done) => {

      request(app)
         .post('/todos')
         .send({})
         .expect(400)
         .end((err, res) => {
            if (err) return done(err);

            Todo.find()
               .then((todos) => {
                  expect(todos.length).toBe(2);
                  done();
               })
               .catch((e) => done(e));    // Statement syntax
         })
   });
});

describe('/GET todos', () => {
   it('should get all todos', (done) => {
      request(app)
         .get('/todos')
         .expect(200)
         .expect((res) => {
            expect(res.body.todos.length).toBe(2);
         })
         .end(done);
   })
})

describe('GET /todos/:id', () => {
   it('should return todo doc', (done) => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
         })
         .end(done);
   });

   it('should return 404 if todo not found', (done) => {
      // make sure you get 404
      var hexID = new ObjectID().toHexString();

      request(app)
         .get(`/todos/${hexID}`)
         .expect(404)
         .end(done);
   });

   it('should return 404 for Invalid ID', (done) => {
      // should get 404
      request(app)
         .get(`/todos/123`)
         .expect(404)
         .end(done);
   });
})

describe('/DELETE /todos/:id', () => {
   it('should delete the doc by ID', (done) => {

      const delHexID = todos[1]._id.toHexString();

      request(app)
         .delete(`/todos/${delHexID}`)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo._id).toBe(delHexID);
         })
         .end((err, res) => {
            if (err) return done(err);
            
            Todo.findById(delHexID)
               .then((todo) => {
                  expect(todo).toBeFalsy();
                  done();
               })
               .catch((e) => done(e));
         });
   })

   it('should return 404 if todo not found', (done) => {
      var hexID = new ObjectID().toHexString();

      request(app)
         .delete(`/todos/${hexID}`)
         .expect(404)
         .end(done);
   });

   it('should return 404 if id is invalid', (done) => {

      request(app)
         .delete(`/todos/123bc`)
         .expect(404)
         .end(done);
   });
});

describe('PATCH /todos/:id', () => {
   // change text and change completed to true
   it('should update the todo ', (done) => {
      const text = 'First test todo PATCH Test';
      const id = todos[0]._id.toHexString();
      
      request(app)
         .patch(`/todos/${id}`)
         .send({
            completed: true,
            text: text
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
         })
         .end(done)
   });

   it('should clear completedAt when todo is not completed', (done) => {
      const text = 'Second test todo PATCH Test';
      const id = todos[1]._id.toHexString();
      
      request(app)
         .patch(`/todos/${id}`)
         .send({
            completed: false,
            text: text
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
         })
         .end(done)
   });
 
});

describe('GET /users/me', () => {
   it('should return user if authenticated', (done) => {
      request(app)
         .get('/users/me')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
         })
         .end(done);
   });

   it('should return 401 if not authenticated', (done) => {
      request(app)
         .get('/users/me')
         .expect(401)
         .expect((res) => {
            expect(res.body).toEqual({});
         })
         .end(done);
   });
});

describe('POST /users', () => {
   it('should create a new user', (done) => {
      const email = 'test@example.com';
      const password = 'testPassword';

      request(app)
         .post('/users')
         .send({email, password})
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body.email).toBe(email);
            expect(res.body._id).toBeTruthy();
         })
         .end((err) => {
            if (err) return done(err);

            User.findOne({email})
               .then((user) => {
                  expect(user).toBeTruthy();
                  expect(user.password).not.toBe(password);
                  done();
               })
               .catch((e) => done(e));
         })
   });

   it('should return validation error if request invalid', (done) => {
      const email = 'testexample.com';
      const password = 'testPassword';
      
      request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done)
   });

   it('should not create a user if email in use', (done) => {
      const email = users[0].email; // Referencing Seed data email
      const password = 'testPassword';
      
      request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done)
   });
});

describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
      request(app)
         .post('/users/login')
         .send({email: users[1].email, password: users[1].password})
         .expect(200)
         .expect((res) => {
            expect(res.header['x-auth']).toBeTruthy();
         })
         .end((err, res) => {
            if (err) return done(err);

            User.findById(users[1]._id)
               .then((user) => {
                  expect(user.tokens[0]).toHaveProperty('access', 'auth');
                  expect(user.tokens[0]).toHaveProperty('token', res.header['x-auth']);
                  done();
               })
               .catch((e) => done(e));
            
         })
   });

   it('should reject login with invalid credentials', (done) => {
      request(app)
         .post('/users/login')
         .send({email: users[1].email, password: 'someWrongPw'})
         .expect(400)
         .expect((res) => {
            expect(res.header['x-auth']).toBeFalsy();
         })
         .end((err, res) => {
            if (err) return done(err);

            User.findById(users[1]._id)
               .then((user) => {
                  expect(user.tokens.length).toBe(0);
                  done();
               })
               .catch((e) => done(e));
         })
   });
});

describe('DELETE /users/me/token', () => { 
   it('should remove auth token on logout', (done) => {

      request(app)
         .delete('/users/me/token')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .end((err, res) => {
            if (err) return done(err);

            // User.findByToken(users[0].tokens[0].token)
            //    .then((user) => {
            //       expect(user).toBeFalsy()
            //    })
            User.findById(users[0]._id)
               .then((user) => {
                  expect(user.tokens.length).toBe(0);
                  done();
               })
               .catch((e) => done(e));
         });   
   });
});