var server = require('../server')
  , request = require('supertest');

describe('topics routes', function() {
  describe('GET /v1/users/:username/repos/:reponame/topics', function() {
    it('should return 200 status', function(done) {
      request(server)
        .get('/v1/users/craigerm/repos/ysenate-info/topics')
        .expect(200, done);
    });
  });

  describe('POST /v1/users/:username/repos/:reponame/topics', function() {
    it('should be unauthorized if no access token', function(done) {
      request(server)
        .post('/v1/users/craigerm/repos/ysenate-info/topics')
        .expect(401, done);
    });
  });

  describe('GET /v1/users/:username/repos/:reponame/topics/topicid', function() {
    it('should return 200', function(done) {
      request(server)
        .get('/v1/users/craigerm/repos/ysenate-info/topics/1')
        .expect(200, done);
    });
});

});
