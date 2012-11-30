exports.show = function(username, req, res, next){
  // All we do here is build an object
  // and pass it to the next method
  var data = {
    username: username,
    id: 123
  };

  return next(data);
};

