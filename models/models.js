//models wrapper
module.exports = function (mongoose) {
console.log('entering models wrapper');

  // TODO 
  // - Update the models that are not part of the original Ost.io API, like
  // commitModel
  var models = {};
  models = require('./messageModel')(models, mongoose);
  models = require('./topicModel')(models, mongoose);
  models = require('./repoModel')(models, mongoose);
  models = require('./postModel')(models, mongoose);
  models = require('./orgModel')(models, mongoose);
  models = require('./delayedJobsModel')(models, mongoose);
  models = require('./commitModel')(models, mongoose);
  models = require('./userModel')(models, mongoose);
  
  return models
}
