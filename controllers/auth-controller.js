exports.github = function(req, res, next){
  var data = {loggedIn: true};
  return next(data);
};
