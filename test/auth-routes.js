var server = require('../server')
  , request = require('supertest');

describe('auth routes', function(){
  describe('GET /auth/github', function(){
    it('should redirect to github login', function(done){
      request(server)
        .get('/auth/github')
        .expect(302, done);
    });
  });
});
