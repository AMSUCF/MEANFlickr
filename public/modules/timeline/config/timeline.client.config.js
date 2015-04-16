'use strict';

// Configuring the Articles module
angular.module('timeline').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timeline', 'timeline', 'item', '/timeline', true);
	}
]);
