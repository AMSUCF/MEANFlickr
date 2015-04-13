'use strict';
var path = require('path');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');

/**
 * Create a Photo
 */
exports.create = function(req, res) {
  var photo = new Photo(req.body);
  photo.user = req.user;
  photo.likes.push(req.user._id);
  if(req.files.file) {
    photo.image =req.files.file.path.substring(req.files.file.path.indexOf(path.sep)+path.sep.length-1);
  }  else
    photo.image='default.jpg';
  photo.save(function(err) {
    if (err) {
      console.log('detected error:',errorHandler.getErrorMessage(err));
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({_id:photo._id});
    }
  });
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
  var photo = req.photo;
  //  photo = _.extend(photo , req.body);
  photo.views += 1;
  photo.save(function(err) {
    if (err) {
      console.log('Problem'+err);
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else
      console.log(photo);
      res.jsonp(photo);
  });
};


/**
 * Update a Photo
 */
exports.update = function(req, res) {
	var photo = req.photo ;

	photo = _.extend(photo , req.body);

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

	photo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) { 
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};
/**
 * Likes a photo
 */
exports.like = function(req, res) {
  var user = req.user;
  var containsValue = false;

  // Determine if user is already in 
  for(var i=0; i<req.photo.likes.length; i++) {
    console.log('Comparing ' + req.photo.likes[i] + ' to ' + req.user._id + ' is ' + req.photo.likes[i].equals(req.user._id));
    if(req.photo.likes[i].equals(req.user._id)) {
      containsValue = true;
    }
  }
  if(!containsValue) {
	req.photo.likes.push(req.user._id);
  }
  req.photo.save(function(err) {
    if (err) {
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(req.photo);
	 }
  });
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) {
  console.log('finding by id:'+id);
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
	  if (err) return next(err);
	  if (! photo) return next(new Error('Failed to load Photo ' + id));
	  req.photo = photo;
	  next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
