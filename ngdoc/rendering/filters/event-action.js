var _ = require('lodash');

module.exports = function() {
  return {
    name: 'eventAction',
    process: function(action) {
	var rv = '';

	switch (action.type)
	{
	case 'emit':
	    rv += 'Emits';
	    break;
	case 'broadcast':
	    rv += 'Broadcasts';
	    break;
	case 'listen':
	    rv += 'Listens';
	    break;
	default:
	    rv += action.type;
	    break;
	}

	rv += ' on ' + action.on;

	return rv;
    }
  };
};
