const knex = require('./knex.js')

function Favs(){
  return knex('favourites');
}

function getAllFavs() {
  return Favs().select();
}

function getFavs(userID) {
  return Favs().where('user_id', parseInt(userID));
}


module.exports = {
  getAllFavs: getAllFavs,
  getFavs: getFavs
};