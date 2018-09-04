module.exports = function(log, createDocMessage) {
    return {
	name: 'listens',
	multi:true,
	transforms: function(doc, tag, value) {
	    var EVENT_RE = /^([^\s]*)\s+on\s+([\S]+)?/;
	    var m = value.match(EVENT_RE);
	    if (m)
	    {
		var note = value.substr(m[0].length).trim();
		if (!doc.actions) doc.actions = [ ];
		if (!m[3] || (m[3].length < 1)) m[3] = '$scope';
		doc.actions.push({ type: 'listen', name: m[1], on: m[3], note: note });
	    }
	    else
	    {
    		log.warn(createDocMessage('malformed @listens tag value \'' + value + '\'', doc));
	    }

	    return undefined;
	}
    };
};
