//models wrapper
module.exports = function (mongoose) {
console.log('entering models wrapper');
  var models = {};
  models = require('./messageModel')(models, mongoose);

return models
}