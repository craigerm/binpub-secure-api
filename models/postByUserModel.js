//post model indexed by user
module.exports = function(dynasaur) {
  var PostByUser, post_by_user_schema, color, validate_url;
  repository_schema = {
    attributes: {
      parent: String,
	  user: Number,
	  topic: Number,
	  author: String,
      title: String,
      body: String,
	  link: String,
      createdAt: Number,
	  updatedAt: Number,
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
    },
    index: [
      {
        type: 'hash',
        field: 'user'
      }, {
        type: 'range',
        field:  'createdAt'
      }
    ]
  };
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  return PostByUser = dynasaur.model('PostByUser', post_by_user_schema);
};