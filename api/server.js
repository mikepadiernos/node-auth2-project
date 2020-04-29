const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');

const middle = require('./middleware/middleware.js');

const logger = middle.logger;

const server = express();

server
	.use(
		helmet(),
		logger,
		express.json(),
		cors(),
	);

const users = require('./routers/users-router.js');

server.use('/api/users', users);
server.use('/users', users);

server
	.route('/')
	.get((req, res) => {
		res.send(`AH! BUCKLE THIS! Ludicrous speed, GO!`);
	});

module.exports = server;
