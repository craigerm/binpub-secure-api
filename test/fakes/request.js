var FakeRequest = function(method, params) {
  this.method = method || 'GET';
  this.params = params || {};
};

module.exports = FakeRequest;

