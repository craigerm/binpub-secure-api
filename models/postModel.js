//post model
module.exports = function(models, mongoose) {
  var Post, PostSchema, color, validate_url;
  PostSchema = new mongoose.Schema({
      parent: String,
	  user_id: Number,
	  topic_id: Number,
      title: String,
      text: String,
	  link: String,
      createdAt: Date,
	  updatedAt: Date,
//
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
    },
    {collection: 'posts'});
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  return PostByUser = dynasaur.model('PostByUser', post_by_user_schema);
};