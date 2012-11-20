//repository model
module.exports = function(dynasaur) {
  var Repository, repository_schema, color, validate_url;
  repository_schema = {
    attributes: {
	  initialCommit: String,
      user: Number,
	  github_id: Number,
      title: String,
      body: String,
	  type: String,
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
        field: 'createdAt'
      }
    ]
  };
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  validate_unique_title = function () {
  
  };
  
  return Repository = dynasaur.model('Repository', repository_schema);
};