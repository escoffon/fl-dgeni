// This tag is only relevant for content types, and is ignored for all others

module.exports = {
    name: 'isindex',
    multi:false,
    transforms: function(doc, tag, value) {
	return true;
    }
  };
