var mongoose = require('mongoose');

module.exports.init = function(mongoose) {

  var CounterSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    seq: Number
  }, { collection: 'counters' });

  CounterSchema.index({ name: 1 });
  return mongoose.model('Counter', CounterSchema);
};

module.exports.plugin = function(schema, options) {

  if(!options.field) {
    throw new Error('autoIncrementPlugin requires the field to be incremented');
  };

console.log('OPTIONS %', options);
  var collectionName = schema.options.collection;
  var fieldToIncrement = options.field;

  schema.pre('save', function(next) {
    var self = this;
    var query = { name: collectionName  };
    var update = { $inc: { seq: 1 } }
    var options = { upsert: true  }

    mongoose.model('Counter').findOneAndUpdate(query, update, options, function(err, counter) {
      if(err) return next(err);
      self[fieldToIncrement] = counter.seq;
      next();
    });
  });
};
