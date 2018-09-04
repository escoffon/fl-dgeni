var _ = require('lodash');

/**
 * @dgService flUtilities
 * @description A service that exports a bunch of utility functions
 */

module.exports = function flUtilities() {
    return {
	stateInfo: function(doc, root) {
	    // So that we can create states even though our module names contain dots(.),
	    // we camel case on the dots
	    // (in UI-Router dotted notation means it's a child state, so this is problematic
	    // if we are following Angular style guides and conventions regarding
	    // naming of our modules)
	    // We also add the doc type to disambiguate possible name conflicts (for example,
	    // module fl_model_factory and service FlModelFactory)
	    // And we prepend the area name; the app pages will then root them as needed.
	    //
	    // For content types, if the doc is marked isindex, then we use a standard state name
	    // instead of generating one from the name.

	    if (_.isNil(root)) root = 'docs';
	    
	    let area = (doc.area) ? doc.area : 'api';
	    let name, url;

	    if ((doc.docType === 'content') && doc.isindex)
	    {
		name = root + '.' + area + '.index';
		url = '/index';
	    }
	    else
	    {
		let re = new RegExp('^' + area + '/?');

		name = root + '.' + area + '.' + doc.docType + '-' + _.camelCase(doc.name.split('.'));
		url = '/' + doc.path.replace(re, '');
	    }

	    return { name: name, url: url };
	}
    };
};
