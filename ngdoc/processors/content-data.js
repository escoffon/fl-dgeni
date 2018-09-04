var _ = require('lodash');

// builds a doc containing the structure of content pages, grouped by module.

module.exports = function contentPagesProcessor(moduleMap) {
    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['rendering-docs'],
        $process: process
    };

    function buildDocData(doc) {
	return {
	    name: doc.name,
	    type: doc.docType,
	    outputPath: doc.outputPath,
	    path: doc.path,
	    state: doc.state
	};
    };

    function makeContentPages(docs) {
	let contents = _(docs)
        // Filtering out to get only 'content' types
	    .filter(function(doc) { return (doc.docType === 'content'); })

        // Sort them via the path, you could also add a sortOrder param
            .sortBy(function(doc) { return doc.path; })

	// Group by module name
	    .groupBy(function(doc) { return doc.module; })

        // Get the value
            .value();
	
        // Convert to data
	// currently we don't sort; not sure what to do here...

        return _.reduce(contents, function(rv, contents, key) {
	    rv[key] = _.map(contents, buildDocData);
	    return rv;
	}, { });
    };

    function process(docs) {
        docs.push({
            name: 'CONTENT_DATA',
            template: 'constant-data.template.js',
            outputPath: 'content-data.js',
            items: makeContentPages(docs)
        });
    }
};
