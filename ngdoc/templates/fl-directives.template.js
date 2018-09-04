angular.module('fl.directives', [ 'ng' ])

    .directive('flTracking',
	       function() {
		   return {
		       restrict: 'A',
		       controller: [
			   '$rootScope', '$scope', '$timeout',
			   function($rootScope, $scope, $timeout) {
			       var self = this;

			       this._$timeout = $timeout;

			       this.$onInit = function() {
				   $scope.$on('fl.tracking.resize', function(evt) {
						  self._resize();
					      });
			       };

			       this.$onDestroy = function() {
				   if (angular.isDefined(jQuery.fl)
				       && angular.isFunction(jQuery.fl.register_tracking_element)
				       && $scope._tracking_element)
				   {
				       jQuery.fl.unregister_tracking_element($scope._tracking_element);
				   }
			       };

			       this._resize = function() {
				   jQuery.fl.track_element_to_window($scope._tel);
			       };
			   }],
		       controllerAs: '$ctrl',
		       link: function(scope, el, attrs, controller, transcludeFn) {
			   if (angular.isString(attrs.flTracking) && (attrs.flTracking != 'none'))
			   {
			       if (angular.isDefined(jQuery.fl)
				   && angular.isFunction(jQuery.fl.register_tracking_element))
			       {
				   var tel;

				   if ((attrs.flTracking == 'root') || (attrs.flTracking.length < 1))
				   {
				       tel = el;
				   }
				   else
				   {
				       tel = el.find(attrs.flTracking);
				   }

				   scope._tel = tel;
				   scope._tracking_element = jQuery.fl.register_tracking_element(tel);

				   controller._$timeout(function() {
							    jQuery.fl.track_element_to_window(tel);
							}, 100);
			       }
			   }
		       }
		   };
	       })

    .directive('flSidebar',
	       function() {
		   return {
		       restrict: 'E',
		       templateUrl: 'flSidebar.html',
		       controller: [
			   '$scope',
			   function($scope) {
			       var self = this;

			       this.states = { };

			       this.flipState = function(name) {
				   self.states[name] = (self.states[name]) ? false : true;
			       };

			       this.stateOpen = function(name) {
				   return (self.states[name]) ? true : false;
			       };

			       this.stateClosed = function(name) {
				   return !self.stateOpen(name);
			       };
			   }],
		       controllerAs: '$ctrl',
		       scope: {
			   items: '<'
		       },
		       link: function(scope, el, attrs, controller, transcludeFn) {
		       }
		   };
	       });
