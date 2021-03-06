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
const bcrypt          = require('bcrypt');
const salt            = bcrypt.genSaltSync(10);


// Generate token upon successful login
router.post('/login', function(req, res){
  userQueries.getOne(req.body.username)
  .then(function(user){
    user = user[0]
    if (!user) {
      res.json({success: false, message: "Authentication failed. Username not found."})
    } else if (user) {
      if (bcrypt.compareSync(req.body.password, user.password) == false) {
        res.json({ success: false, message: "Authentication failed. Incorrect password."})
      } else {
        var cert = config.secret
        var token = jwt.sign(user, 'superSecret', {
          expiresIn: '24h'
        });
        res.json({
          success: true,
          message: 'Enjoy',
          token: token,
          user: user.id
        });
      }
    }
  });
});

// Create new user
router.post('/users', function(req, res, next){
  req.body.password = bcrypt.hashSync(req.body.password, 10); 
  userQueries.add(req.body)
  .then(function(userID){
    return userQueries.getSingle(userID);
  })
  .then(function(users){
    res.status(200).json(users)
    return userQueries.getSingle(users.id)
  })
  .then(function(data){
    return followQueries.add(data.id, data.id)
  })
  .catch(function(error){
    next(error);
  });
});

// Get all recipes
router.get('/recipes', function(req, res, next){
  console.log(req.decoded)
  recipeQueries.getAll()
  .then(function(recipes) {
    Promise.all(recipes.map(recipe => getRecipePhotos(recipe.id)))
    .then(allRecipes => res.status(200).json(allRecipes));
  })
  .catch(function(error){
    next(error);
  });
});

// Check for token
router.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'superSecret', function(err, decoded) {
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

function fillRecipe(recipe) {
  return photoQueries
    .getPhotos(recipe.id)
    .then(function (photos) {
      return Object.assign(recipe, {photos: photos});
    });
}

// Get recipes associated to user_id
router.get('/user/:user_id/recipes', function (req, res, next) {
  recipeQueries.getRec(req.params.user_id)
  .then(function(recipes) {
    Promise.all(recipes.map(recipe => getRecipePhotos(recipe.id)))
    .then(allRecipes => res.status(200).json(allRecipes));
  })
  .catch(function(error){
    next(error);
  });
});

function getRecipePhotos(id) {
  return recipeQueries.getSingle(id)
  .then(recipes => {
    return photoQueries.getPhotos(id)
    .then(photos => ([{
        recipe: recipes[0],
        photos
    }]));
  });
}

// Get a single recipe
router.get('/recipes/:id', function (req, res, next) {
  getRecipePhotos(req.params.id)
  .then(recipePhotos => res.status(200).json(recipePhotos))
  .catch(function(error){
    next(error);
  });
});

// Get recipes where the tags fit the query
router.get('/recipes/search/:query', function(req, res, next){
  recipeQueries.getSearch(req.params.query)
  .then(function(data){
    var recipe = data.rows
    Promise.all(recipe.map(recipe => getRecipePhotos(recipe.id)))
    .then(allRecipes => res.status(200).json(allRecipes));
  })
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
  .then(function (favs) {
    return favs.map(function (fav) {
      return fav.recipe_id;
    });
  })
  .then(function(recipes) {
    Promise.all(recipes.map(recipe => getRecipePhotos(recipe)))
    .then(allRecipes => res.status(200).json(allRecipes));
  })
  .catch(function(error){
    next(error);
  });
});

// Check if the user has already favourited the recipe
router.get('/user/:user_id/recipe/:recipe_id/favourites', function(req, res, next){
  favQueries.idCheck(req.params.user_id, req.params.recipe_id)
  .then(function(favs){
    var data = favs.rows
    if (data.length > 0){
      res.status(200).json('true')
    } else {
      res.status(200).json('false');
    }  
  })
});

// Check if the user has already liked the recipe
router.get('/user/:user_id/recipe/:recipe_id/likes', function(req, res, next){
  likeQueries.idCheck(req.params.user_id, req.params.recipe_id)
  .then(function(likes){
    var data = likes.rows
    if (data.length > 0){
      res.status(200).json('true')
    } else {
      res.status(200).json('false');
    }
  })
});

// Check if the user is already following another user
router.get('/user/:user_id/follows/:following_id/follows', function(req, res, next){
  followQueries.idCheck(req.params.user_id, req.params.following_id)
  .then(function(follows){
    var data = follows.rows
    if (data.length > 0){
      res.status(200).json('true')
    } else {
      res.status(200).json('false');
    }
  })
});



// Get followers associated to a user_id
router.get('/user/:user_id/follows', function (req, res, next) {
  followQueries.getFollows(req.params.user_id)
  .then(function(following){
    dbResponse = 0
    total = following.length
    following.forEach(function(followID) { 
      userQueries.getSingle(followID.following_id)
      .then(function(user){
        result.push(user)
        dbResponse++
        if (dbResponse == total) {
        return result;
        }
      })
      .then(function(result){
        results = []

      })
    })
  })
});



//Get recipes from users being followed
router.get('/user/:user_id/follows/recipes', function (req, res, next){
  followQueries.getFollows(req.params.user_id)
  .then(function (follows) {
    return follows.map(function (follow) {
      return follow.following_id;
    });
  })
  .then(function (following_ids) {
    return Promise.all(following_ids
    .map(recipeQueries.getRec));
  })
  .then(function(recipe_collections){
    // console.log(recipe_collections)
    return Promise.all(recipe_collections.map(function (collection) {
      return Promise.all(collection.map(fillRecipe));
    }))
  })
  .then(function(all){
    res.status(200).json(all);
  })
  .catch(function(error){
    next(error);
  });
});

// Add recipes
router.post('/recipes', function (req, res, next){
  var description = req.body.description
  var result = description.match(/#\w+/g)
  
  if (result !== null) {
    var tags = result.map(function(e){
      return e.replace('#', '')
    })
    req.body.tags = tags
  } else {
    req.body.tags = null
  };
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
