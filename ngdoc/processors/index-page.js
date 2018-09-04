const _ = require('lodash');

// Sets up the doc object corresponding to the index page and puts it in the doc list.

module.exports = function indexPageProcessor(log, getDocFromAlias) {
    return {
	brand: 'Documentation',
	navbar: [ ],
        $runAfter: ['computeAngularStateProcessor'],
        $runBefore: ['rendering-docs'],
        $process: process
    };

    function process(docs) {
	let doc = {
            docType: 'indexPage',
	    name: this.brand,
            template: 'indexPage.template.html',
            outputPath: 'index.html',
            path: 'index.html',
            id: 'index'
	};

	doc.navbar = _.reduce(this.navbar, function(rv, item, idx) {
	    if (_.isNil(item.id))
	    {
		log.warn('missing :id property for navbar item');
	    }
	    else
	    {
		let ndoc = null;
		let ndocs = getDocFromAlias(item.id);
		if (ndocs.length < 1)
		{
		    log.warn('no content doc with id \'' + item.id + '\'');
		}
		else if (ndocs.length > 1)
		{
		    log.warn('multiple content docs with id \'' + item.id + '\'; using the first one');
		    ndoc = ndocs[0];
		}
		else
		{
		    ndoc = ndocs[0];
		}
	    
		if (ndoc)
		{
		    if (_.isNil(ndoc.state))
		    {
			log.warn('no state defined for doc with id \'' + item.id + '\'');
		    }
		    else
		    {
			rv.push({ state: ndoc.state.name, label: item.label });
		    }
    		}
	    }
	    
	    return rv;
	}, [ ]);

        docs.push(doc);
    }
};
