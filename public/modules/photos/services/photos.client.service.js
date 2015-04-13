'use strict';
// transform the photo (passed in as data) using a fd to submit it using mulitpart.
function transformPhoto(data) {
    if (data === undefined)
      return data;
  console.log('transforming data',data);
    var fd = new FormData();
  fd.append('file', data.file);
  fd.append('name', data.name);
  return fd;
}

angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		return $resource('photos/:photoId', { photoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			save: {
			  method: 'POST',
                          transformRequest: transformPhoto,
                          headers: {'Content-Type': undefined}
			}
		});
	}
]);
