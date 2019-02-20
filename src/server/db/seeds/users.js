const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('password', salt)
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return Promise.join(
        knex('users').insert([
          {username: 'username', password: hash}
        ])
      );
    });
};
