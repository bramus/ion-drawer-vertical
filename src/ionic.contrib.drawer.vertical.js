(function() {

'use strict';

	angular.module('ionic.contrib.drawer.vertical', ['ionic'])

	.controller('$ionDrawerVertical', function($scope, $element, $attrs, $ionicGesture, $timeout, $q, $ionicHistory, $ionDrawerVerticalDelegate, $ionicScrollDelegate) {

		// We need closure
		var self = this;

		// Possible states the drawer can have
		var STATE_CLOSE = 'closed';
		var STATE_OPEN = 'opened';
		var STATE_DRAGGING = 'dragging';
		var STATE_DRAGGED = 'dragged';
		var STATE_ANIMATING = 'animating';

		// Possible directions the drawer may slide out to
		var DIRECTION_DOWN = 'down';
		var DIRECTION_UP = 'up';

		// Get state & direction
		// default: STATE_OPEN and DIRECTION_DOWN
		var state = ($attrs.state === STATE_CLOSE ? STATE_CLOSE : STATE_OPEN);
		var direction = ($attrs.direction === DIRECTION_UP ? DIRECTION_UP : DIRECTION_DOWN);
		var prevState = state; // Store previous state (limited to STATE_OPEN/STATE_CLOSE) as we'll need that later one, after having dragged the handle

		// Persist the state and direction on the wrapper
		// (needed for animations)
		var $wrapper = $element;
		$wrapper.addClass(state);
		$wrapper.addClass(direction);

		// Height of the contents
		// Based on how much we dragged (compared to this height) we well close automatically or fall back to the opened state)
		var height = $wrapper[0].clientHeight;

		// Get the handle (if any)
		var $handle = $element.find('ion-drawer-vertical-handle');

		// Delegate Stuff
		var deregisterInstance = $ionDrawerVerticalDelegate._registerInstance(
			self, $attrs.delegateHandle, function() {
				return $ionicHistory.isActiveScope($scope);
			}
		);
		$scope.$on('$destroy', function() {
			deregisterInstance();
		});

		// State functions
		var getState = function() {
			return state;
		}
		var isOpen = function() {
			return state == STATE_OPEN;
		}
		var isOrWasOpen = function() {
			return (state == STATE_OPEN) || (prevState == STATE_OPEN);
		}
		var isClosed = function() {
			return state == STATE_CLOSE;
		}
		var isBusyAnimating = function() {
			return state == STATE_ANIMATING;
		}
		var isBusyDragging = function() {
			return state == STATE_DRAGGING;
		}
		var isDoneDragging = function() {
			return state == STATE_DRAGGED;
		}
		this.getState = getState;
		this.isOpen = isOpen;
		this.isOrWasOpen = isOrWasOpen;
		this.isClosed = isClosed;
		this.isBusyDragging = isBusyDragging;
		this.isBusyAnimating = isBusyAnimating;

		// Open the drawer
		var open = function() {
			var q = $q.defer();
			if ((isClosed() || isDoneDragging()) && !isBusyAnimating()) {
				$wrapper.attr('style', ''); // @note: this little trick will remove the inline styles
				state = STATE_ANIMATING;
				$wrapper.removeClass(STATE_CLOSE);
				$wrapper.addClass(STATE_OPEN + ' animate');
				$timeout(function() {
					$wrapper.removeClass('animate');
					state = prevState = STATE_OPEN;
					height = $wrapper[0].clientHeight;
					q.resolve();
				}, 400);
				return q.promise;
			}
			q.resolve();
			return q.promise;
		}
		this.openDrawer = open;

		// Close the drawer
		var close = function() {
			var q = $q.defer();
			if ((isOpen() || isDoneDragging()) && !isBusyAnimating()) {
				$wrapper.attr('style', ''); // @note: this little trick will remove the inline styles
				state = STATE_ANIMATING;
				$wrapper.removeClass(STATE_OPEN);
				$wrapper.addClass(STATE_CLOSE + ' animate');
				$timeout(function() {
					$wrapper.removeClass('animate');
					state = prevState = STATE_CLOSE;
					q.resolve();
				}, 400);
				return q.promise;
			}
			q.resolve();
			return q.promise;
		}
		this.closeDrawer = close;

		// Toggle the drawer
		var toggle = function() {
			if (this.isOpen()) {
				return this.closeDrawer();
			} else {
				return this.openDrawer();
			}
		}
		this.toggleDrawer = toggle;

		var limitNumberBetween = function(number, min, max) {
			number = Math.min(max, number);
			number = Math.max(min, number);
			return number;
		}

		var handleDrag = function(deltaY) {

			// Don't respond to drag if animating automatically
			if (isBusyAnimating()) return;

			// Store the current state (which is STATE_OPEN or STATE_CLOSE) for later
			if (!isBusyDragging()) prevState = state;

			// Update state to dragging
			state = STATE_DRAGGING;

			// Add or Subtract the height based on the direction of the previous state:
			// in some cases the drag position is relative to the bottom or top of the element
			// Also: don't overstretch!
			if (direction == DIRECTION_DOWN) {
				if (prevState == STATE_CLOSE) {
					deltaY -= height;
				}
				deltaY = limitNumberBetween(deltaY, -height, 0);
			}
			if (direction == DIRECTION_UP) {
				if (prevState == STATE_CLOSE) {
					deltaY += height;
				}
				deltaY = limitNumberBetween(deltaY, 0, height);
			}

			// Make drawer follow it all
			$wrapper.css('transform', 'translate3d(0,' + deltaY + 'px,0)');

		}

		var handleDragEnd = function(deltaY, force) {

			// Done dragging manually?
			if (isBusyDragging()) {

				// Update state
				state = STATE_DRAGGED;

				if (direction == DIRECTION_UP) {

					var multiplier = (prevState == STATE_CLOSE) ? -1 : 1;

					// We dragged over 1/3rd of the panel height
					if ((force && deltaY > 0) || (deltaY > multiplier * height / 3)) {
						self.closeDrawer();
					}

					// We didn't drag over halfway
					else {
						self.openDrawer();
					}

				}

				else /* if (direction == DIRECTION_DOWN) */ {

					var multiplier = (prevState == STATE_OPEN) ? -1 : 1;

					// We dragged over 1/3rd of the panel height
					if ((force && deltaY < 0) || deltaY < multiplier * height / 3) {
						self.closeDrawer();
					}

					// We didn't drag over halfway
					else {
						self.openDrawer();
					}

				}


			}

		}

		// Make the panel follow the cursor when dragging
		$handle.length && $ionicGesture.on('drag', ionic.DomUtil.animationFrameThrottle(function(e) {
			handleDrag(e.gesture.deltaY);
		}), $handle);

		// Don't let the element hang in a semi-open state when done dragging
		$handle.length && $ionicGesture.on('dragend', function(e) {
			handleDragEnd(e.gesture.deltaY);
		}, $handle);

		// autoclose-on-scroll activated? Hook it!
		if (($attrs.autocloseOnScroll != undefined) && ($attrs.autocloseOnScroll !== 'false')) {

			$timeout(function() {

				var scrollView = $ionicScrollDelegate.getScrollView();

				if (!scrollView) return;

				if (scrollView.isNative) {
					console.warn('$ionDrawerVertical: cannot set up autoclose-on-scroll as the scrollView is native.');
					return;
				}

				// Monkey patch doTouchStart, doTouchMove, and doTouchEnd so that they trigger events
				var oldDoTouchStart = scrollView.doTouchStart.bind(scrollView);
				scrollView.doTouchStart = function(touches, timeStamp) {

					oldDoTouchStart(touches, timeStamp);

					scrollView.__scrollTopAtTouchStart = scrollView.__scrollTop;
					scrollView.__scrollLeftAtTouchStart = scrollView.__scrollLeft;

					ionic.trigger('scrollview.touchstart', {
						scrollTop: scrollView.__scrollTop,
						scrollLeft: scrollView.__scrollLeft,
						target: scrollView.__container
					});

				}

				var oldDoTouchMove = scrollView.doTouchMove.bind(scrollView);
				scrollView.doTouchMove = function(touches, timeStamp, scale) {

					if (!scrollView.__isTracking) {
						return;
					}

					oldDoTouchMove(touches, timeStamp, scale);

					ionic.trigger('scrollview.touchmove', {
						scrollTop: scrollView.__scrollTop,
						deltaY: scrollView.__scrollTopAtTouchStart - scrollView.__scrollTop,
						scrollLeft: scrollView.__scrollLeft,
						deltaX: scrollView.__scrollLeftAtTouchStart - scrollView.__scrollLeft,
						target: scrollView.__container
					});

				}

				var oldDoTouchEnd = scrollView.doTouchEnd.bind(scrollView);
				scrollView.doTouchEnd = function(e, timeStamp) {

					if (!scrollView.__isTracking) {
						return;
					}
					oldDoTouchEnd(e, timeStamp);

					ionic.trigger('scrollview.touchend', {
						scrollTop: scrollView.__scrollTop,
						deltaY: scrollView.__scrollTopAtTouchStart - scrollView.__scrollTop,
						scrollLeft: scrollView.__scrollLeft,
						deltaX: scrollView.__scrollLeftAtTouchStart - scrollView.__scrollLeft,
						target: scrollView.__container
					});

				}

				ionic.on('scrollview.touchmove', function(e) {

					// @TODO: once the element has reached the closed state during the drag, don't allow one to reopen it during the same drag

					// @TODO: allow for a configurable offset

					if (self.isOrWasOpen()) {
						handleDrag(e.detail.deltaY);
					}

				}, scrollView.__container);

				ionic.on('scrollview.touchend', function(e) {

					if (!self.isClosed()) {
						handleDragEnd(e.detail.deltaY, scrollView.__isDecelerating);
					}

				}, scrollView.__container);

			});

		}

	});

})();

(function() {

	angular.module('ionic.contrib.drawer.vertical')

	.directive('ionDrawerVerticalWrapper', function() {
		return {
			restrict: 'E',
			controller: '$ionDrawerVertical'
		}
	})

	.directive('ionDrawerVerticalHandle', function() {
		return {
			restrict: 'E'
		}
	});


})();

(function() {

	angular.module('ionic.contrib.drawer.vertical')

	.service('$ionDrawerVerticalDelegate', ionic.DelegateService([
		'openDrawer',
		'closeDrawer',
		'toggleDrawer',
		'getState'
	]));


})();