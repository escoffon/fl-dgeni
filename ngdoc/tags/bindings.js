var ARGS_RE = /(\S+)\s+([=@<&]\??)(\S*)\s+(.*)/m;

module.exports = {
    name: 'bindings',
    multi:true,
    transforms: function(doc, tag, value) {
	var m = value.match(ARGS_RE);
	if (m)
	{
	    if (!doc.bindings)
	    {
		doc.bindings = [ ];
	    }

	    var t = '';
	    switch (m[2][0])
	    {
	    case '@':
		t = 'literal';
		break;
	    case '=':
		t = 'two-way';
		break;
	    case '<':
		t = 'one-way';
		break;
	    case '&':
		t = 'expression';
		break;
	    default:
		t = 'unknown';
		break;
	    }

	    // one final tweak: the value may be multiline, but the re match seems to stop at the end
	    // of the first line, so let's make sure we pick up everything.

	    var idx = value.indexOf(m[4]);
	    return {
		localName: m[1],
		type: m[2][0],
		typeLong: t,
		optional: (m[2].length > 1) ? true : false,
		attrName: (m[3].length > 0) ? m[3] : m[1],
		description: (idx == -1) ? m[4] : value.substr(idx)
	    };
	}

	return undefined;
    }
  };
