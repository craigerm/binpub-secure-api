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
  this.statusCode = 404;
  msg = msg || 'Record Not Found';
  RecordNotFoundError.super_.call(this, msg, this.constructor);
};

util.inherits(RecordNotFoundError, AbstractError);

var NotAuthorizedError = function(msg) { 
  this.statusCode = 401;
  msg = msg || 'Not Authorized';
  NotAuthorizedError.super_.call(this, msg, this.constructor);
};

util.inherits(NotAuthorizedError, AbstractError);

// Export all our custom errors
module.exports.RecordNotFoundError = RecordNotFoundError;
module.exports.NotAuthorizedError = NotAuthorizedError;
