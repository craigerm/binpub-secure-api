//post model
module.exports = function(models, mongoose) {
  var Post, PostSchema, color, validate_url;
  PostSchema = new mongoose.Schema({
      post_id: String,
      parent: String,
	  repo_id: String,
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
  
  models.createPost = function createPost(req, res, next) {
    console.log('create post');
    var post = new models.Post();
    post.user_id = req.params.username;
    post.repo_id = req.params.repo_name;
    post.topic_id = req.params.topic_number;	
    post.text = req.body.text;
	post.title = req.body.title;
    post.createdAt = new Date();
	post.updatedAt = new Date();
    post.save(function () {
      console.log('post save');
      res.send(req.body);
    });
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