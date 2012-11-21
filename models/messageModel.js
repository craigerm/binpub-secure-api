module.exports = function(models, mongoose){
  console.log('entering message model');
  var MessageSchema = new mongoose.Schema({
    message: String,
    date: Date
  }, { collection: 'messages'});
// Use the schema to register a model
  mongoose.model('Message', MessageSchema); 
  models.Message = mongoose.model('Message'); 


  // This function is responsible for returning all entries for the Message model
  models.getMessages = function getMessages(req, res, next) {
    // Resitify currently has a bug which doesn't allow you to set default headers
    // This headers comply with CORS and allow us to server our response to any origin
    console.log('getMessages1');
    models.Message.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  }

  models.createMessage = function createMessage(req, res, next) {
    console.log('createMessage1');
    // Create a new message model, fill it up and save it to Mongodb
    var message = new models.Message(); 
    message.message = req.params.message;
    message.date = new Date();
    console.log(message);
    message.save(function () {
      console.log('message save');
      res.send(req.body);
    });
  }
  return models
}