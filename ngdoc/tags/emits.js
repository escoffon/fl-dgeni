module.exports = function(log, createDocMessage) {
    return {
	name: 'emits',
	multi:true,
	transforms: function(doc, tag, value) {
	    var EVENT_RE = /^([^\s]*)\s+on\s+([\S]+)?/;
	    var m = value.match(EVENT_RE);
	    if (m)
	    {
		var note = value.substr(m[0].length).trim();
		if (!doc.actions) doc.actions = [ ];
		doc.actions.push({ type: 'emit', name: m[1], on: m[2], note: note });
	    }
	    else
	    {
    		log.warn(createDocMessage('malformed @emits tag value \'' + value + '\'', doc));
	    }

	    return undefined;
	}
    };
};
