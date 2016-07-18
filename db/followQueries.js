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
  return Follows().insert({user_id: parseInt(userID), following_id: parseInt(followingID)})
}

function deleteID(followID) {
  return Follows().where('id', parseInt(followID)).del();
}


module.exports = {
  getAllFollows: getAllFollows,
  getFollows: getFollows,
  add: add,
  deleteID: deleteID
};