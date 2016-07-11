const knex = require('./knex.js')

function Follows(){
  return knex('follows');
}

function getAllFollows() {
  return Follows().select();
}

function getFollows(userID) {
  return Follows().where('user_id', parseInt(userID));
}


module.exports = {
  getAllFollows: getAllFollows,
  getFollows: getFollows
};