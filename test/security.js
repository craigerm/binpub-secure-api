var should = require('should')
  , Request = require('./builders/request');

describe('security', function() {
  describe('authenticate()', function() {
    it('should throw error if no token', function(done) {
      new Request()
        .accessTokenParam(null)
        .authenticate(function(err) {
          should.exist(err);
          done();
        });
    });

    it('should throw error if not session for access token', function(done) {
      new Request()
        .accessTokenParam('12345')
        .authenticate(function(err) { 
          should.exist(err);
          done();
        });
    });

    it('should not throw error if access token  has a valid session', function(done) {
      new Request()
        .accessTokenParam('987')
        .session('987', 'craigerm')
        .authenticate(function(err) {
          should.not.exist(err);
          done();
        });
    });

    it('should have user profile assigned if user is "me"', function(done) {
      new Request()
        .accessTokenParam('tokenzzz')
        .session('tokenzzz', 'craigerm')
        .usernameParam('me')
        .authenticate(function(err) {
          should.not.exist(err);
          this.req.userProfile.username.should.equal('craigerm');
          done();
        });
    });

    it('should have user profile assigned for valid session token', function(done) {
      new Request()
        .accessTokenParam('5555')
        .session('5555', 'craigerm')
        .authenticate(function() {
          should.exist(this.req.userProfile);
          done();
        });
    });
  });
  
  describe('checkPermission()', function() {
    it('should throw error if userid missing from params', function(done) {
      new Request()
        .usernameParam(null)
        .setProfile('username')
        .checkPermission(function(err) {
          should.exist(err);
          done();
        });
    });

    it('should throw error if param is not equal to userprofile username', function(done) {
      new Request()
        .usernameParam('craigerm')
        .setProfile('someguy')
        .checkPermission(function(err) {
          should.exist(err);
          done();
        });
    });

    it('should have no error if param is same as profile username', function(done) {
      new Request()
        .usernameParam('craigerm')
        .setProfile('craigerm')
        .checkPermission(function(err) {
          should.not.exist(err);
          done();
        });
    });
  });
});
