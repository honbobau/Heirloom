
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('photos', function(table) {
      table.increments('id').primary();
      table.string('filepath');
      table.integer('recipe_id')
          .references('id')
          .inTable('recipes');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('photos'),
  ]);
};

