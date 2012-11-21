//Organization Model 
module.exports = function(models, mongoose) {
  var Org, OrgSchema;
  OrgSchema = new mongoose.Schema({
      owner_id: Number,
	  organization_id: Number
  },
  { collection: 'orgs'});
  
  OrgSchema.index({'owner_id': 1}, {'organization_id':1});

  mongoose.model('Org', OrgSchema);
  models.Org = mongoose.model('Org');
  
  models.listOrgs = function listOrgs(req, res, next){
    console.log('listOrgs');
    models.Org.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('found orgs');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };

  models.getOrgData = function getOrgData(req, res, next){
    console.log('get Org Data');
    models.Org.find({ organization_id: req.params.organization_id})
				.execFind(function (arr,data) {
                  console.log('foundOrg: '+req.param.organization_id);
	              console.log(arr);
	              console.log(data);
                  res.send(data);
                });

  }; 
  return models
};