
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('photos', function(table) {
      table.dropColumn('recipe_id');
    }),

    knex.schema.table('photos', function(table){
      table.integer('recipe_id')
          .references('id')
          .inTable('recipes')
          .onDelete('CASCADE');
    })  
  ])
};

exports.down = function(knex, Promise) {
  
};
