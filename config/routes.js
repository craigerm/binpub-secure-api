module.exports = function(app){
  var map = require('../utils/routing-connect')(app);



  // Rails like resources
  //
  map.namespace('v1', function(){    
    this.resources('users', function(){
      this.resources('repos');
    });
  });

//  map.resources('users', function(){

//    resources('repos');
//  });

  // GET /users/:username/repo index
// POST /users/:username/repo create
  // GET /users/:username/repo/:id show
// GET 

  // Authentication 
//  map.get('auth/github', 'auth#github');
      
};
