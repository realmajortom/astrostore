require('dotenv').config();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const limiter = require('./auth/rateLimiter');

const app = express();
const API_PORT = process.env.API_PORT || 8080;
app.use(express.static(path.join(__dirname, 'client')));

app.use(helmet());

// CORS middlewarez
app.options('*', cors());

const whitelist = ['https://astrostore.io', 'https://round-fusion-247201.appspot.com'];

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin !== -1) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST']
};

app.use(cors(corsOptions));

// more middlewarez
app.use(logger('short'));
app.use(bodyParser.json());
app.use(passport.initialize());


// connect to mongodb
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to database'));
db.on('error', console.error.bind(console, 'Database connection error'));


// limiters
app.use('/api/user/register', limiter.regOp);
app.use('/api/user/login', limiter.loginOp);
app.use('/api/collection', limiter.collectionOp);
app.use('/api/boomark', limiter.bookmarkOp);


// api routes
require('./auth/auth');
require('./routes/userRoutes')(app);
require('./routes/dataRoutes')(app);


// catch-all
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
});

app.listen(API_PORT, () => console.log('Patiently listening for gentle whispers in the wind'));

module.exports = app;