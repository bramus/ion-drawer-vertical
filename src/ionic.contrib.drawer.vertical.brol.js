(function() {

'use strict';

	// ionic.contrib.drawer.vertical, inspired upon ionic.contrib.drawer
	angular.module('ionic.contrib.drawer.vertical', ['ionic'])


	.controller('$drawerVertical', function($element, $attrs, $ionicGesture, $document, $timeout,$ionicPlatform) {

		console.log('controller');

		var $attr = $attrs;

		var el = $element[0];
		var dragging = false;
		var startY, lastY, offsetY, newY;

		// How far to drag before triggering
		var thresholdY = 7;

		// How far from edge before triggering
		var edgeY = 20;

		var DIRECTION_DOWN = 'down';
		var DIRECTION_UP = 'up';
		var STATE_CLOSE = 'close';
		var STATE_OPEN = 'open';

		var isTargetDrag = false;

		var direction = $attr.direction === DIRECTION_UP ? DIRECTION_UP : DIRECTION_DOWN; // Default to DIRECTION_DOWN
		var height = el.clientHeight;
		var docHeight = $document[0].body.clientHeight;

		// Handle back button
	    var unregisterBackAction;

	    // Current State of Drawer
	    var drawerState = STATE_CLOSE;

	    // Drawer overlay
	    // var $overlay = angular.element('<div class="drawer-overlay" />');
	    // var overlayEl = $overlay[0];
	    // var overlayState = STATE_CLOSE;
	    // $element.parent().prepend(overlayEl);

	    // Content container
	    var $content = $element.parent().find('ion-drawer-vertical');
	    var contentEl = $content[0];

	    // var toggleOverlay = function(state) {
	    //   if (overlayState !== state) {
	    //     var timeToRemove = state === STATE_CLOSE ? 300 : 0;

	    //     if (state === STATE_OPEN) {
	    //       $element
	    //         .removeClass('closed')
	    //         .addClass('opened');
	    //     }

	    //     $timeout(function() {
	    //       ionic.requestAnimationFrame(function() {
	    //         var translateY = state === STATE_CLOSE ? '-100' : '0';
	    //         overlayEl.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + translateY + '%, 0)';
	    //         if (state === STATE_CLOSE) {
	    //           $element
	    //             .removeClass('opened')
	    //             .addClass('closed');
	    //         }
	    //       });
	    //     }, timeToRemove)
	    //     overlayState = state;
	    //   }
	    // };

	    var enableAnimation = function() {
	      $element.addClass('animate');
	      // $overlay.addClass('animate');
	      $content.addClass('animate drawer-animated');
	    };

	    var disableAnimation = function() {
	      $element.removeClass('animate');
	      // $overlay.removeClass('animate');
	      $content.removeClass('animate drawer-animated');
	    };

	    // Check if this is on target or not
	    var isTarget = function(targetEl) {
	      while (targetEl) {
	        if (targetEl === el) {
	          return true;
	        }
	        targetEl = targetEl.parentNode;
	      }
	    };

	    var isOpen = function() {
	      return drawerState === STATE_OPEN;
	    };

	    var startDrag = function(e) {
	      // if (!$ionicSideMenuDelegate.canDragContent()) {
	      //   return;
	      // }

	      disableAnimation();
	      toggleOverlay(STATE_OPEN);

	      dragging = true;
	      offsetY = lastY - startY;
	    };

	    var startTargetDrag = function(e) {
	      // if (!$ionicSideMenuDelegate.canDragContent()) {
	      //   return;
	      // }

	      disableAnimation();
	      toggleOverlay(STATE_OPEN);

	      dragging = true;
	      isTargetDrag = true;
	      offsetY = lastY - startY;
	    };

	    var doEndDrag = function(e) {
	      // if (!$ionicSideMenuDelegate.canDragContent()) {
	      //   return;
	      // }

	      startY = lastY = offsetY = null;
	      isTargetDrag = false;

	      if (!dragging) {
	        return;
	      }

	      dragging = false;

	      enableAnimation();

	      var translateY = 0;
	      var opacity = 0;
	      
	      if (direction === DIRECTION_DOWN){
	        if (newY > height / 2) {
	          translateY = height;
	          drawerState = STATE_CLOSE;
	        } else {
	          opacity = 1;
	          drawerState = STATE_OPEN;
	        }      
	      } else if (direction === DIRECTION_UP){
	        if (newY < (-height / 2)) {
	          translateY = -height;
	          drawerState = STATE_CLOSE;
	        } else {
	          opacity = 1;
	          drawerState = STATE_OPEN;
	        }
	      }

	      // toggleOverlay(drawerState);

	      var contentOffsetY = direction === DIRECTION_DOWN ?
	        translateY - height :
	        height + translateY;
	      ionic.requestAnimationFrame(function() {
	        // overlayEl.style.opacity = opacity;
	        el.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + translateY + 'px, 0)';
	        contentEl.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + contentOffsetY + 'px, 0)';
	        $element
	          .removeClass('opened closed')
	          .addClass(drawerState === STATE_OPEN ? 'opened' : 'closed');
	      });
	    };

	/*
	    var doDrag = function(e) {
	      // if (e.defaultPrevented || !$ionicSideMenuDelegate.canDragContent()) {
	      //   return;
	      // }

	      var finger = e.gesture.touches[0];
	      var dir = e.gesture.direction;

	      if (!lastY) {
	        startY = finger.pageY;
	      }

	      lastY = finger.pageY;

	      if (dir === 'left' || dir === 'right') {
	        return;
	      }

	      if (!dragging) {
	        //here at just the beginning of drag
	        // Dragged 15 pixels and finger is by edge
	        if (Math.abs(lastY - startY) > thresholdY) {
	          if (direction === DIRECTION_DOWN){
	            if (isOpen()) {
	              if (dir === DIRECTION_DOWN) {
	                return;
	              }
	            } else {
	              if (dir === DIRECTION_UP) {
	                return;
	              }
	            }
	          } else if (direction === DIRECTION_UP){
	            if (isOpen()) {
	              if (dir === DIRECTION_UP) {
	                return;
	              }
	            } else {
	              if (dir === DIRECTION_DOWN) {
	                return;
	              }
	            }
	          }

	          // if (isTarget(e.target)) {
	          //   startTargetDrag(e);
	          // } else if((startX < edgeX && side === SIDE_LEFT) || (startX > docWidth-edgeX && side === SIDE_RIGHT)) {
	            startDrag(e);
	          // } 
	        }
	      } else {
	        //here when we are dragging
	        e.gesture.srcEvent.stopImmediatePropagation();

	        // if fast gesture
	        if (e.gesture.deltaTime < 200) {
	          if (side === SIDE_LEFT){
	            if (isOpen()) {
	              if (dir === SIDE_LEFT) {
	                return newX = -width;
	              }
	            } else {
	              if (dir === SIDE_RIGHT) {
	                return newX = 0;
	              }
	            }
	          } else if (side === SIDE_RIGHT){
	            if (isOpen()) {
	              if (dir === SIDE_RIGHT) {
	                return newX = width;
	              }
	            } else {
	              if (dir === SIDE_LEFT) {
	                return newX = 0;
	              }
	            }
	          }
	        }

	        if (side === SIDE_LEFT){
	          newX = Math.min(0, (-width + (lastX - offsetX)));
	          var opacity = 1 + (newX / width);
	        } else if (side === SIDE_RIGHT){
	          newX = Math.max(0, (width - (docWidth - lastX + offsetX)));
	          var opacity = 1 - (newX / width);
	        }


	        if (opacity < 0) {
	          opacity = 0;
	          return;
	        }

	        var contentOffsetX = side === SIDE_RIGHT ?
	          newX - width :
	          width + newX;
	        ionic.requestAnimationFrame(function() {
	          overlayEl.style.opacity = opacity;
	          el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
	          contentEl.style[ionic.CSS.TRANSFORM] = 'translate3d(' + contentOffsetX + 'px, 0, 0)';
	          $element
	            .removeClass('closed')
	            .addClass('opened');
	        }); 
	      }

	      if (dragging) {
	        e.gesture.srcEvent.preventDefault();
	      }
	    };
	*/

	    var hardwareBackCallback = function() {
	      this.close();
	    }.bind(this);

	    this.close = function() {
	      drawerState = STATE_CLOSE;
	      enableAnimation();
	      // toggleOverlay(STATE_CLOSE);

	      ionic.requestAnimationFrame(function() {
	        // overlayEl.style.opacity = 0;
	        el.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + (direction === DIRECTION_UP ? '-' : '') + '100%,  0)';
	        contentEl.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
	      });

	      if (unregisterBackAction) {
	        unregisterBackAction();
	      }
	    };

	    this.open = function() {
	      drawerState = STATE_OPEN;
	      enableAnimation();
	      // toggleOverlay(STATE_OPEN);

	      var contentOffsetY = direction === DIRECTION_UP ? height : -height;

	      ionic.requestAnimationFrame(function() {
	        // overlayEl.style.opacity = 1;
	        el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
	        contentEl.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + contentOffsetX +  'px, 0)';
	      });

	      unregisterBackAction = $ionicPlatform.registerBackButtonAction(hardwareBackCallback, 100);
	    };

	    this.isOpen = isOpen;

	    // $ionicGesture.on('drag', doDrag, $document);
	    // $ionicGesture.on('dragend', doEndDrag, $document);
	    // $overlay.on('click', this.close);

	});

})();


// (function() {

// 	if (!IonicModule) var IonicModule = angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']);

// 	IonicModule.service('$drawerVerticalDelegate', ionic.DelegateService([
// 		'open',
// 		'close',
// 		'toggle'
// 	]));

// })();

(function() {

	angular.module('ionic.contrib.drawer.vertical')

	.directive('ionDrawerVerticalHandle', function() {
		return {
			restrict: 'E',
			controller: '$drawerVertical',
			// transclude: true,
			link: function($scope, $element, $attr, ctrl) {
				console.log(ctrl);
				$element.addClass($attr.direction + ' closed');

				$scope.openDrawer = function() {
					ctrl.open();
				};

				$scope.closeDrawer = function() {
					ctrl.close();
				};

				$scope.toggleDrawer = function() {
					if (ctrl.isOpen()) {
						ctrl.close();
					} else {
						ctrl.open();
					}
				};

			}
		}
	});




})();