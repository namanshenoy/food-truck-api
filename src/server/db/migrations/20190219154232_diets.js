
exports.up = function(knex, Promise) {
  return knex.schema.createTable('diets', (table) => {
    table.increments();
    table.string('name').unique().notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('diets');
};
