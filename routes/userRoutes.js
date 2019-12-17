const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/userModel');
const Collection = require('../models/collectionModel');

require('../security/auth');
router.use(passport.initialize());


router.post('/order',
	passport.authenticate('jwt', {session: false}), (req, res) => {
		User.findByIdAndUpdate(req.user.id, {collOrder: req.body.order}, err =>
			err
				? res.json({message: 'Error updating collection order', success: false})
				: res.json({message: 'Successfully updated collection order', success: true})
		);
	});


router.post('/login', (req, res) => {

	User.findOne({username: req.body.username}, (err, user) => {

		if (err) {
			res.json({message: 'Auth error', success: false});

		} else if (!user) {
			res.json({message: 'User not found', success: false});

		} else {

			bcrypt.compare(req.body.password, user.password, (err, response) => {
				if (err) {
					res.json({message: 'An error occurred during authentication.', success: false});

				} else if (response === false) {
					res.json({message: 'Incorrect password', success: false});

				} else {

					const token = jwt.sign({
						sub: user._id,
					}, process.env.SECRET, {expiresIn: '90d'});

					res.json({token: token, success: true});
				}
			});
		}
	});

});


router.post('/updatePassword', passport.authenticate('jwt', {session: false}), (req, res) => {
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


router.post('/updateName', passport.authenticate('jwt', {session: false}), (req, res) => {
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
				User.findByIdAndUpdate(req.user.id, {username: req.body.newName}, (err, user) => {
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


router.post('/register', (req, res) => {
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
				bcrypt.hash(req.body.password, 12).then(hash => {
						User.create({username: req.body.username, password: hash}, (err, user) => {
							if (err) {
								res.send({
									message: 'error creating user',
									success: false
								});
							} else {
									User.findOne({username: user.username}).then(user => {

										const token = jwt.sign({
											sub: user.id,
										}, process.env.SECRET, {expiresIn: '90d'});

										Collection.create({owner: user.id, title: 'Unsorted'}, err =>
											err
												? res.send({
													message: 'User created, please proceed to log in form',
													success: false
												})
												: res.send({
													success: true,
													token: token
												})
										);
									});
							}
						});
					}).catch(err => res.send({
						message: 'Error saving password. Please try again',
						success: false
					}));
			}
		});
	}
);

module.exports = router;