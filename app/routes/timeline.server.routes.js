'use strict';
var timeline = require('../../app/controllers/timeline.server.controller');
	
module.exports = function(app) {
	
	app.get('/tweets/user_timeline/:user', timeline.findTweets);
};
