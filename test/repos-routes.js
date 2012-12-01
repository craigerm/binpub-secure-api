var server = require('../server')
  , request = require('supertest');

describe('repos routes', function(){
  describe('GET /v1/users/:username/repos', function(){
    it('should return 200 status', function(done){
      request(server)
        .get('/v1/users/craigerm/repos')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /v1/users/:username/repos/:reponame', function(){
    it('should return 404 status if repo is not found', function(done){
        request(server)
          .get('/v1/users/craigerm/repos/fakerepo123213')
          .expect('Content-Type', /json/)
          .expect(404, done);
    });
  });
});
