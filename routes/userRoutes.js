require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/userModel');
const Collection = require('../models/collectionModel');

module.exports = (app) => {

  app.post('/api/user/login',
    (req, res, next) => {
      passport.authenticate('login', (err, user, info) => {
        if (err) {return res.json({error: err})};
        if (!user) {return res.json({message: info.message});};
        req.logIn(user, () => {
          User.findOne({username: req.body.username}).then((user) => {
            const token = jwt.sign({
              sub: user.id,
              exp: Math.floor(Date.now() / 1000) + (3600 * 168)
            }, process.env.SECRET);
            return res.json({
              success: true,
              message: 'user found & logged in',
              token: token
            });
          });
        });
      })(req, res, next);
    });

  app.post('/api/user/updatePassword',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      bcrypt.compare(req.body.currentPass, req.user.password).then(response => {
        if (response == false) {
          res.send({message: 'Error. Password not updated.', success: false})
        } else {
          bcrypt.hash(req.body.newPass, 12, (err, hash) => {
            if (err) {
              res.send({message: 'Error. Password not updated.', success: true})
            } else {
              User.findByIdAndUpdate(req.user.id, {password: hash}, err =>
                err
                  ? res.send({message: 'Error, Password not updated.', success: false})
                  : res.send({message: 'Update successful!', success: true})
              );
            };
          });
        };
      });
    }
  );

  app.post('/api/user/updateName',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      User.findByIdAndUpdate(req.user.id,
        {username: req.body.newName}, (err, user) => {
          if (err) {
            res.send({message: 'Error updating username', success: false});
          } else {
            res.send({message: 'Updated username!', success: true});
          };
        }
      );
    }
  );

  app.get('/api/user/logout',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      res.send({success: true});
    }
  );

  app.post('/api/user/register',
    (req, res) => {
      User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
          res.send({error: err})
        } else if (user) {
          res.send({message: 'username taken', success: false});
        } else {
          bcrypt.hash(req.body.password, 12).then(hash => {
            User.create({
              username: req.body.username,
              password: hash
            }, (err, user) => {
              if (err) {
                res.send({message: 'error creating user', success: false});
              } else {
                req.logIn(user, () => {
                  User.findOne({username: user.username}).then(user => {
                    const token = jwt.sign({
                      sub: user.id,
                      exp: Math.floor(Date.now() / 1000) + (3600 * 168)
                    }, process.env.SECRET);
                    Collection.create({
                      owner: user.id,
                      collectionTitle: 'Unsorted'
                    }, err =>
                        err
                          ? res.send({message: 'user created, please continue to log in form', success: false})
                          : res.send({success: true, token: token})
                    );
                  });
                });
              };
            });
          });
        };
      });
    });
};