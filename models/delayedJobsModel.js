//DelayedJobs Model
module.exports = function(models, mongoose) {
  var DelayedJobs, DelayedJobsSchema;
  DelayedJobsSchema = new mongoose.Schema({
      priority: Number,
	  attempts: Number,
	  handler: String,
	  last_error: String,
	  run_at: Number,
	  locked_at: Date,
	  failed_at: Date,
	  locked_by: String,
	  queue: String,
	  created_at: Number,
	  updated_at: Number
    }, 
	{collection: 'DelayedJobs'});
  
  DelayedJobsSchema.index({'priority': 1}, {'locked_at':1}, {'failed_at': 1});

  mongoose.model('DelayedJob', DelayedJobsSchema);
  models.DelayedJob = mongoose.model('DelayedJob');
  
  models.listDelayedJobs = function listDelayedJobs(req, res, next){
    console.log('listDelayedJobsByPriority');
    models.DelayedJob.find().limit(20).sort('priority', -1).execFind(function (arr,data) {
      console.log('found delayed jobs');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };

  return models
};