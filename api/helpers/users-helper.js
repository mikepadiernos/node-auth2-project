const db = require('../../data/db-config.js');

async function addUser(user) {
	const [id] = await db("users")
		.insert(user);
	return findUserById(id);
}

function findUser() {
	return db("users")
		.select("id", "username", "password");
}

function findUserBy(filter) {
	return db("users")
		.where(filter);
}

function findUserById(id) {
	return db("users")
		.where({ id })
		.first();
}

module
	.exports = {
		addUser,
		findUser,
		findUserBy,
		findUserById,
	};