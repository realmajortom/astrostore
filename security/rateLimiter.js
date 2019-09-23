const rateLimit = require('express-rate-limit');
const mongoStore = require('rate-limit-mongo');

// 10 registration/day/IP
const regOp = rateLimit({
  store: new mongoStore({
    uri: process.env.MONGO_URI,
    collectionName: 'reg_rate'
  }),
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  headers: false
});


// 20 logins/hr/IP
const loginOp = rateLimit({
  store: new mongoStore({
    uri: process.env.MONGO_URI,
    collectionName: 'login_rate'
  }),
  windowMs: 60 * 60 * 1000,
  max: 20,
  headers: false
});


// 500 collection ops/hr/IP
const collectionOp = rateLimit({
  store: new mongoStore({
    uri: process.env.MONGO_URI,
    collectionName: 'collection_rate'
  }),
  windowMS: 60 * 60 * 1000,
  max: 500,
  headers: false
});


// 500 bookmark ops/hr/IP
const bookmarkOp = rateLimit({
  store: new mongoStore({
    uri: process.env.MONGO_URI,
    collectionName: 'bookmark_rate'
  }),
  windowMs: 60 * 60 * 1000,
  max: 500,
  headers: false
});


module.exports.regOp = regOp;
module.exports.loginOp = loginOp;
module.exports.collectionOp = collectionOp;
module.exports.bookmarkOp = bookmarkOp;
