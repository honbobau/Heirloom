
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('recipes', function(table) {
      table.string('description');
    }),
  ])
};

exports.down = function(knex, Promise) {
  
};
