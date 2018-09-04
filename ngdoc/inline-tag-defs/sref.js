const _ = require('lodash');

const INLINE_SREF = /(\S+)(?:\s+([\s\S]+))?/;

/**
 * @dgService srefInlineTagDef
 * @description
 * Process inline sref tags (of the form {@sref doc_id Some Title}), replacing them with HTML anchors.
 * @kind function
 * @param  {Object} state   The state to match
 * @param  {Function} docs error message
 * @return {String}  The ui-sref directive information
 */

module.exports = function srefInlineTagDef(getDocFromAlias, createDocMessage, log) {
  return {
    name: 'sref',
    description: 'Process inline sref tags (of the form {@sref doc_id Some Title}), replacing them with HTML anchors',
    handler: function(doc, tagName, tagDescription) {
      // Parse out the uri and title
      return tagDescription.replace(INLINE_SREF, function(match, id, title) {
					// We ignore any method specifications in the id, since we can't
					// really map to them.

					var idx = id.indexOf('#');
					var rid = (idx == -1) ? id : id.substr(0, idx);
					var docs = getDocFromAlias(rid, doc);
					var adoc = null;

					if (docs.length < 1)
					{
					    log.warn(createDocMessage('no doc with alias \'' + id + '\'', doc));
    					}
					else if (docs.length > 1)
					{
					    log.warn(createDocMessage('multiple doc with alias \'' + id + '\', using first one', doc));
					    adoc = docs[0];
    					}
					else
					{
					    adoc = docs[0];
					}

					if (!title) title = id;

					if (adoc)
					{
					    if (_.isObject(adoc.state))
					    {
						return '<a ui-sref="' + adoc.state.name + '">' + title + '</a>';
					    }
					    else if (!_.isNil(adoc.xlink))
					    {
						// This is an external link, and we emit a simple <a>

						return '<a href="' + adoc.xlink + '" target="_blank">'
						    + title + '</a>';
					    }
					    else
					    {
						log.warn(createDocMessage('doc with alias \'' + id + '\' has no state', doc));
					    }
					}

					return '<a>' + title + '</a>';
				    });
    }
  };
};
