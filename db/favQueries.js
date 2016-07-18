const knex = require('./knex.js')

function Favs(){
  return knex('favourites');
};

function getAllFavs() {
  return Favs().select();
};

function getFavs(userID) {
  return Favs().where('user_id', parseInt(userID));
};

function add(userID, recipeID) {
  return Favs().insert({user_id: userID, recipe_id: recipeID})
};

function deleteID(favID) {
  return Favs().where('id', parseInt(favID)).del();
}

function idCheck(userID, recipeID) {
  return knex.raw(`select * from favourites where user_id = ${userID} AND recipe_id = ${recipeID}`)
}

module.exports = {
  getAllFavs: getAllFavs,
  getFavs: getFavs,
  add: add,
  deleteID: deleteID,
  idCheck: idCheck
};