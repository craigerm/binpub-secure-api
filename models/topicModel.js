//Topic model 
module.exports = function(models, mongoose) {
  console.log('entering Topic model');
  var Topic, TopicSchema, validate_url;
  TopicSchema = new mongoose.Schema({
	  parent: String,
	  repo_id: Number,
	  number: Number,
      user_id: String,
      title: String,
      body: String,
	  type: String,
	  url: String,
      createdAt: Number,
	  updatedAt: Number,
//
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
  }, 
  {collection: 'topics'});
  
  TopicSchema.index({'number': 1}, {'repo_id':1}, {'user_id': 1});

  mongoose.model('Topic', TopicSchema);
  models.Topic = mongoose.model('Topic');
  
  models.listTopicsByUser = function listTopicsByUser(req, res, next){
    console.log('listTopicsByUser');
    models.Topic.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.listTopicsByRepo = function getTopicsByRepo(req, res, next){
    console.log('listTopicsRepo');
    models.Topic.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.getTopicData = function getTopicData(req, res, next){
    console.log('modifyUser');
    models.Topic.find({ repo_id: req.params.repo_name})
	            .where('number').equals(req.params.topic_number)
				.execFind(function (arr,data) {
                  console.log('foundTopic: '+req.param.topic_number);
	              console.log(arr);
	              console.log(data);
                  res.send(data);
                });

  }; 
    models.deleteTopic = function deleteTopic(req, res, next){
    console.log('deleteTopic');
	res.send({ topicDelete: 'not implemented'});
  }; 
  
  validate_url = function() {
  
  };
  
  return models
};