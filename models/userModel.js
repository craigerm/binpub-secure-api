var Errors = require('../models/errors');
var RecordNotFoundError = Errors.RecordNotFoundError;

module.exports = function(models, mongoose) {
  var UserSchema = new mongoose.Schema({
    githubId: Number,
    username: String,
    authentication_token: String,
    name: String,
    email: String,
    profileUrl: String,
    enabledEmailNotifications: Boolean,
    gravatarId: String,
    avatarUrl: String,
    type: { type: String }, // Type has special meaning. See mongoose docs for more info
    location: String,
    githubToken: String,
    createdAt: Date,
    updatedAt: Date,
    uBlueFor: Number,
	  dBlueFor: Number,
	  uRedFor: Number,
	  dRedFor: Number,
	  uGreenFor: Number,
	  dGreenFor: Number,

	  uBlueBy: Number,
	  dBlueBy: Number,
	  uRedBy: Number,
	  dRedBy: Number,
	  uGreenBy: Number,
	  dGreenBy: Number,

    // the Card is a vote Card that tracks the list of items the person has voted for/against per color
    // the vote Card is used by the neighborhooding algorithm to match citizens, pointer reference kept here.
	  uBlueCard: String,
	  dBlueCard: String,
	  uRedCard: String,
	  dRedCard: String,
	  uGreenCard: String,
	  dGreenCard: String,
    // the friendList is also used to match users, pointer reference kept here.
    friendList: String,
    //  heap_id and deputy_id are products of neighborhood algorithm which defines 
    //  user positions in neighborhood.
    previous_heap_id: Number,
    heap_id: Number,
	  previous_deputy_id: Number,
	  deputy_id: Number
  }, { collection: 'users' });

  UserSchema.index({ 'authentication_token': 1}, {'email':1}, {'login': 1});

  // Sync repositories for user
  UserSchema.methods.syncGitHubData = function(data, callback) {
    var self = this;
    self.db.model('Repo')
      .where('userId')
      .equals(self.id)
      .remove(function(err){
        if(err)
          return callback(err);
        self.db.model('User').insertGitHubData(self.id, data, callback);
      });
  };

  // Find the user by the username
  UserSchema.statics.findOneByUsername = function(username, callback) {
    this.findOne({ username: username}, function(err, user) {
      if(err) return callback(err);
      if(!user) return callback(new RecordNotFoundError());      
      callback(err, user);
    });
  };

  // This add this github data to the system
  UserSchema.statics.insertGitHubData = function(userId, data, callback) {

    // Currently we only insert the data
    var itemsSaved = 0;
    for(var i=0; i < data.length; i++){
      var item = data[i];
      var repo = new models.Repo();
      repo.userId = userId;
      repo.repoId = item.id;
      repo.title = item.name;
      repo.link = item.html_url;
      repo.createdAt = item.created_at;
      repo.updatedAt = item.updated_at;      

      // No bulk insert for mongoose yet so we wait until 
      // all items are saved and then we execute the callback handler
      repo.save(function(err){
        if(err) return callback(err);
        if(++itemsSaved == data.length){
          callback();
        }
      });
    };
  };

  // This will sync the github profile to our database and set the login tokens
  // etc.
  UserSchema.statics.syncGitHubProfile = function(authenticationToken, githubToken, profile, callback) {

    // Passport profile is generic but includes the provider specific (in this
    // case github) data
    var data = profile._json;

    // The user data is just a list of changes that we want to insert
    var user =  {};
    user.githubToken = githubToken;
    user.authentication_token = authenticationToken;
    user.githubId = profile.id;
    user.username = profile.username;
    user.name = profile.displayName;
    user.profileUrl = profile.profileUrl;
    user.email = data.email;
    user.enabledEmailNotifications = false;
    user.gravatarId = data.gravatar_id;
    user.avatarUrl = data.avatar_url;
    user.type = data.type;
    user.location = data.location;
    user.createdAt = data.created_at;

    // Perform upsert (create object if doesn't exist)
    var options = {
      upsert: true
    };

    // We create the user account if it doesn't exist or update it if it does
    this.update({ githubId: profile.id }, user, options, function(err, numberAffected, user){
      if(err){
        callback(err);
      } else {
        callback();
      }
    });
  };

  mongoose.model('User', UserSchema);
  models.User = mongoose.model('User');
 
  return models;
};


//user model 
var temp =  function(models, mongoose) {
  console.log('entering user model');
  var User, UserSchema, validate_url;
  UserSchema = new mongoose.Schema({
	  github_id: Number,
    login: String,
    authentication_token: String,
    username: String,
	  email: String,
	  enabled_email_notifications: Boolean,
	  gravatar_id: String,
	  type: String,
	  github_token: String,
    created_at: Date,
	  updated_at: Date,

	  uBlueFor: Number,
	  dBlueFor: Number,
	  uRedFor: Number,
	  dRedFor: Number,
	  uGreenFor: Number,
	  dGreenFor: Number,
//
	  uBlueBy: Number,
	  dBlueBy: Number,
	  uRedBy: Number,
	  dRedBy: Number,
	  uGreenBy: Number,
	  dGreenBy: Number,
// the Card is a vote Card that tracks the list of items the person has voted for/against per color
// the vote Card is used by the neighborhooding algorithm to match citizens, pointer reference kept here.
	  uBlueCard: String,
	  dBlueCard: String,
	  uRedCard: String,
	  dRedCard: String,
	  uGreenCard: String,
	  dGreenCard: String,
// the friendList is also used to match users, pointer reference kept here.
      friendList: String,
// the location is also used to match users.
      location: String,
//  heap_id and deputy_id are products of neighborhood algorithm which defines user positions in neighborhood.
      previous_heap_id: Number,
      heap_id: Number,
	  previous_deputy_id: Number,
	  deputy_id: Number
    }, 
	{collection: 'users'});

  
  UserSchema.index({ 'authentication_token': 1}, {'email':1}, {'login': 1});
  mongoose.model('User', UserSchema);
  models.User = mongoose.model('User');
  
  models.getUser = function getUser(req, res, next){
    console.log('getUser');
    models.User.find({ name: req.params.username}).execFind(function (arr,data) {
      console.log('finding user: '+req.param.username);
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  
  models.modifyUser = function modifyUser(req, res, next){
    console.log('modifyUser');
    models.User.find({ name: req.params.username}).execFind(function (arr,data) {
      console.log('founduser: '+req.param.username);
	  console.log(arr);
	  console.log(data);      user.save(function () {
        console.log('user save');
        res.send(req.body);
      });
    });

  }; 
    models.deleteUser = function modifyUser(req, res, next){
    console.log('deleteUser');
	res.send({ userDelete: 'not implemented'});
  }; 
  validate_url = function() {
  
  };
  
  return models
};
