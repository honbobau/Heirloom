var express = require('express');
var app = express();
var database  = require('./database/database');
// var pg = require('pg');
// var connectionString = require(path.join(__dirname, '../', '../', 'config'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/test', function (req, res) {
  res.send(
    '<h1>File Upload Test</h1>' +
    '<form action="..." method="post" enctype="multipart/form-data">' +
    '<input type="file" name="imageUpload">' +
    '</form>'
    );
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
