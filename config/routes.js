module.exports = function(app){
  var map = require('../lib/routing-connect')(app);

  // Rails like resources
  map.namespace('v1', function() {  
    this.resources('users', function() {
      this.resources('repos', function() {
        this.resources('topics', function(){
          this.resources('posts');
        });
      });
      this.resources('sync_repos');
    });
  });

  // Github authentication routes
  map.get('auth/github', 'auth-github#auth');
  map.get('auth/github/callback', 'auth-github#callback');
};
