// var pg = require('pg');
// var connectionString = require(path.join(__dirname, '../', '../', 'config'));
const express = require('express');
const route = express();
const queries = require('./queries')
const database  = require('./database/database');
const path = require('path');

route.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

route.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
// send users
});

route.get('/user/user_id/favourites', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

route.get('/recipe/:id', function (req, res) {
  res.send('Hello World!');
});

route.post('/user/user_id/favourites/:id', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

route.post('/user/user_id/recipe/:id', function (req, res) {
  res.send('Hello World!');
});

route.post('/user/user_id/follow/:id', function (req, res) {
  res.send('Hello World!');
});

route.post('/user/user_id/like/:id', function (req, res) {
  res.send('Hello World!');
});

route.post('/user/user_id/favourites/:id, function (req, res) {
  res.send('Hello World!');
});

route.post('/recipe/recipe_id/like/:id', function (req, res) {
  res.send('Hello World!');
});

route.post('/recipe/recipe_id/favourite/:id', function (req, res) {
  res.send('Hello World!');
});

