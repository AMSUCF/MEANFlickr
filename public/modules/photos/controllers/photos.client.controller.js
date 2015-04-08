'use strict';

//note addition of $http
angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Photos',  
	function($scope, $stateParams, $http, $location, Authentication, Photos) {
	  $scope.authentication = Authentication;

	  $scope.likes = 0;
	  $scope.isLiked = false;
		// Create new Photo
	  $scope.create = function() {
	    // Create new Photo object
	    var photo = new Photos ({
	      name: this.name
	    });
	    photo.$save(function(response) {
	      $location.path('photos/' + response._id);

	      // Clear form fields
	      $scope.name = '';

              $scope.image = '';
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
            
	  };

	  // Remove existing Photo
	  $scope.remove = function(photo) {
	    if ( photo ) { 
	      photo.$remove();
              
	      for (var i in $scope.photos) {
		if ($scope.photos [i] === photo) {
		  $scope.photos.splice(i, 1);
		}
	      }
	    } else {
	      $scope.photo.$remove(function() {
		$location.path('photos');
	      });
	    }
	  };

	  // Update existing Photo
	  $scope.update = function() {
	    var photo = $scope.photo;

	    photo.$update(function() {
	      $location.path('photos/' + photo._id);
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
	  };

	  // Find a list of Photos
	  $scope.find = function() {
	    $scope.photos = Photos.query();
	  };

	  // Find existing Photo
	  $scope.findOne = function() {
            console.log('Finding one:' + $stateParams.photoId);
	    $scope.photo = Photos.get({ 
	      photoId: $stateParams.photoId
	    },function(){
                console.log('Photo found');
                var user = $scope.authentication.user;
                var containsValue=false;
                console.log('ID '+$scope.authentication.user._id);
                $scope.likes = $scope.photo.likes.length;
                for(var i=0; i<$scope.photo.likes.length; i++) {
                  console.log('Comparing ' + $scope.photo.likes[i] + ' to ' + user._id + ' is ' + ($scope.photo.likes[i]===user._id).toString());
                  if($scope.photo.likes[i]===user._id) {
                    containsValue = true;
                  }
                }
                $scope.isLiked = containsValue;
              });

	  };
          
	  //Like a photo
	  $scope.likeThis = function() {
	    var photo = $scope.photo;
	    $http.put('photos/like/' + photo._id).success(function() {
              // Update the photo with our user ID.
              photo.likes.push($scope.authentication.user._id);
              
              $scope.isLiked=true;
	    });

         };   
        }]);