//Organization Model
module.exports = function(dynasaur) {
  var DelayedJobs, delayed_jobs_schema;
  delayed_jobs_schema = {
    attributes: {
      priority: Number,
	  attempts: Number,
	  handler: String,
	  last_error: String,
	  run_at: Number,
	  locked_at: Number,
	  failed_at: Number,
	  locked_by: String,
	  queue: String,
	  created_at: Number,
	  updated_at: Number
    },
    index: [
      {
        type: 'hash',
        field: 'priority'
      }, {
        type: 'range',
        field: 'run_at'
      }
    ]
  };
  
  return DelayedJobs = dynasaur.model('DelayedJobs', delayed_jobs_schema);
};