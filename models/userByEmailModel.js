//user model index by email
module.exports = function(dynasaur) {
  var UserByEmail, user_by_email_schema, color, validate_url;
  user_schema = {
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
        field: 'email'
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
  
  return UserByEmail = dynasaur.model('UserByEmail', user_by_email_schema);
};