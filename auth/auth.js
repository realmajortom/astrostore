require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/userModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

passport.use('login',
  new LocalStrategy(
    {session: false},
    (username, password, done) => {
      User.findOne({username: username}, (err, user) => {
        if (err) {return done(err);}
        if (!user) {
          return done(null, false, {message: 'Invalid username'});
        }
        bcrypt.compare(password, user.password).then(response => {
          if (response !== true) {
            return done(null, false, {message: 'Incorrect password'});
          } else {
            return done(null, user);
          }
        });
      });
    }
  )
);


const opts = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT')
};

passport.use('jwt',
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.sub, (err, user) => {
      if (err) {
        done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  })
);