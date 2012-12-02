module.exports = function(app){
  var map = require('../lib/routing-connect')(app);

  // Rails like resources
  //
  map.namespace('v1', function(){    
    this.resources('users', function(){
      this.resources('repos');
      this.resources('sync_repos');
    });
  });

  // Authentication 
  // map.get('auth/github', 'auth#github');
      
};
