require('dotenv').config();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const limiter = require('./security/rateLimiter');

const app = express();

const PORT = process.env.PORT;


app.get('/_ah/warmup', (req, res) => {
	mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
	const db = mongoose.connection;
	db.once('open', () => console.log('Connected to database'));
	db.on('error', console.error.bind(console, 'Database connection error'));
});


app.enable('trust proxy');

app.use((req, res, next) => {
	if (req.secure) {
		next()
	} else {
		res.redirect('https://' + req.headers.host + req.url);
	}
});


app.use(express.static(path.join(__dirname, 'build')));


app.use(cors());
app.use(helmet());
app.use(logger('short'));
app.use(bodyParser.json());
app.use(passport.initialize());


app.use('/api/user/register', limiter.regOp);
app.use('/api/user/login', limiter.loginOp);
app.use('/api/collection', limiter.collectionOp);
app.use('/api/bookmark', limiter.bookmarkOp);


require('./security/auth');
require('./routes/userRoutes')(app);
require('./routes/dataRoutes')(app);


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));