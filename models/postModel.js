var autoIncrementPlugin = require('./plugins/autoIncrementPlugin');

module.exports = function(models, mongoose) {
  var ObjectId = mongoose.Schema.Types.ObjectId;

  var PostSchema = new mongoose.Schema({
    topicId: { type: ObjectId, required: true},
    number: { type: Number, unique: true },
    userId: { type: ObjectId, required: true },
    topicNumber: { type: Number, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: Date
  }, { collection: 'posts' });

  PostSchema.index({'userId': 1}, {'number': 1}, {'topicId': 1}, {'topicNumber': 1});

  PostSchema.plugin(autoIncrementPlugin.plugin, {field: 'number'});

  // This will get a post that belongs to the user. This is used for updating
  // or deletion.
  PostSchema.statics.findOneForUser = function(postNumber, ownerId, callback) {
    this.findOne({ number: postNumber }, function(err, post) {
      if(err) return callback(err);

      if(post && post.userId == ownerId) {
        return callback(null, post);
      }
      return callback(new RecordNotFoundError());
    });
  };

  models.Post = mongoose.model('Post', PostSchema);
  return models; 
};

