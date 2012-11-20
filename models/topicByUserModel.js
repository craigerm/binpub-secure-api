//Topic model indexed by user
module.exports = function(dynasaur) {
  var TopicByUser, topic_by_user_schema, color, validate_url;
  topic_by_user_schema = {
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
  
  return TopicByUser = dynasaur.model('TopicByUser', topic_by_user_schema);
};