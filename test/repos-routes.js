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
    it('should return 200 status', function(done){
        request(server)
          .get('/v1/users/craigerm/repos/binpub')
          .expect('Content-Type', /json/)
          .expect(200, done);
    });
  });

  //TODO: Add test for syncing repositories with github

});
