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

function add(userID, followingID) {
  return Follows().insert({user_id: userID, following_id: followingID})
}


module.exports = {
  getAllFollows: getAllFollows,
  getFollows: getFollows,
  add: add
};