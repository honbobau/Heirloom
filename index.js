var express = require('express');
var app = express();
var database  = require('./database/database');
// var pg = require('pg');
// var connectionString = require(path.join(__dirname, '../', '../', 'config'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
