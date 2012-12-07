var Errors = require('../models/errors')
  , RecordNotFoundError = Errors.RecordNotFoundError
  , async = require('async');

module.exports = function(models, mongoose) {
  var UserSchema = new mongoose.Schema({
    githubId: { type: Number, required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileUrl: { type: String, required: true },
    enabledEmailNotifications: Boolean,
    gravatarId: String,
    avatarUrl: String,
    type: { type: String, required: true }, // Type has special meaning. See mongoose docs for more info
    location: String,
    //githubToken: String,
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

  UserSchema.index({ 'username': 1}, {'email':1}, {'githubId': 1});

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

  // Delete user and all user data
  UserSchema.statics.removeWithRelated = function(userId, callback) {
    this.findById(userId, function(err, user) {
      if(err) return callback(err);
      if(!user) return callback(new RecordNotFoundError());

      async.series([
        function(cb) {
          user.remove(cb);
        },
        function(cb) {
          Repo.remove({ userId: userId }, cb);
        },
        function(cb) {
          Topic.remove({ userId: userId }, cb);          
        },
        function(cb) {
          Post.remove({ userId: userId }, cb);
        }
      ],
      function(err, results) {
        if(err) return callback(err);
        callback();
      });
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
  UserSchema.statics.syncGitHubProfile = function(profile, callback) {

    // Passport profile is generic but includes the provider specific (in this
    // case github) data
    var data = profile._json;

    var user =  {};
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

    var query = { githubId: profile.id };
    var options = { upsert: true };

    this.findOneAndUpdate(query, user, options, callback);
  };

  models.User = mongoose.model('User', UserSchema);
  return models;
};

