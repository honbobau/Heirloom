
exports.up = function(knex, Promise) {
   return Promise.all([
    knex.schema.table('recipes', function(table){
      table.specificType('ingredients', 'text[]')
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
