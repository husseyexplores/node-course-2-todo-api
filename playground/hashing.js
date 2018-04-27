const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc'

// bcrypt.genSalt(10, (err, salt) => {
//    bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash)
//    })
// })

var hpwd = '$2a$10$NvXofNRIp4rt9af1GRfa9OR79PeNZNRAL4GKx6BbCdNP9wClHXOSa';

bcrypt.compare(password, hpwd, (err, res) => {
   if (err) return console.log(err);
   console.log(res);
})


// const data = {
//    id: 10 
// };


// const token = jwt.sign(data, '123abc');
// console.log('ENCODED: ', token);

// const decoded = jwt.verify(token, '123abc');
// console.log('DECODED: ', decoded);


// const message = 'I am user number 3'

// const hash = SHA256(message).toString();

// console.log(hash);

// const data = {
//    id: 4
// };

// const token = {
//    data,
//    hash: SHA256(JSON.stringify(data) + 'someSecret').toString()
// };

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resHash = SHA256(JSON.stringify(token.data) + 'someSecret').toString();

// if (resHash === token.hash) {
//    console.log('Data was not changed!')
// } else {
//    console.log('Data was changed.')
// }