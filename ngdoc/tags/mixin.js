module.exports = {
    name: 'mixin',
    multi:true,
    transforms: function(doc, tag, value) {
	if (!doc.mixins) doc.mixins = [ ];
	doc.mixins.push(value);
	return undefined;
    }
  };
