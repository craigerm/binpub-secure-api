var redis = require('redis');
var config = require('../config/application');
var Step = require('step');
var client = redis.createClient(config.creds.redis_port, config.creds.redis_host);

client.auth(config.creds.redis_auth, function() {
  console.log("Connected to Redis4You");
});

// TODO: Figure out best practice (fastest) for storing JSON in redis
module.exports.addUser = function(accessToken, user) {
  var json = JSON.stringify(user);
  client.set(accessToken, json);
};

module.exports.getUserByToken = function(accessToken, callback) {
  client.get(accessToken, function(err, reply) {
    if(err) return callback(err);
    if(!reply) return callback();
    var user = JSON.parse(reply);
    callback(null, user);
  });
};

//// A hash of the providers we support
//var providers = {

//  // Github provider logic
//  'github': function(userData){
//    var userKey = "GHid:" + userData.id;
//    console.log("Attempting to get GitHub User: " + userKey);
//    Step(
//      function tryToFindUser() {
//        console.log('tryToFindUser');
//        client.get(userKey, this);
//      },
//      function orCreateUser(err, reply) {
//        console.log(err);
//        console.log('orCreateUser');
//        if (err) throw err;
//        if (!reply) {
//          console.log("User not found, creating new GitHub user: " +userData.id);
//          exports.createUser(userData, this);
//        } else {
//          console.log("User Found, updating GitHub User: " + reply);
//          exports.updateUser(userData, this);
//        }
//      },
//      function finishThis (err, reply) {
//        console.log('finishThis');
//        if (err) throw err;
//        next(err, reply);
//      }
//    );
//  }
//};

//exports.findOrCreateUser = function findOrCreateUser(userData, next){
//  console.log('findOrCreateUser');
//  var provider = providers[userData.provider];

//  if(provider){
//    provider.call(this, userData, next);
//  } else {
//    console.log('No strategy founf for "%s".', userData.provider);
//    next();
//  }
//};

//exports.createUser = function createUser(userData, next) {
//  var userKey = "GHid:" + userData.id;
//  console.log("Creating new GitHub user: " + userKey);
//  Step (
//    function updateRedisStore () {
//      client.set(userKey, userData.info, this);
//    },
//    function finishThis(err, reply) {
//      if (err) throw err;
//      next(err, reply);
//    }
//  );
//};

//exports.updateUser = function updateUser(userData, next) {
//  var userKey = "GHid:" + userData.id;
//  console.log("Updating user: " + userKey);
//  Step (
//    function updateRedisStore () {
//      client.set(userKey, userData.info, this);
//    },
//    function finishThis(err, reply) {
//      if (err) throw err;
//      next(err, reply);
//    }
//  );
//};
