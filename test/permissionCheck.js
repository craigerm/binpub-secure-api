var permissionCheck = require('../auth/permissionCheck')
  , should = require('should')
  , _ = require('underscore')
  , FakeRequest = require('./fakes/request')
  , FakeResponse = require('./fakes/response')
  , session = require('../auth/session');

describe('permissionCheck()', function() {

  var secureMethods = ['POST','PUT','PATCH','DELETE'];

  // This is here to simplify the permission check tests.
  var check = function(method) {
    this.data = { method: method, params: {} };
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
    this.expect = function(statusCode, done) {
      var callback = function(res) {
        res.statusCode.should.equal(statusCode);
        done();
      };

      var req = new FakeRequest(this.data.method, this.data.params);
      var res = new FakeResponse(callback);

      if(this.data.session) {
        var user = { username: this.data.session.username };
        session.addUser(this.data.session.accessToken, user);
      }

      permissionCheck(req, res, function(err, data) {
        callback(res); 
      });
    };
    return this;
  };

  describe('with anonymous user', function() {
    _.each(secureMethods, function(method) {
      it('should not allow ' + method, function(done) {
        check(method).expect(401, done);
      });
    });

    it('should allow GET', function(done) {
      check('GET').expect(200, done);
    });
    
    it('should not allow GET when user username param is "me"', function(done) {
      check('GET').usernameParam('me').expect(401, done);
    });
  });

  describe('with bad token', function() {
    _.each(secureMethods, function(method) {
      it('should not allow ' + method, function(done) {
        check(method).accessTokenParam('zzz123').expect(401, done);
      });
    });
  });

  describe('with good token and associated user in url', function() {
    _.each(secureMethods, function(method) {
      it('should allow ' + method, function(done) {
        check(method)
          .session('qqq', 'craigerm')
          .accessTokenParam('qqq')
          .usernameParam('craigerm')
          .expect(200, done);
      });
    });
  });

  describe('with good token but another user in url', function() {
    _.each(secureMethods, function(method) {
      it('should not allow ' + method, function(done) {
        check(method)
          .session('fake123', 'craigerm')
          .accessTokenParam('fake123')
          .usernameParam('charlesjshort')
          .expect(401, done);
      });
    });
    
    it('should allow GET', function(done) {
      check('GET')
        .session('fake555', 'craigerm')
        .accessTokenParam('fake555')
        .usernameParam('charlesjshort')
        .expect(200, done);
    });
  });
});
