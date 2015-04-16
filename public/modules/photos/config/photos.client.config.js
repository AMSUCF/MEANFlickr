'use strict';

// Configuring the Articles module
angular.module('photos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Photos', 'photos', 'dropdown', '/photos(/create)?', false);
		Menus.addSubMenuItem('topbar', 'photos', 'List Photos', 'photos', false);
		Menus.addSubMenuItem('topbar', 'photos', 'New Photo', 'photos/create', false);
	}
]);
