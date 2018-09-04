module.exports = {
    name: 'extends',
    multi:false,
    transforms: function(doc, tag, value) {
	doc['extends'] = value;
	return value;
    }
  };
