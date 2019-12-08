require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/userModel');
const Collection = require('../models/collectionModel');

module.exports = (app) => {

	app.post('/api/user/order',
		passport.authenticate('jwt', {session: false}), (req, res) => {
			User.findByIdAndUpdate(req.user.id, {collOrder: req.body.order}, err =>
				err
					? res.json({message: 'Error updating collection order', success: false})
					: res.json({message: 'Successfully updated collection order', success: true})
			);
		});


	app.post('/api/user/login',
		(req, res, next) => {
			passport.authenticate('login', (err, user, info) => {
				if (err) {
					return res.json({
						message: 'Auth error. Please'
							+ ' report here: https://github.com/tggir1/astrostore/issues',
						success: false
					});
				}
				if (!user) {return res.json({message: info.message, success: false});}
				req.logIn(user, () => {

					User.findOne({username: req.body.username}).then((user) => {

						const token = jwt.sign({
							sub: user.id,
							exp: Math.floor(Date.now() / 1000) + (3600 * 168 * 12)
						}, process.env.SECRET);

						return res.json({success: true, token: token});

					});
				});
			})(req, res, next);
		});


	app.post('/api/user/updatePassword',
		passport.authenticate('jwt', {session: false}),
		(req, res) => {
			bcrypt.compare(req.body.currentPass, req.user.password).then(match => {
				if (match === false) {
					res.send({message: 'Passwords must match', success: false});
				} else {
					bcrypt.hash(req.body.newPass, 12, (err, hash) => {
						if (err) {
							res.send({
								message: 'Error saving new password. Password not updated.',
								success: false
							});
						} else {
							User.findByIdAndUpdate(req.user.id, {password: hash}, err =>
								err
									? res.send({
										message: 'Database error. Password not updated.',
										success: false
									})
									: res.send({
										message: 'Update successful!',
										success: true
									})
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
					res.send({
						message: 'Error updating username',
						success: false
					});
				} else if (user) {
					res.send({
						message: 'Username not available',
						success: false
					});
				} else {
					User.findByIdAndUpdate(req.user.id,
						{username: req.body.newName}, (err, user) => {
							err
								? res.send({
									message: 'Error updating username',
									success: false
								})
								: res.send({
									message: 'Update successful!',
									success: true
								});
						}
					);
				}
			});
		}
	);


	app.post('/api/user/register',
		(req, res) => {
			User.findOne({username: req.body.username}, (err, user) => {
				if (err) {
					res.send({
						message: 'Error adding user to database. Please try again.',
						success: false
					});
				} else if (user) {
					res.send({
						message: 'Username not available',
						success: false
					});
				} else {
					bcrypt.hash(req.body.password, 12)
						.then(hash => {
							User.create({
								username: req.body.username,
								password: hash
							}, (err, user) => {
								if (err) {
									res.send({
										message: 'error creating user',
										success: false
									});
								} else {
									req.logIn(user, () => {
										User.findOne({username: user.username}).then(user => {
											const token = jwt.sign({
												sub: user.id,
												exp: Math.floor(Date.now() / 1000) + (3600 * 168 * 12)
											}, process.env.SECRET);
											Collection.create({
												owner: user.id,
												title: 'Unsorted'
											}, err =>
												err
													? res.send({
														message: 'user created, please continue to log in form',
														success: false
													})
													: res.send({
														success: true,
														token: token
													})
											);
										});
									});
								}
							});
						})
						.catch(err => res.send({
							message: 'Error saving password. Please try again',
							success: false
						}));
				}
			});
		}
	);


};