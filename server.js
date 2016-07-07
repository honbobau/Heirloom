var express = require('express');
var app = express();
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');

// new WebpackDevServer(webpack(config), {
//   hot: true,
//   historyApiFallback: true,
//   progress: true,
//   quiet: false,
//   host: '0.0.0.0',
//   stats: {
//     colors: true,
//     timings: true
//   }
// }).listen(8080, '0.0.0.0', function (err, result) {
//   if (err) {
//     console.log(err);
//   }

//   console.log('Building modules to serve at localhost:8080');
// });