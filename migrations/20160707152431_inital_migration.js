exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
      table.string('email');
      table.string('blurb');
      table.string('user_photo');
    }),

    knex.schema.createTable('recipes', function(table) {
      table.increments('id').primary();
      table.string('ingredients');
      table.specificType('tags', 'text[]');
      table.specificType('instructions', 'text[]');
      table.integer('user_id')
        .references('id')
        .inTable('users');
      table.timestamps();
    }),

    knex.schema.createTable('likes', function(table) {
      table.increments('id').primary();
      table.integer('user_id')
        .references('id')
        .inTable('users');
      table.integer('recipe_id')
        .references('id')
        .inTable('recipes');
    }),

    knex.schema.createTable('favourites', function(table) {
      table.increments('id').primary();
      table.integer('user_id')
        .references('id')
        .inTable('users');
      table.integer('recipe_id')
        .references('id')
        .inTable('recipes');
    }),

    knex.schema.createTable('follows', function(table) {
      table.increments('id').primary();
      table.integer('user_id')
        .references('id')
        .inTable('users');
      table.integer('following_id');
    })
  ])  
};

exports.down = function(knex, Promise) {
  // knex.schema.dropTable('users'),
  // knex.schema.dropTable('recipes'),
  // knex.schema.dropTable('likes'),
  // knex.schema.dropTable('favourites'),
  // knex.schema.dropTable('follows')
};
