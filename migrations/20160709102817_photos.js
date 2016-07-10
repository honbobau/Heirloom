
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('recipes', function(table){
      table.specificType('photos', 'text[]')
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
