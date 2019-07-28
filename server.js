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
const API_PORT = process.env.API_PORT;
app.use(express.static(path.join(__dirname, 'build')));


// middlewarez
app.use(cors());
app.use(helmet());
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
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(API_PORT, () => console.log(`Listening on port: ${API_PORT}`));

module.exports = app;