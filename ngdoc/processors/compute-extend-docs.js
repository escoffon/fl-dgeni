var _ = require('lodash');

// This processor adds the 'extend_docs' property to any docs that contain a nonempty 'extends'

function addExtendDocs(doc, aliasMap, flUtilities) {
    if (doc['extends'])
    {
	var xd = aliasMap.getDocs(doc['extends']);
	doc['extend_docs'] = _.map(xd, function(xd) {
				       // This function does two things:
				       // 1. builds the extend_docs info for a given 'super' type
				       // 2. adds the current doc to the list of 'sub' types.
				       //    We need to account for this pattern:
				       //    A < B < C (A extends B which extends C)
				       //    D < B < C (D extends B which extends C)
				       //    In this case, we visit B from A and D, and then traverse
				       //    C twice from B. If we just push B on the list of C's subtypes,
				       //    it will get pushed twice.
				       //    So, we only push B if it is not already there.

				       if (!xd.subtypes)
				       {
					   xd.subtypes = [ ];
				       }

				       var item = _.find(xd.subtypes, function(dv, dk) {
							     return dv.name == doc.name;
							 });
				       if (!item)
				       {
    					   xd.subtypes.push(doc);
				       }

				       return {
					   id: xd.id,
					   name: xd.name,
					   state: xd.state,
					   type: xd.docType,
					   outputPath: xd.outputPath,
					   path: xd.path
				       };
				   });
	_.forEach(xd, function(d) {
		      addExtendDocs(d, aliasMap, flUtilities);
		  });
    }
};

module.exports = function computeExtendDocsProcessor(aliasMap, flUtilities) {
    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['apiDataProcessor'],
        $process: process
    };

    // The process method takes the list of documents as a parameter.

    function process(docs) {
	_.forEach(docs, function(doc) {
		      addExtendDocs(doc, aliasMap, flUtilities);
		  });
    }
};
