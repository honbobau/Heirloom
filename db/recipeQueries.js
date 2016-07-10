const knex = require('./knex.js')

function Recipes(){
  return knex('recipes');
}

function getAllRec() {
  return Recipes().select();
}

function getRec(userID) {
  return Recipes().where('user_id', parseInt(userID));
}




module.exports = {
  getAllRec: getAllRec,
  getRec: getRec
};