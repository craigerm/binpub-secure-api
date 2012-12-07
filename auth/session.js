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

