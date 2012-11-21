//post model
module.exports = function(models, mongoose) {
  var Post, PostSchema, color, validate_url;
  PostSchema = new mongoose.Schema({
      post_id: String,
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
	
  PostSchema.index({'user_id': 1}, {'parent':1}, {'topic_id': 1});

  mongoose.model('Post', PostSchema);
  models.Post = mongoose.model('Post');
  
  models.listPostsByUser = function listPostsByUser(req, res, next){
    console.log('listPostsByUser');
    models.Post.find().limit(20).sort('createdAt', -1).execFind(function (arr,data) {
      console.log('found posts');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.listPostsByParent = function listPostsByParent(req, res, next){
    console.log('listPostsByParent');
    models.Post.find().limit(20).sort('createdAt', -1).execFind(function (arr,data) {
      console.log('found posts');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.getPostData = function getPostData(req, res, next){
    console.log('get post Data');
    models.Post.find({ post_id: req.params.post_id})
				.execFind(function (arr,data) {
                  console.log('foundPost: '+req.param.post_id);
	              console.log(arr);
	              console.log(data);
                  res.send(data);
                });

  };
  models.modifyPost = function modifyPost(req, res, next) {
    console.log('modify post data');
	//
  
  };
  
  
  
  models.deletePost = function deletePost(req, res, next){
    console.log('deletePost');
	res.send({ PostDelete: 'not implemented'});
  }; 
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  return models
};