# ion-drawer-vertical

A vertical slide-out panel (toggle panel) for Ionic. Built by Bram(us) Van Damme - [https://www.bram.us](https://www.bram.us)

[![Demo ion-drawer-vertical](https://j.gifs.com/vQod8q.gif)](https://youtu.be/rU1Jv3GNy0E)


## Danger, here be dragons

Do note that this is an early release of `ion-drawer-vertical`. Whilst the basics work, a few things still need tweaking _(the animation speed for example)_ or might change in the future.

## Installation

You may clone this repo or get `ion-drawer-vertical` via Bower:

```bash
bower install ion-drawer-vertical
```

## Usage

Usage is simple: include the source files, inject the project as a dependency and add some markup _[[PEN](http://codepen.io/bramus/pen/zvKOag)]_

1. Refer to the `ionic.contrib.drawer.vertical.js` and `ionic.contrib.drawer.vertical.css` files from within your HTML file:

	```html
	<link href="src/ionic.contrib.drawer.vertical.css" rel="stylesheet">
	<script src="src/ionic.contrib.drawer.vertical.js"></script>
	```

2. Inject `ionic.contrib.drawer.vertical` as a dependency into your Angular app:

	```js
	angular.module('app', [
		'ionic',
		'ionic.contrib.drawer.vertical'
	])
	```

3. Add a `<ion-drawer-vertical-wrapper>` element to your document. Inside it, put a `<ion-drawer-vertical-content>` and an optional `<ion-drawer-vertical-handle>` element.

	```html
	<ion-drawer-vertical-wrapper>
		<ion-drawer-vertical-content>
			<img src="http://lorempixel.com/g/400/200/animals/4/horizontal-giraffe/" alt="Horizontal Giraffe" title="Horizontal Giraffe" />
		</ion-drawer-vertical-content>
		<ion-drawer-vertical-handle />
	</ion-drawer-vertical-wrapper>
	```

### Configuration

Adjust the `direction` _(possible values: `down` [default] and `up`)_ and `state` _(possible values: `opened` [default] and `closed`)_ attributes of the `<ion-drawer-vertical-wrapper>` element if needed. _[[PEN](http://codepen.io/bramus/pen/zvKOag)]_

If any headers and/or footers are present, also set the proper `has-*` classes _(such as `has-header` or `has-footer`)_ on the `<ion-drawer-vertical-wrapper>` element. _[[PEN](http://codepen.io/bramus/pen/jbMNpv)]_

When having a scrollable element (viz. [`ion-scroll`](http://ionicframework.com/docs/api/directive/ionScroll/) or [`ion-content[scroll="true"]`](http://ionicframework.com/docs/api/directive/ionContent/)) it's possible to make the drawer automagically close when scrolling the content in the direction of the drawer itself. Enable it by setting `autoclose-on-scroll` on the `<ion-drawer-vertical-wrapper>` element. _[[PEN](http://codepen.io/bramus/pen/WQGQVN)]_

_(@note: the autoclose feature required some monkey patching of [Ionic's scrollView](https://github.com/driftyco/ionic/blob/master/js/views/scrollView.js) behavior. Above that has not been tested (and won't work) with [Ionic's scrollViewNative](https://github.com/driftyco/ionic/blob/master/js/views/scrollViewNative.js))_

### Events and Functions

`ion-drawer-vertical` automatically binds `drag` events to the `<ion-drawer-vertical-handle>` element if it's present. Dragging said element up/down will make the drawer follow its moves. Upon releasing the handle, the drawer will either revert to its original state, or to the opposite one (e.g. open will become closed) when having dragged far enough _(over 33% of the height of the panel)_.

`ion-drawer-vertical` also ships with a delegate `$ionDrawerVerticalDelegate`. The methods `openDrawer()`, `closeDrawer()`, `toggleDrawer()`, and `getState()` are exposed via this delegate. _[[PEN](http://codepen.io/bramus/pen/pjEzOQ)]_

```js
angular
.module('app', ['ionic.contrib.drawer.vertical', 'ionic'])
.controller('demo', function($scope, $ionDrawerVerticalDelegate) {

	$scope.toggleDrawer = function() {
		$ionDrawerVerticalDelegate.toggleDrawer();
	}

});
```

```html
<body ng-app="app" ng-controller="demo">
	<ion-header-bar class="bar-positive">
		<h1 class="title">ion-drawer-vertical</h1>
		<button class="button" ng-click="toggleDrawer()">Toggle Drawer</button>
	</ion-header-bar>
	<ion-drawer-vertical-wrapper class="has-header" direction="down" state="closed">
		<ion-drawer-vertical-content>[...]</ion-drawer-vertical-content>
		<ion-drawer-vertical-handle />
	</ion-drawer-vertical-wrapper>
	<ion-content>
		[...]
	</ion-content>
</body>
```

When cleverly combining `getState()` with `ngIf` one make the button change text/icon. _[[PEN](http://codepen.io/bramus/pen/RWGbep)]_

```js
angular
.module('app', ['ionic.contrib.drawer.vertical', 'ionic'])
.controller('demo', function($scope, $ionDrawerVerticalDelegate) {

	$scope.toggleDrawer = function() {
		$ionDrawerVerticalDelegate.toggleDrawer();
	}

	$scope.drawerIs = function(state) {
		return $ionDrawerVerticalDelegate.getState() == state;
	}

});
```

```html
<body ng-app="app" ng-controller="demo">
	<ion-header-bar class="bar-positive">
		<h1 class="title">ion-drawer-vertical</h1>
		<button class="button" ng-click="toggleDrawer()">
			<i class="icon ion-ios-arrow-down" ng-show="drawerIs('opened')"></i>
			<i class="icon ion-ios-loop" ng-show="!drawerIs('opened') && !drawerIs('closed')"></i>
			<i class="icon ion-ios-arrow-up" ng-show="drawerIs('closed')"></i>
		</button>
	</ion-header-bar>
	...
</body>
```

Note that when calling methods on the delegate it will control all `ion-drawer-vertical` instances. To target one single / a specific instance use the `$getByHandle` method along with the `delegate-handle` attribute. _[[PEN](http://codepen.io/bramus/pen/PPGYxO)]_

```js
angular
.module('app', ['ionic.contrib.drawer.vertical', 'ionic'])
.controller('demo', function($scope, $ionDrawerVerticalDelegate) {

	$scope.toggleDrawer = function(handle) {
		$ionDrawerVerticalDelegate.$getByHandle(handle).toggleDrawer();
	}

});
```

```html
<body ng-app="app" ng-controller="demo">
	<ion-header-bar class="bar-positive">
		<button class="button" ng-click="toggleDrawer('first')">Toggle First</button>
		<h1 class="title">ion-drawer-vertical</h1>
		<button class="button" ng-click="toggleDrawer('second')">Toggle Second</button>
	</ion-header-bar>
	<ion-drawer-vertical-wrapper class="has-header" direction="down" state="closed" delegate-handle="first">
		<ion-drawer-vertical-content>[...]</ion-drawer-vertical-content>
		<ion-drawer-vertical-handle />
	</ion-drawer-vertical-wrapper>
	<ion-drawer-vertical-wrapper class="has-footer" direction="up" state="closed" delegate-handle="second">
		<ion-drawer-vertical-content>[...]</ion-drawer-vertical-content>
		<ion-drawer-vertical-handle />
	</ion-drawer-vertical-wrapper>
	<ion-content>
		[...]
	</ion-content>
	<ion-footer-bar class="bar-positive">
	</ion-footer-bar>
</body>
```

## Callbacks / Promises

The methods `closeDrawer()`, `openDrawer()`, and `toggleDrawer()` all return a promise (provided by [Angular's `$q`](https://docs.angularjs.org/api/ng/service/$q)) allowing you to have callbacks

```js
$scope.toggleDrawer = function() {
	$ionDrawerVerticalDelegate.toggleDrawer().then(function() {
		$ionDrawerVerticalDelegate.toggleDrawer().then(function() {
			$ionicPopup.alert({
				title: 'Done',
				template: 'Done sliding up and down'
			});
		});
	});
}
```

## Acknowledgements

[`ionic-contrib-drawer`](https://github.com/driftyco/ionic-ion-drawer) has been a source of inspiration / a starting point for `ion-drawer-vertical`.

## License

`ion-drawer-vertical` is released under the MIT public license. See the enclosed `LICENSE` for details.