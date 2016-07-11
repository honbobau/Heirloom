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


module.exports = {
  getAllLikes: getAllLikes,
  getLikes: getLikes
};