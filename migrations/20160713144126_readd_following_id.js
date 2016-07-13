
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('follows', function(table) {
      table.dropColumn('recipe_id');
    }),

    knex.schema.table('follows', function(table){
      table.integer('following_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
    }),  
  ])
};

exports.down = function(knex, Promise) {
  
};
