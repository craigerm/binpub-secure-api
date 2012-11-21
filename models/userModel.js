//user model 
module.exports = function(models, mongoose) {
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
//
      created_at: Date,
	  updated_at: Date,
//
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
	  console.log(data);
      user.save(function () {
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