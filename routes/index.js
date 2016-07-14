const express         = require('express');
const router          = express.Router();
const path            = require('path');
const cors            = require('cors')
const fs              = require('fs')
const userQueries     = require('../db/userQueries')
const recipeQueries   = require('../db/recipeQueries')
const favQueries      = require('../db/favQueries')
const likeQueries     = require('../db/likeQueries')
const followQueries   = require('../db/followQueries')
const photoQueries    = require('../db/photoQueries')
const config          = require('./config');
const jwt             = require('jsonwebtoken')

// Generate token upon successful login
router.post('/login', function(req, res){
  userQueries.getOne(req.body.username)
  .then(function(user){
    user = user[0]
    if (!user) {
      res.json({success: false, message: "Authentication failed. Username not found."})
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: "Authentication failed. Incorrect password."})
      } else {
        var cert = config.secret
        var token = jwt.sign(user, 'superSecret', {
          expiresIn: '24h'
        });
        res.json({
          success: true,
          message: 'Enjoy',
          token: token
        });
      }
    }
  });
});

// Check for token
router.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'superSecret', function(err, decoded){
      if (err) {
        return res.json({ success: false, message: 'Failed to Authenticate'})
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// Get all users
router.get('/users', function(req, res, next) {
  userQueries.getAll()
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

// Get all recipes
router.get('/recipes', function(req, res, next){
  recipeQueries.getAll()
  .then(function(recipes){
    res.status(200).json(recipes);
  })
  .catch(function(error){
    next(error);
  });
});


// Get single user
router.get('/user/:id', function (req, res, next) {
  userQueries.getSingle(req.params.id)
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});


// Get recipes associated to user_id
router.get('/user/:user_id/recipes', function (req, res, next) {
  recipeQueries.getRec(req.params.user_id)
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

// Get a single recipe
router.get('/recipes/:id', function (req, res, next) {
  recipeQueries.getSingle(req.params.id)
  .then(function(recipes){
    res.status(200).json(recipes);
  })
  .catch(function(error){
    next(error);
  });
});

// Get photos associated to a recipe
router.get('/recipes/:recipe_id/photos', function(req, res, next){
  photoQueries.getPhotos(req.params.recipe_id)
  .then(function(photos){
    res.json(photos);
  })
  .catch(function(error){
    res.status(500).send(error);
  })
})

// Get likes associated to a user_id
router.get('/user/:user_id/likes', function (req, res, next) {
  likeQueries.getLikes(req.params.user_id)
  .then(function(users){
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});

// Get favourites associated to a user_id
router.get('/user/:user_id/favourites', function (req, res, next) {
  favQueries.getFavs(req.params.user_id)
  .then(function(favs){
    result = []
    dbResponse = 0
    total = favs.length
    favs.forEach(function(recipeID) { 
      recipeQueries.getSingle(recipeID.recipe_id)
      .then(function(recipe){
        result.push(recipe)
        dbResponse++
        if (dbResponse == total) {
        res.status(200).json(result);    
        }
      })
    })
  })
  .catch(function(error){
    next(error);
  });
});

// Get followers associated to a user_id
router.get('/user/:user_id/follows', function (req, res, next) {
  followQueries.getFollows(req.params.user_id)
  .then(function(following){
    result = []
    dbResponse = 0
    total = following.length
    following.forEach(function(followID) { 
      userQueries.getSingle(followID.following_id)
      .then(function(user){
        result.push(user)
        dbResponse++
        if (dbResponse == total) {
        res.status(200).json(result);    
        }
      })
    })
  })
});

// See README.md for proper form format when submitting post requests
router.post('/users', function(req, res, next){
  userQueries.add(req.body)
  .then(function(userID){
    return userQueries.getSingle(userID);
  })
  .then(function(users){
    res.status(200).json(users)
  })
  .catch(function(error){
    next(error);
  });
});

// Add recipes
router.post('/recipes', function (req, res, next){
  recipeQueries.add(req.body)
  .then(function(recipeID){
    return recipeQueries.getSingle(recipeID);
  })
  .then(function(recipes){
    res.status(200).json(recipes)
  })
  .catch(function(error){
    next(error);
  });
});


// Add favourites
router.post('/user/:user_id/recipe/:recipe_id/favourites', function(req, res, next){
  favQueries.add(req.params.user_id, req.params.recipe_id)
  .then(function(favourites){
    res.status(200).json()
  })
  .catch(function(error){
    next(error);
  })
})


// Add likes
router.post('/user/:user_id/recipe/:recipe_id/likes', function(req, res, next){
  likeQueries.add(req.params.user_id, req.params.recipe_id)
  .then(function(likes){
    res.status(200).json()
  })
  .catch(function(error){
    next(error)
  });
});

// Add follows
router.post('/user/:user_id/followUser/:following_id/follows', function(req, res, next){
  followQueries.add(req.params.user_id, req.params.following_id)
  .then(function(follows){
    res.status(200).json()
  })
  .catch(function(error){
    next(error)
  });
});

// Add photos via formidable
router.post('/recipes/photos', function(req, res){
  photoQueries.add(req.body)
  .then(function(){
    return photoQueries.getPhotos(req.params.recipe_id)
  })
  .then(function(photo){
    res.status(200).json(photo);
  });
});

// Edit user account details
router.put('/user/:id', function(req, res, next){
  userQueries.update(req.params.id, req.body)
  .then(function(){
    return userQueries.getSingle(req.params.id);
  })
  .then(function(user) {
    res.status(200).json(user);
  })
  .catch(function(error){
    next(error);
  });
});


//Edit recipe
router.put('/recipe/:id', function(req, res, next){
  recipeQueries.update(req.params.id, req.body)
  .then(function(){
    return queries.getSingle(req.params.id);
  })
  .then(function(user) {
    res.status(200).json(user);
  })
  .catch(function(error){
    next(error);
  });
});

// Delete recipe
router.delete('/recipe/:id', function(req, res, next){
  recipeQueries.deleteID(req.params.id)
  .then(function(){
    res.status(200).json();
  })
  .catch(function(error){
    next(error);
  });
});


// Delete user
router.delete('/user/:id', function(req, res, next){
  userQueries.deleteID(req.params.id)
  .then(function(){
    res.status(200).json();
  })
  .catch(function(error){
    next(error);
  });
});

// Delete favourites
router.delete('/favourites/:id', function(req, res, next){
  favQueries.deleteID(req.params.id)
  .then(function(){
    res.status(200).json();
  })
  .catch(function(error){
    next(error);
  });
});


// Delete likes
router.delete('/likes/:id', function(req, res, next){
  likeQueries.deleteID(req.params.id)
  .then(function(){
    res.status(200).json();
  })
  .catch(function(error){
    next(error);
  });
});

// Delete follows
router.delete('/follows/:id', function(req, res, next){
  followQueries.deleteID(req.params.id)
  .then(function(){
    res.status(200).json();
  })
  .catch(function(error){
    next(error);
  });
});

// Delete Photos
router.delete('/photos/:id', function(req, res, next){
  photoQueries.deleteID(req.params.id)
  .then(function(){
    res.status(200).json();
  })
  .catch(function(error){
    next(error);
  });
});

module.exports = router;
