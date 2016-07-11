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

function getSingle(recID) {
  return Recipes().where('id', parseInt(recID))
}




module.exports = {
  getAllRec: getAllRec,
  getRec: getRec,
  getSingle: getSingle
};