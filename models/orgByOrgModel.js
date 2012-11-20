//Organization Model
module.exports = function(dynasaur) {
  var OrgByOrg, org_by_org_schema, color, validate_url, updateCard;
  org_by_org_schema = {
    attributes: {
      owner_id: Number,
	  organization_id: Number
    },
    index: [
	{
        type: 'hash',
        field: 'organization_id'
    }
    ]
  };

  validate_url = function() {
  
  };
  
  return OrgByOrg = dynasaur.model('OrgByOrg', org_by_org_schema);
};