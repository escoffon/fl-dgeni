var _ = require('lodash');

/**
 * @dgService externalLinks
 * @description
 *  A service to register links to external packages like Angular services and other Angular
 *  packages. These external packages are registered as docs with type 'xlink' that contain just
 *  enough information to be found by name, and the **xlink** property that contains the external
 *  link. The `@sref` inline tag uses this to generate links to the packages as if they were generated
 *  docs.
 */

module.exports = function externalLinks(aliasMap) {
    return {
	/**
	 * Register external links.
	 * @param  {Array|Object} xlinks An array of objects (or a single object) containing the
	 *  external links to register. Each object has two properties:
	 *  - **name** is the package name (for example: `$http` or `ng-token-auth`). This will be
	 *    placed in the doc's **name** and **aliases** properties.
	 *  - **xlink** is the external link; it will be placed in the doc's **xlink** property.
	 */
	
	register: function(xlink) {
	    var ary = Array.isArray(xlink) ? xlink : [ xlink ];

	    _.forEach(ary, function(xv, xk) {
			  aliasMap.addDoc({
					      docType: 'xlink',
					      name: xv.name,
					      aliases: [ xv.name ],
					      xlink: xv.xlink
					  });
		      });
	}
    };
};
