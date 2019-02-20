
exports.up = function(knex, Promise) {
  return knex.schema.createTable('food_trucks', (table) => {
    table.increments();
    table.string('name').unique().notNullable();
    table.string('price').notNullable();
    table.string('email').notNullable();
    table.string('website').notNullable();
    table.string('phone').notNullable();
    table.boolean('is_closed');
    table.string('image_url');
    table.string('coordinate_lat');
    table.string('coordinate_lon');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('food_trucks');
};
