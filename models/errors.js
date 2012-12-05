// This contains some custom errors that we work with in the model layers
//
// Taken from blog post: http://dustinsenos.com/articles/customErrorsInNode

var util = require('util');

// Base class for our custom errors
var AbstractError = function(msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
};

util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';

// This is out generic record not found error
var RecordNotFoundError = function(msg) {
  RecordNotFoundError.super_.call(this, msg, this.constructor);
};

util.inherits(RecordNotFoundError, AbstractError);
RecordNotFoundError.prototype.message = 'Record Not Found';

var NotAuthorizedError = function(msg) { 
  NotAuthorizedError.super_.call(this, msg, this.constructor);
};

util.inherits(NotAuthorizedError, AbstractError);
NotAuthorizedError.prototype.message = 'Not Authorized';

// Export all our custom errors
module.exports.RecordNotFoundError = RecordNotFoundError;
