//commit model
module.exports = function(dynasaur) {
  var Commit, commit_schema, color, validate_url;
  commit_schema = {
    attributes: {
	  sha: String,
      user: Number,
      title: String,
      body: String,
	  type: String,
	  link: String,
      date: Number,
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
        field: 'sha'
      }, {
        type: 'range',
        field: 'date'
      }
    ]
  };
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  return Commit = dynasaur.model('Commit', commit_schema);
};