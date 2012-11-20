//post model indexed by topic
module.exports = function(dynasaur) {
  var PostByTopic, post_by_topic_schema, color, validate_url;
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
        field: 'topic'
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
  
  return PostByTopic = dynasaur.model('PostBYTopic', post_by_topic_schema);
};