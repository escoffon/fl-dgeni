var _ = require('lodash');

// This processor adds the 'mixin_docs' property to any docs that contain a nonempty 'mixins'

function addMixinDocs(doc, aliasMap, flUtilities, createDocMessage, log) {
    if (doc.mixins && (doc.mixins.length > 0))
    {
	doc.mixin_docs = _.map(doc.mixins, function(mixin, midx) {
				   var mdocs = aliasMap.getDocs(mixin);
				   var md = null;

				   if (mdocs.length < 1)
				   {
				       log.warn(createDocMessage('no mixin doc with name \'' + mixin + '\'', doc));
    				   }
				   else if (mdocs.length > 1)
				   {
				       log.warn(createDocMessage('multiple mixin docs with name \'' + mixin + '\', using first one', doc));
				       md = mdocs[0];
    				   }
				   else
				   {
				       md = mdocs[0];
				   }

				   if (md)
				   {
				       return {
					   id: md.id,
					   name: md.name,
					   state: md.state,
					   type: md.docType,
					   outputPath: md.outputPath,
					   path: md.path
				       };
				   }
				   else
				   {
				       return { };
				   }
			       });
    }
    else
    {
	doc.mixin_docs = [ ];
    }
};

module.exports = function computeMixinDocsProcessor(aliasMap, flUtilities, createDocMessage, log) {
    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['apiDataProcessor'],
        $process: process
    };

    function process(docs) {
	_.forEach(docs, function(doc) {
		      addMixinDocs(doc, aliasMap, flUtilities, createDocMessage, log);
		  });
    }
};
