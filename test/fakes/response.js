var FakeResponse = function(callback) {
  this.statusCode = 200;
  this.data = {};
  this.callback = callback || function(){};
};

FakeResponse.prototype.send = function(code, data) {
  this.statusCode = code;
  this.data = data;
  this.callback(this);
};

module.exports = FakeResponse;
