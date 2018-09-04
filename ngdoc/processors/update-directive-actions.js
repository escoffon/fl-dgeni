var _ = require('lodash');

// This processor adds the 'actions' property to components and directives that list a controller,
// copying them from the controller doc.

module.exports = function updateDirectiveActionsProcessor(aliasMap, createDocMessage, log) {
    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['computeEventActorsProcessor'],
        $process: process
    };

    // The process method takes the list of documents as a parameter.

    function process(docs) {
	var events = _(docs)
	    .filter(function(doc) {
			// for the time being we don't override directives or components that have 
			// defined actions. Maybe in the future we'll merge from the controller.

			return (((doc.docType == 'directive') || (doc.docType == 'component'))
				&& (!doc.actions || (doc.actions.length < 1))) ? true : false;
		    })

	    .each(function(doc) {
		      if (doc.controller)
		      {
			  var cd = null;
			  var cdocs = aliasMap.getDocs(doc.controller);
			  if (cdocs.length < 1)
			  {
			      log.warn(createDocMessage('no controller doc with name \'' + doc.controller + '\'', doc));
    			  }
			  else if (cdocs.length > 1)
			  {
			      log.warn(createDocMessage('multiple controller docs with name \'' + doc.controller + '\', using first one', doc));
			      cd = cdocs[0];
    			  }
			  else
			  {
			      cd = cdocs[0];
			  }

			  if (cd)
			  {
			      doc.actions = cd.actions;
			  }
		      }
		  });
    }
};
