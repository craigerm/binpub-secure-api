//user model indexed by authentication token
module.exports = function(dynasaur) {
  var UserByToken, user_by_token_schema, color, validate_url;
  user_by_token_schema = {
    attributes: {
	  github_id: Number,
      login: String,
      authentication_token: String,
      name: String,
	  email: String,
	  enabled_email_notifications: String,
	  gravatar_id: String,
	  type: String,
	  github_token: String,
//
      created_at: Number,
	  updated_at: Number,
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
//
	  uBlueCard: String,
	  dBlueCard: String,
	  uRedCard: String,
	  dRedCard: String,
	  uGreenCard: String,
	  dGreenCard: String,
//
      connnectCard: String,
      previous_heap_id: Number,
      heap_id: Number,
	  deputy_id: Number,
    },
    index: [
      {
        type: 'hash',
        field: 'authentication_token'
      }, {
        type: 'range',
        field: 'created_at'
      }
    ]
  };
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  return UserByToken = dynasaur.model('UserByToken', user_by_token_schema);
};