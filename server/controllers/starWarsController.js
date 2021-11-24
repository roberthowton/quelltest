const models = require('../models/starWarsModels');

const starWarsController = {};

starWarsController.getCharacters = async (req, res, next) => {
  models.Person.find({}, function(err, docs) {
    if (err) return next(err);

    res.locals.characters = docs;
    return next();
  });
};

starWarsController.getSpecies = (req, res, next) => {
  const id = req.query.id;
  models.Species.findOne({_id: id}, (err, species) => {
    if (err) return next(err);
    console.log(species);
    res.locals.species = species;
    return next();
  });
};

starWarsController.getHomeworld = (req, res, next) => {
  const id = req.query.id;
  models.Planet.findOne({_id: id}, (err, docs) => {
    if(err) return next(err);
    res.locals.homeworld = docs;
    return next();
  });
 
};

starWarsController.getFilm = (req, res, next) => {
  models.Film.findOne({_id: req.query.id}, (err, film) => {
    if (err) return next(err);
    res.locals.filmData = film;
    return next();
  });
};

starWarsController.addCharacter = (req, res, next) => {
  // write code here

  next();
};

module.exports = starWarsController;