const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secrets = require('../secrets/users-secret.js');

const db = require("../helpers/users-helper.js");
const middle = require('../middleware/middleware.js');

const generate = middle.generator;
const restricted = middle.restrict;

router
	.route('/')
	.get(restricted, (req, res) => {
		console.log("Yes? ", restricted);
		db.findUser()
			.then(users => {
				res.json(users);
			})
			.catch(error => {
				res.status(500).json({ success: false, message: "Unable to find users", error });
			});
	});

router
	.route('/register')
	.post((req, res) => {
		const user = req.body;

		user.password = bcrypt.hashSync(user.password, 8);

		db.addUser(user)
			.then(user => {
				const token = generate(user);
				res.status(201).json({ success: true, user, token });
			})
			.catch(error => {
				res.status(500).json({ success: false, message: "Problem with registration", error });
			});
	});

router
	.route('/login')
	.post((req, res) => {
		const { username, password } = req.body;

		db.findUserBy({ username })
			.first()
			.then(user => {
				if (user && bcrypt.compareSync(password, user.password)) {
					const token = generate(user);
					res.status(200).json({ success: true, message: `Welcome ${user.username}!`, token: token });
				} else {
					 res.status(401).json({ success: false, message: 'Good. Well, why don\'t we take a five minute break?' });
				}
			})
			.catch(error => {
				res.status(500).json({success: false, message: "Problem with login attempt", error});
			});
});

module.exports = router;