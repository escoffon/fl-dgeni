var _ = require('lodash');

module.exports = function apiDataProcessor(moduleMap, aliasMap, flUtilities) {
    return {
        $runAfter: ['computeExtendDocsProcessor'],
        $runBefore: ['rendering-docs'],
        $process: process
    };

    function extractDoc(doc, flUtilities) {
	return {
            name: doc.name,
            state: doc.state,
            type: doc.docType,
            outputPath: doc.outputPath,
            path: doc.path,
	    extend_docs: [ ],
	    mixins: (doc.mixins) ? doc.mixins : [ ]
	};

	return rv;
    };

    function buildModuleDocData(doc, extraData, aliasMap, flUtilities) {
	var a = extractDoc(doc, flUtilities);

	if (doc['extends'])
	{
	    a['extends'] = doc['extends'];
	    a['extend_docs'] = doc['extend_docs'];
	}

	if (doc.mixin_docs)
	{
	    a.mixin_docs = doc.mixin_docs;	    
	}

	return _.assign(a, extraData);
    };

    function makeModulePages(docs) {
        var modulePages = _(docs)
        // Filtering out all the docs that are componentGroups
            .filter(function(doc) {
                return doc.docType !== 'componentGroup';
            })

        // Filtering and grouping by module
            .filter('module')
            .groupBy('module')

        // Map of our module docs
            .map(function(moduleDocs, moduleName) {
                     var moduleDoc = _.find(docs, {
						docType: 'module',
						name: moduleName
					    });

                     // Making sure we don't get any exceptions when the module is undefined
                     if (!moduleDoc) return undefined;

                     // Calling back to our generic method to build the object

                     return buildModuleDocData(moduleDoc, {
						docs: moduleDocs
						    .filter(function(doc) {
								return doc.docType !== 'module';
							    })

						    .map(function(d) {
							     return buildModuleDocData(d, {}, aliasMap, flUtilities);
							 })
					    }, aliasMap, flUtilities);
		 })

        // Removing null items
            .filter()

        // Get the value
            .value();

	// the return value is sorted by name

	return _.sortBy(modulePages, function(e) { return e.name; });
    };

    function makeEventPages(docs) {
	var eventPages = _(docs)

        // We keep docs of type 'event', and those that have events
            .filter(function(doc) {
			return ((doc.docType == 'event')
				|| (doc.events && (doc.events.length > 0)));
		    })

        // OK so now we can build the event list
            .reduce(function(rv, doc) {
			if (doc.docType == 'event')
			{
			    var evt = extractDoc(doc, flUtilities);
			    evt.docs = [ ];
			    if (doc.actors && (doc.actors.length > 0))
			    {
				_.forEach(doc.actors, function(av, ak) {
					      var adocs = aliasMap.getDocs(av.actor.name);
					      var adoc = (adocs.length > 0) ? adocs[0] : null;
					      if (adoc)
					      {
						  var t = extractDoc(adoc, flUtilities);

						  // We change the type of the extracted doc to the type of
						  // the event action, for display purposes

						  t.originalType = t.type;
						  t.type = av.type;
						  if (av.on) t.type += ' on ' + av.on;

						  evt.docs.push(t);
					      }
					  });
			    }

			    rv.push(evt);
			}

			return rv;
		    }, [ ]);

	// the return value is sorted by event name

	return _.sortBy(eventPages, function(e) { return e.name; });
    };

    function makeFilterPages(docs, filter) {
	var pages = _(docs)

        // We keep docs of type 'directive'
            .filter(function(doc) {
			if (_.isFunction(filter))
			{
			    return filter.call(this, doc);
			}
			else
			{
			    return (doc.docType == filter);
			}
		    })

        // OK so now we can build the doc list
            .map(function(doc) {
			return extractDoc(doc, flUtilities);
		    })

	// and get the lazy value from the map
	    .value();

	// the return value is sorted by event name

	return _.sortBy(pages, function(e) { return e.name; });
    };

    function process(docs) {
	var modulePages = makeModulePages(docs);
	var eventPages = makeEventPages(docs);
	var directivePages = makeFilterPages(docs, function(doc) {
						 return (doc.docType == 'directive')
						     || (doc.docType == 'component');
					     });
	var controllerPages = makeFilterPages(docs, 'controller');
	var typePages = makeFilterPages(docs, 'type');
	var servicePages = makeFilterPages(docs, 'service');
	var functionPages = makeFilterPages(docs, 'function');
	var filterPages = makeFilterPages(docs, 'filter');

        docs.push({
		      name: 'API_DATA',
		      template: 'constant-data.template.js',
		      outputPath: 'api-data.js',
		      items: [
			  { name: "Modules", items: modulePages },
			  { name: 'Directives & components', items: directivePages },
			  { name: 'Types', items: typePages },
			  { name: 'Controllers', items: controllerPages },
			  { name: 'Services', items: servicePages },
			  { name: 'Functions', items: functionPages },
			  { name: 'Filters', items: filterPages },
			  { name: "Events", items: eventPages }
		      ]
		  });
    }
};
