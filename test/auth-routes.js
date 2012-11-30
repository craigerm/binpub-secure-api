var server = require('../server')
  , request = require('supertest');

describe('auth routes', function(){
  describe('github', function(){
    it('should do something', function(done){
      request(server)
        .get('/auth/github')
        .expect(200, done);
    });
  });
});
