'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var photos = require('../../app/controllers/photos.server.controller');
  var multer = require('multer');
  
  app.use(multer({ dest:'./public/uploads'}));
  // Photos Routes
  app.route('/photos')
		.get(photos.list)
		.post(users.requiresLogin, photos.create);

	app.route('/photos/:photoId')
		.get(photos.read)
		.put(users.requiresLogin, photos.hasAuthorization, photos.update)
		.delete(users.requiresLogin, photos.hasAuthorization, photos.delete);
	//adds a route for likes
	app.route('/photos/like/:photoId')
        .put(users.requiresLogin, photos.like);
  
	// Finish by binding the Photo middleware
	app.param('photoId', photos.photoByID);
	
};
