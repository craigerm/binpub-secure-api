var FakeRequest = require('../fakes/request')
  , security = require('../../auth/security')
  , session = require('../../auth/session');

// This is here to simplify certain tests. 
var RequestBuilder = function(method) {
  this.data = {  params: {} };

  this.session = function(accessToken, username) {
    this.data.session = { accessToken: accessToken, username: username };
    return this;
  };
  this.usernameParam = function(username) {
    this.data.params.userid = username;
    return this;
  };
  this.accessTokenParam = function(token) {
    this.data.params.accessToken = token;
    return this;
  };
  this.setProfile = function(username) {
    this.userProfile = { username: username };
    return this;
  };
  this.authenticate = function(callback) {
    this.middleware(security.authenticate, callback);
  };
  this.checkPermission = function(callback) {
    this.middleware(security.checkPermission, callback);
  };
  this.middleware = function(fn, next) {

    var req = new FakeRequest(null, this.data.params);

    if(this.data.session) {
      var user = { username: this.data.session.username };
      session.addUser(this.data.session.accessToken, user);
    }
    if(this.userProfile) {
      req.userProfile = this.userProfile;
    }
    var context = {
      req: req
    };
    fn.call(this, req, null, function(err) {
      next.call(context, err);         
    });
  };
  return this;
};

module.exports = RequestBuilder;

