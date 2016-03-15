// create the module and name it
var millApp = angular.module("millApp", []);

// create the directive where the iframe will be added
millApp.directive("vimeoPlayer", function($rootScope, $document, $compile) {
    var vimeoPlayer = {
        // basic Vimeo template
        _template: function(video_id, width, height) {
            return '<iframe src="//player.vimeo.com/video/' + video_id + '" width="' + width + '" height="' + height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        },
        initalize: function(video_id, width, height) {
            //overriding the player height and width because the original too big
            var width=960;
            var height=540;
            return this._template(video_id, width, height);
        }
    }
    return function(scope, element){
        scope.$on("videoInfoChanged", function(event, data) {
            var template = vimeoPlayer.initalize(data.video_id, data.width, data.height);
            element.empty().append($compile(template)(scope))
        });
    };
}),
    
millApp.controller("videoPlayerThumbnailController", function($rootScope, $scope, $http) {
    // promise to recieve data
    $scope.getData = function() {
        // define Vimeo json
        var url = "mill-videos.json";
        var promise = $http.get(url);
        // when the response is recieved
        promise.then(function(response) {
            // set the video data thumbnails to populate from response data
            $scope.videoData = response.data;
            // send the broadcast of the first data
			if (response.data[0]) {
				$scope.changeVideo(response.data[0]);
			}
        });
        // on error, nothing fancy
        promise.catch (function(msg) {
            console.error(msg);
            alert("There was an error with the vimeo api. Please try again later.");
        })
    }
    // show new video
        $scope.changeVideo = function(data) {
        $scope.nowPlaying = data.video_id;
        $rootScope.$broadcast("videoInfoChanged", data);
    }
    // initalize
    $scope.getData();
}),
    
millApp.controller("videoInfoController", function($scope, $sce) {
    // wait for the broadcast then set the data
    $scope.$on("videoInfoChanged", function(event, data) {
        $scope.metadata = data
    });
    $scope.safeHtml = function(html) {
        return $sce.trustAsHtml(html);
    }
}),
    
millApp.controller("formController", function($scope, $http){
    // create a blank object to hold our form information
    $scope.formData = {};
    
    $scope.processForm = function() {
        $http({
        method  : 'POST',
        url     : 'process.php',
        data    : $.param($scope.formData),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            console.log(data);

            if (!data.success) {
              // if not successful, bind errors to error variables
              $scope.errorName = data.errors.name;
              $scope.errorEmail = data.errors.email;
            } else {
              // if successful, bind success message to message
              $scope.message = data.message;
              $scope.errorName = false;
              $scope.errorEmail = false;
            }
        });
    };
});