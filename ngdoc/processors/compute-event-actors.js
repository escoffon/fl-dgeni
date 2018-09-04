var _ = require('lodash');

// This processor adds the 'actors' property to event docs

module.exports = function computeEventActorsProcessor(aliasMap, createDocMessage, log) {
    return {
        $runAfter: ['updateDirectiveActionsProcessor'],
        $runBefore: ['rendering-docs'],
        $process: process
    };

    // The process method takes the list of documents as a parameter.

    function process(docs) {
	// The first pass collects all the actions from all the docs into a hash where the keys
	// are global event names and the values are 'actors', information about which code
	// components perform the actions for a given event

	var events = _(docs)
	    .filter(function(doc) {
			return (doc.actions && (doc.actions.length > 0)) ? true : false;
		    })

	    .reduce(function(rv, doc, dk) {
			_.forEach(doc.actions, function(evt) {
				      var ename = evt.name;
				      var ed = null;
				      var edocs = aliasMap.getDocs(ename);
				      if (edocs.length < 1)
				      {
					  log.warn(createDocMessage('no event doc with name \'' + ename + '\'', doc));
    				      }
				      else if (edocs.length > 1)
				      {
					  log.warn(createDocMessage('multiple event docs with name \'' + ename + '\', using first one', doc));
					    ed = edocs[0];
    				      }
				      else
				      {
					  ed = edocs[0];
				      }

				      if (ed)
				      {
					  if (!rv[ename]) rv[ename] = [ ];
					  rv[ename].push({
							     type: evt.type,
							     on: evt.on,
							     note: evt.note,
							     actor: doc
							 });
				      }
				  });
			return rv;
		    }, {});

	// The second pass loads the actors in the corresponding event docs

	_(docs)
	    .filter(function(doc) {
			return doc.docType == 'event';
		    })

	    .each(function(doc, dk) {
		      if (events[doc.name])
		      {
			  doc.actors = events[doc.name];
		      }
		  });
    }
};
