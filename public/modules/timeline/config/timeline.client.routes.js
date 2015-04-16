'use strict';

//Setting up route
angular.module('timeline').config(['$stateProvider',
	function($stateProvider) {
		// Timeline state routing
		$stateProvider.
		state('timeline', {
			url: '/timeline',
			templateUrl: 'modules/timeline/views/timeline.client.view.html'
		});
	}
]);