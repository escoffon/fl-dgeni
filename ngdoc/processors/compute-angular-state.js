var _ = require('lodash');

// This processor generates the name and URL for an AngularJS/UI-Router state for all the docs that could
// be associated with one.
// It assumes that the app creates a state hierarchy rooted at 'docs' (which is a configurable value),
// and where the second element in the path is the doc's area.
// So, for docs where the area is 'api', we have docs.api.whatever, and for 'guide' docs.guide.whatever.
// The URL is relative to the docs.area state, as expected by UI-Router.

module.exports = function computeAngularStateProcessor(flUtilities) {
    return {
	state_root: 'docs',
        $runAfter: ['paths-computed'],
        $runBefore: ['computeExtendDocsProcessor'],
        $process: process
    };

    function process(docs) {
	let self = this;
	
	// using _(docs) for some reason no longer works!
        var filtered = _.filter(docs, function(doc) {
	    return doc.docType !== 'componentGroup';
	});
	return _.forEach(filtered, function(doc, idx) {
	    if (doc.name)
	    {
		doc.state = flUtilities.stateInfo(doc, self.state_root);
	    }
	});
    }
};
