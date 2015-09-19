(function() {

'use strict';

	angular.module('ionic.contrib.drawer.vertical', ['ionic'])

	.controller('$ionDrawerVerticalHandle', function($scope, $element, $attrs, $ionicGesture, $timeout, $ionicHistory, $ionDrawerVerticalHandleDelegate) {

		// We need closure
		var self = this;

		// Possible states the drawer can have
		var STATE_CLOSE = 'closed';
		var STATE_OPEN = 'opened';

		// Possible directions the drawer may slide out to
		var DIRECTION_DOWN = 'down';
		var DIRECTION_UP = 'up';

		// Get state & direction
		// default: STATE_OPEN and DIRECTION_DOWN
		var state = ($attrs.state === STATE_CLOSE ? STATE_CLOSE : STATE_OPEN);
		var direction = ($attrs.direction === DIRECTION_UP ? DIRECTION_UP : DIRECTION_DOWN);

		// Parameter which tells if we are animating or not
		var isBusyAnimating = false;

		// Persist the state and direction on the wrapper
		// (needed for animations)
		var $wrapper = $element.parent('ion-drawer-vertical-wrapper');
		$wrapper.addClass(state);
		$wrapper.addClass(direction);

		// Delegate Stuff
		var deregisterInstance = $ionDrawerVerticalHandleDelegate._registerInstance(
			self, $attrs.delegateHandle, function() {
				return $ionicHistory.isActiveScope($scope);
			}
		);
		$scope.$on('$destroy', function() {
			deregisterInstance();
		});

		// Open the drawer
		var open = function() {
			if (!this.isOpen() || isBusyAnimating) {
				isBusyAnimating = true;
				$wrapper.removeClass(STATE_CLOSE);
				$wrapper.addClass(STATE_OPEN + ' animate');
				$timeout(function() {
					$wrapper.removeClass('animate');
					state = STATE_OPEN;
					isBusyAnimating = false;
				}, 400);
			}
		}
		this.open = open;

		// Close the drawer
		var close = function() {
			if (this.isOpen() || isBusyAnimating) {
				isBusyAnimating = true;
				$wrapper.removeClass(STATE_OPEN);
				$wrapper.addClass(STATE_CLOSE + ' animate');
				$timeout(function() {
					$wrapper.removeClass('animate');
					state = STATE_CLOSE;
					isBusyAnimating = false;
				}, 400);
			}
		}
		this.close = close;

		// Toggle the drawer
		var toggle = function() {
			if (this.isOpen()) {
				this.close();
			} else {
				this.open();
			}
		}
		this.toggle = toggle;

		// Check if the drawer is open or not
		var isOpen = function() {
			return state === STATE_OPEN;
		}
		this.isOpen = isOpen;

		// Handle drag up event: open or close (based on direction)
		$ionicGesture.on('dragup', function(e) {

			// Don't do jack if we are already animating
			if (isBusyAnimating) return;

			// Drawer needs to slide up in order to be open, and state is not open: open it!
			if ((direction == DIRECTION_UP) && !self.isOpen()) {
				self.open();
				return;
			}

			// Drawer needs to slide up in order to be closed, and state is open (not closed): close it!
			if ((direction == DIRECTION_DOWN) && self.isOpen()) {
				self.close();
				return;
			}

		}, $element);

		// Handle drag down event: open or close (based on direction)
		$ionicGesture.on('dragdown', function(e) {

			// Don't do jack if we are already animating
			if (isBusyAnimating) return;

			// Drawer needs to slide down in order to be open, and state is not open: open it!
			if ((direction == DIRECTION_DOWN) && !self.isOpen()) {
				self.open();
				return;
			}

			// Drawer needs to slide up in order to be closed, and state is open (not closed): close it!
			if ((direction == DIRECTION_UP) && self.isOpen()) {
				self.close();
				return;
			}

		}, $element);

	});

})();

(function() {

	angular.module('ionic.contrib.drawer.vertical')

	.directive('ionDrawerVerticalWrapper', function() {
		return {
			restrict: 'E'
		}
	})

	.directive('ionDrawerVerticalHandle', function() {
		return {
			restrict: 'E',
			controller: '$ionDrawerVerticalHandle',
			link: function($scope, $element, $attr, ctrl) {

				$scope.openDrawer = function() {
					ctrl.open();
				};

				$scope.closeDrawer = function() {
					ctrl.close();
				};

				$scope.toggleDrawer = function() {
					ctrl.toggle();
				};

			}
		}
	});


})();

(function() {

	angular.module('ionic.contrib.drawer.vertical')

	.service('$ionDrawerVerticalHandleDelegate', ionic.DelegateService([
		'openDrawer',
		'closeDrawer',
		'toggleDrawer'
	]));


})();