exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('likes', function(table) {
      table.integer('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
      table.integer('recipe_id')
          .references('id')
          .inTable('recipes')
          .onDelete('CASCADE');
    }),

    knex.schema.table('favourites', function(table){
      table.integer('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
      table.integer('recipe_id')
          .references('id')
          .inTable('recipes')
          .onDelete('CASCADE');
    }),

    knex.schema.table('follows', function(table){
      table.integer('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
      table.integer('recipe_id')
          .references('id')
          .inTable('recipes')
          .onDelete('CASCADE');
    }),

    knex.schema.table('recipes', function(table){
      table.integer('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
