// GET /users/:username
exports.show = function(username, req, res, next){

  // NOTE: This is just here for an example.
  
  // All we do here is build an object
  // and pass it to the next method
  var data = {
    username: username,
    id: 123
  };

  // We don't worry about what kind of format the user wants. That's handled
  // elsewhere.
  return next(data);
};

// PUT /users/:username
exports.update = function(username, req, res, next){
  return next();
};

// DELETE /users/:username
exports.destroy = function(username, req, res, next){
  return next();
};
