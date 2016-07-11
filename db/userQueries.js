const knex = require('./knex.js')

function Users(){
  return knex('users');
}

function getAll() {
  return Users().select();
}

function getSingle(userID) {
  return Users().where('id', parseInt(userID)).first();
}

function add(user) {
  return Users().insert(user, 'id');
}

module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  add: add
};