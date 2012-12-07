var RecordNotFoundError = require('./errors').RecordNotFoundError
  , autoIncrementPlugin = require('./plugins/autoIncrementPlugin');

module.exports = function(models, mongoose) {
  var ObjectId = mongoose.Schema.Types.ObjectId;

  var PostSchema = new mongoose.Schema({
    topic: { type: ObjectId, required: true, ref: 'Topic' },
    number: { type: Number, unique: true },
    user: { type: ObjectId, required: true, ref: 'User' },
    topicNumber: { type: Number, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: Date
  }, { collection: 'posts' });

  PostSchema.index({'user': 1}, {'number': 1}, {'topic': 1}, {'topicNumber': 1});

  PostSchema.plugin(autoIncrementPlugin.plugin, {field: 'number'});

  // This will get a post that belongs to the user. This is used for updating
  // or deletion.
  PostSchema.statics.findOneForUser = function(postNumber, ownerId, callback) {
    this.findOne({ number: postNumber }, function(err, post) {
      if(err) return callback(err);

      if(post && post.user == ownerId) {
        return callback(null, post);
      }
      return callback(new RecordNotFoundError());
    });
  };

  PostSchema.statics.getByNumber = function(postNumber, callback) {
    this
      .findOne({ number: postNumber })
      .populate('topic')
      .populate('user')
      .exec(function(err, post) {
        if(err) return callback(err);
        if(!post) return callback(new RecordNotFoundError());
        return callback(null, post);
      });
  };

  models.Post = mongoose.model('Post', PostSchema);
  return models; 
};

