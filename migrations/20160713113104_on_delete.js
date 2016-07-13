
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('recipes', function(table) {
      table.dropColumn('user_id');
    }),

    knex.schema.table('favourites', function(table) {
      table.dropColumn('user_id');
      table.dropColumn('recipe_id');
    }),

    knex.schema.table('likes', function(table) {
      table.dropColumn('user_id');
      table.dropColumn('recipe_id');
    }),

    knex.schema.table('follows', function(table) {
      table.dropColumn('user_id');
      table.dropColumn('following_id');
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
