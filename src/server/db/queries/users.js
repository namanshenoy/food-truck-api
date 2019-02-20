const knex = require('../connection');
const bcrypt = require('bcryptjs');

function addUser (user) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  return knex('users')
    .insert({
      username: user.username,
      password: hash
    })
    .returning('*')
}

function getUser (username) {
  return knex('users')
  .select('*')
  .where({ username });
}

function updateUser (username, data) {
  if (data.username) {
    delete data['username'];
  }
  return knex('users')
    .where({ username })
    .update({ data })
}

function deleteUser (username) {
  return knex('users')
    .where({ username })
    .del()
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser
};