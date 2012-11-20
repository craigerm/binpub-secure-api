//Organization Model indexed by owner
module.exports = function(dynasaur) {
  var OrgByOwner, org_by_owner_schema;
  org_by_owner_schema = {
    attributes: {
      owner_id: Number,
	  organization_id: Number
    },
    index: [
      {
        type: 'hash',
        field: 'owner_id'
      }
    ]
  };
  
  return OrgByOwner = dynasaur.model('OrgByOwner', org_by_owner_schema);
};