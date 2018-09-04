const _ = require('lodash');
var path = require('path');
var fs = require('fs');
var cpath = require('canonical-path');

// Sets up the doc object corresponding to the Bootstrap4 source and puts it in the doc list.

module.exports = function uiBootstrap4Processor() {
    return {
	source: 'ui-bootstrap-tpls-3.0.4.min.js',
        $runAfter: ['computeAngularStateProcessor'],
        $runBefore: ['rendering-docs'],
        $process: process
    };

    function process(docs) {
	let self = this;
	let bFile = cpath.resolve(path.dirname(__dirname), 'data', this.source);

	return new Promise(function(resolve, reject) {
	    fs.readFile(bFile, function(err, data) {
		if (err) reject(err);
		resolve(data);
	    });
	})
	    .then(function(data) {
		docs.push({
		    docType: 'Javascript',
		    contents: data,
		    template: 'bootstrap4.template.js',
		    outputPath: self.source,
		    path: self.source,
		    id: 'uiBootstrap4'
		});

		return Promise.resolve(docs);
	    });
    };
};

