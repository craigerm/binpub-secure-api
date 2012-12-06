// This is used to slice an object to only allow certain fields. 
// The main use is to prevent mass assignment
exports.slice = function(hash, allowedKeys){
  var sliced = {};

  for(var allowedKey in allowedKeys){
    if(hash.hasOwnProperty(allowedKey)){
      sliced[allowedKey] = hash[allowedKey];
    }
  }  
  return sliced; 
}
