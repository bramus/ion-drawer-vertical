# ion-drawer-vertical

A vertical drawer for Ionic

## Danger, here be dragons

Do note that this is an early release of `ion-drawer-vertical`. Many things are missing _(Installation via `bower`, make the drawer follow the drag position, etc. to name a few)_. Things might change in the future. Or they might remain the same. The plugin works for me. It might not work for you.

## Installation

Add the `ionic.contrib.drawer.vertical.js` and `ionic.contrib.drawer.vertical.css` files to your index file

```
<link href="ion-drawer-vertical/ionic.contrib.drawer.vertical.css" rel="stylesheet">
<script src="ion-drawer-vertical/ionic.contrib.drawer.vertical.js"></script>
```

Add `ionic.contrib.drawer.vertical` to your Angular app:

```
angular.module('app', [
	'ionic',
	'ionic.contrib.drawer'
])
```

## Usage

Add a `<ion-drawer-vertical-wrapper>` element to your document. Inside it, put a `<ion-drawer-vertical-content>` and a `<ion-drawer-vertical-handle>` element.

### Configuration

Adjust the `direction` _(possible values: `down` [default] and `up`)_ and `state` _(possible values: `opened` [default] and `closed`)_ attributes of the `<ion-drawer-vertical-handle>` element if need.

Set the proper `has-*` classes _(such as `has-header` or `has-footer`)_ on the `<ion-drawer-vertical-wrapper>` element if any headers and/or footers are present.

### Example

```
<ion-drawer-vertical-wrapper class="has-header has-footer">
	<ion-drawer-vertical-content>
		<img src="http://lorempixel.com/g/400/200/animals/4/horizontal-giraffe/" alt="Horizontal Giraffe" title="Horizontal Giraffe" />
	</ion-drawer-vertical-content>
	<ion-drawer-vertical-handle direction="down" state="closed" />
</ion-drawer-vertical-wrapper>
```

### Events and Functions

`ion-drawer-vertical` automatically binds `dragup` and `dragdown` events to the `<ion-drawer-vertical-handle>` element. Dragging said element will alter the opened/closed state of the drawer.

The functions `openDrawer()`, `closeDrawer()` and `toggleDrawer()` are exposed into the `$scope` if one wants to manually call these.

## Acknowledgements

[`ionic-contrib-drawer`](https://github.com/driftyco/ionic-ion-drawer) has been a source of inspiration / a starting point for `ion-drawer-vertical`.

## License

`ion-drawer-vertical` is released under the MIT public license. See the enclosed `LICENSE` for details.