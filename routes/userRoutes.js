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
          if (err) {return res.status(400).json({message: 'Auth error. Please'
                                                       + ' report here: https://github.com/tggir1/astrostore/issues'})}
          if (!user) {return res.status(400).json({message: info.message})}
          req.logIn(user, () => {
            User.findOne({username: req.body.username}).then((user) => {
              const token = jwt.sign({
                sub: user.id,
                exp: Math.floor(Date.now() / 1000) + (3600 * 168)
              }, process.env.SECRET);
              return res.status(200).json({
                success: true,
                token: token
              });
            });
          });
        })(req, res, next);
      });

  app.post('/api/user/updatePassword',
      passport.authenticate('jwt', {session: false}),
      (req, res) => {
        bcrypt.compare(req.body.currentPass, req.user.password).then(match => {
          if (match === false) {
            res.status(401).send({message: 'Passwords must match', success: false})
          } else {
            bcrypt.hash(req.body.newPass, 12, (err, hash) => {
              if (err) {
                res.status(400).send({message: 'Error saving new password. Password not updated.', success: false})
              } else {
                User.findByIdAndUpdate(req.user.id, {password: hash}, err =>
                    err
                        ? res.status(400).send({message: 'Database error. Password not updated.', success: false})
                        : res.status(200).send({message: 'Update successful!', success: true})
                );
              }
            });
          }
        });
      }
  );

  app.post('/api/user/updateName',
      passport.authenticate('jwt', {session: false}), (req, res) => {
  	    User.findOne({username: req.body.newName}, (err, user) => {
  	    	if (err) {
  	    		res.status(400).send({message: 'Error updating username', success: false});
	        } else if (user) {
  	    		res.send({message: 'Username not available', success: false});
	        } else {
		        User.findByIdAndUpdate(req.user.id,
			        {username: req.body.newName}, (err, user) => {
				        err
				        ? res.status(400)
				             .send({
					             message: 'Error updating username',
					             success: false
				             })
				        : res.status(200)
				             .send({
					             message: 'Update successful!',
					             success: true
				             })
			        }
		        );
	        }
        })
      }
  );

  app.post('/api/user/register',
      (req, res) => {
        User.findOne({username: req.body.username}, (err, user) => {
          if (err) {
            res.status(400).send({message: 'Error adding user to database. Please try again.', success: false})
          } else if (user) {
            res.status(400).send({message: 'Username not available', success: false});
          } else {
            bcrypt.hash(req.body.password, 12).then(hash => {
              User.create({
                username: req.body.username,
                password: hash
              }, (err, user) => {
                if (err) {
                  res.status(400).send({message: 'error creating user', success: false});
                } else {
                  req.logIn(user, () => {
                    User.findOne({username: user.username}).then(user => {
                      const token = jwt.sign({
                        sub: user.id,
                        exp: Math.floor(Date.now() / 1000) + (3600 * 168)
                      }, process.env.SECRET);
                      Collection.create({
                            owner: user.id,
                            title: 'Unsorted'
                          }, err =>
                              err
                                  ? res.status(400).send({message: 'user created, please continue to log in form', success: false})
                                  : res.status(200).send({success: true, token: token})
                      );
                    });
                  });
                }
              });
            }).catch(err => res.status(400).send({message: 'Error saving password. Please try again', success: false}));
          }
        });
      }
  );


};