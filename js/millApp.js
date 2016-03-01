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
});