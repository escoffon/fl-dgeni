var _ = require('lodash');

module.exports = function() {
  return {
    name: 'sref',
    process: function(state, title) {
	return _.template('{@sref ${state} ${title} }')({ state: state, title: title });
    }
  };
};
