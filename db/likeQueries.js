const knex = require('./knex.js')

function Likes(){
  return knex('likes');
}

function getAllLikes() {
  return Likes().select();
}

function getLikes(userID) {
  return Likes().where('user_id', parseInt(userID));
}

function add(userID, recipeID) {
  return Likes().insert({user_id: userID, recipe_id: recipeID})
}

function deleteID(likeID) {
  return Likes().where('id', parseInt(likeID)).del();
}

module.exports = {
  getAllLikes: getAllLikes,
  getLikes: getLikes,
  add: add,
  deleteID: deleteID
};