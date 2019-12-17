require('dotenv').config();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const limiter = require('./security/rateLimiter');
const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

const PORT = process.env.PORT;


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, {useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to database'));
db.on('error', console.error.bind(console, 'Database connection error'));


app.set('trust proxy', true);

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


app.use('/api/user/register', limiter.regOp);
app.use('/api/user/login', limiter.loginOp);
app.use('/api/collection', limiter.collectionOp);
app.use('/api/bookmark', limiter.bookmarkOp);


app.use('/api/user', userRoutes);
app.use('/api', dataRoutes);


app.get('/*', function(req, res) {res.sendFile(path.join(__dirname, 'build', 'index.html'))});


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));