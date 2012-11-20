//Topic model indexed by repo
module.exports = function(dynasaur) {
  var TopicByRepo, topic_by_repo_schema, color, validate_url;
  topic_schema = {
    attributes: {
	  parent: String,
	  repo: Number,
	  number: Number,
      user: String,
      title: String,
      body: String,
	  type: String,
	  url: String,
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
        field: 'repo'
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
  
  return TopicBYRepo = dynasaur.model('TopicByRepo', topic_by_repo_schema);
};