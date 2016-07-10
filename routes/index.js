var express = require('express');
var router = express.Router();
const userQueries = require('../db/userQueries')
const recipeQueries = require('../db/recipeQueries')
const favQueries = require('../db/favQueries')
/* GET home page. */
router.get('/users', function (req, res, next) {
  userQueries.getAll()
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

router.get('/user/:id', function (req, res, next) {
  userQueries.getSingle(req.params.id)
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

router.get('/user/:user_id/recipes', function (req, res, next) {
  recipeQueries.getRec(req.params.user_id)
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

router.get('/user/:user_id/favourites', function (req, res, next) {
  favQueries.getFavs(req.params.user_id)
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

module.exports = router;
