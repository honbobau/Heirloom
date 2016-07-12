const knex = require('./knex.js')

function Recipes(){
  return knex('recipes');
}

function getAll() {
  return Recipes().select();
}

function getRec(userID) {
  return Recipes().where('user_id', parseInt(userID));
}

function getSingle(recID) {
  return Recipes().where('id', parseInt(recID))
}

function add(recipe) {
  return Recipes().insert(recipe, 'id');
}

function update(recipeID, updates) {
  return Recipe().where('id', parseInt(recipeID)).update(updates)
}

function deleteID(recipeID) {
  return Recipe().where('id', parseInt(recipeID)).del();
}

module.exports = {
  getAll: getAll,
  getRec: getRec,
  getSingle: getSingle,
  add: add,
  update: update,
  deleteID: deleteID
};