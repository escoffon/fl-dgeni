// DGeni documentation app

var mod = angular.module('fl.ngdoc', [ 'ui.router', 'ui.bootstrap', 'fl.directives' ]);

mod.config([
    '$locationProvider', '$stateProvider', '$stateRegistryProvider',
    '$urlRouterProvider', 'API_DATA', 'CONTENT_DATA',
    function ($locationProvider, $stateProvider, $stateRegistryProvider,
	      $urlRouterProvider, API_DATA, CONTENT_DATA) {
	// The root state and root URL
	const STATE_ROOT = '{$ state_root $}';
	const URL_ROOT = '{$ url_root $}';

	// Set HTML5 Mode
	const ENABLE_HTML5_MODE = '{$ enable_html5_mode $}';
	if (ENABLE_HTML5_MODE.match(/^y(es)?/i)) $locationProvider.html5Mode(true);
	if (_.isFunction($locationProvider.hashPrefix)) $locationProvider.hashPrefix('!');

	// Configure URL Router to redirect to {$ default_path $} if state doesn't exist
	const DEFAULT_PATH = '{$ default_path $}';
	$urlRouterProvider.otherwise(URL_ROOT + DEFAULT_PATH);

	function addState(newState) {
	    // Creating the states using $stateProvider, but only if not already present.
	    // Some docs may be listed multiple times in the data files.

	    if (!$stateRegistryProvider.get(newState.name))
	    {
		$stateProvider.state(newState);
	    }
	};
	    
	function buildState(doc) {
	    addState({
		name: doc.state.name,
		url: doc.state.url,
		templateUrl: doc.outputPath
	    });

	    // Now do the same for docs that contain other docs

	    angular.forEach(doc.docs, function(doc) {
		buildState(doc);
	    });
	};
	
	// The root state

	addState({ abstract: true, name: STATE_ROOT, url: URL_ROOT });

	// It has a number of child states, from the contents and API data.

	var rootTemplate = '<div class="row">\n  <div class="col-sm-3" fl-tracking="root"><fl-sidebar items="items"></fl-sidebar></div>\n  <div class="col-sm-9" ui-view fl-tracking="root"></div>\n</div>';
	
	angular.forEach(CONTENT_DATA.items, function(area_data, area) {
	    let area_state = STATE_ROOT + '.' + area;

	    addState({
		name: area_state,
		url: '/' + area,
		template: rootTemplate,
		controller: [
		    '$scope',
		    function($scope) {
			$scope.items = API_DATA.items;
		    }
		]
	    });

	    angular.forEach(area_data, function(doc, idx) {
		addState({
		    name: doc.state.name,
		    url: doc.state.url,
		    templateUrl: doc.outputPath
		});
	    });
	});
	
	// now we can load all the child states for the various components
	// We assume the entry points are at index 0 in API_DATA

	angular.forEach(API_DATA.items, function(group, idx) {
	    angular.forEach(group.items, function(doc) {
		buildState(doc);
	    });
	});
    }
]);
