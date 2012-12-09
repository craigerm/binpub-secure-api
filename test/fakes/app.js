// This is a fake application used for testing the routing-connect.
// It can be expanded as needed to test some other functionality.
var _ = require('underscore')._
  , verbs = ['post', 'get', 'put', 'del'];

var FakeApp = function() {
  this.reset();
};

FakeApp.routes = {};

FakeApp.prototype.reset = function() {
  var routeMap = {};
  _.each(verbs, function(verb) {
    routeMap[verb]  = {};
  });
  this.routes = routeMap;
};

_.each(verbs, function(verb) {
  FakeApp.prototype[verb] = function(route) {
    this.routes[verb][route] = true;
  };
});

FakeApp.prototype.routeCount = function() {
  var count = 0;
  for(var verb in this.routes) {
    for(var rout in this.routes[verb]) {
      count++;
    }
  }
  return count;
};

FakeApp.prototype.routeExists = function(verb, name) {
  return this.routes[verb][name] == true; 
};

module.exports = FakeApp;

