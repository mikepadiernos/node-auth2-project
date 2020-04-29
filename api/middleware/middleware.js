
const jwt = require('jsonwebtoken');
const secrets = require('../secrets/users-secret.js');

const logger = (req, res, next) => {
	const method = req.method;
	const endpoint = req.originalUrl;
	const date = new Date();
	console.log(`A ${method} request to ${endpoint} initiated on ${date.toDateString()}`);
	next()
};

const restrict = (req, res, next) => {

	try {
		const token = req.headers.authorization;

		if (token) {
			jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
				if (error) {
					res.status(401).json({ You: "Can't Touch This!" });
				} else {
					req.decodedJwt = decodedToken;
					console.log(req.decodedJwt);
					next();
				}
			})
		} else {
			throw new Error("Dark Helmet: Absolutely nothing! Which is what you are about to become.");
		}
	}
	catch (error) {
		res.status(401).json({ success: false, message: 'Content restricted. Please log in to access.' })
	}
}

const generator = function genToken(user) {
	const payload = {
		userid: user.id,
		username: user.username,
	};
	const options = { expiresIn: '1h' };
	const token = jwt.sign(payload, secrets.jwtSecret, options);

	return token;
}

module.exports = {
	logger,
	restrict,
	generator
};