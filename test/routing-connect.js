var map = require('../lib/routing-connect')
  , should = require('should')
  , FakeApp = require('./fakes/app');

describe('map()', function() {

  var app = new FakeApp();
  var map = require('../lib/routing-connect')(app);

  beforeEach(function() {
    app.reset();
  });

  describe('namespace with resources', function() {
    it('should prefix resources with namespace', function() {
        map.namespace('v1', function() {
          this.resources('users');
        });
        app.routeCount().should.equal(2);
        app.routeExists('get', '/v1/users/:userid').should.be.true;
        app.routeExists('del', '/v1/users/:userid').should.be.true;
     });
  });

  describe('namespace with nested resources', function() {
    it('should build full name', function() {
      map.namespace('v1', function() {
        this.resources('users', function() {
          this.resources('repos');
        });
      });

      app.routeCount().should.equal(5);
      app.routeExists('get', '/v1/users/:userid/repos');
      app.routeExists('get', '/v1/users/:userid/repos/:repoid');
      app.routeExists('post','/v1/users/:userid/repos/:repoid');
    });
  });

  describe('namespace with 2 nested resources', function() {
    it('should build full name', function() {
      map.namespace('v1', function() {
        this.resources('users', function() {
          this.resources('repos', function() {
            this.resources('topics');
          });
        });
      });
      app.routeCount().should.equal(10);
      app.routeExists('del', '/v1/users/:userid/repos/:repoid/topics/:topicid')
         .should.be.true;
    });
  });

  describe('namespace with 3 nested resources', function() {
    it('should build full name', function() {
      map.namespace('v1', function() {
        this.resources('users', function() {
          this.resources('repos', function() {
            this.resources('topics', function() {
              this.resources('posts');
            });
          });
        });
      });
      app.routeCount().should.equal(15);
    });
  });

  describe('nested route should be allowed to override :id name', function() {
    it('should have correct named parameter in route', function() {
      map.namespace('v1', function() {
        this.resources('users', {id: 'username'});
      });
      app.routeExists('get', '/v1/users/:username').should.be.true;
      app.routeExists('del', '/v1/users/:username').should.be.true;
    });
  });
});
