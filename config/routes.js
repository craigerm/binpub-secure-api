module.exports = function(app){
  var map = require('../utils/routing-connect')(app);

  // Rails like resources
  map.resources('users');
};