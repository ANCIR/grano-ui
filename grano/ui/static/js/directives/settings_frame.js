grano.directive('gnSettingsFrame', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'project': '=',
            'section': '@'
        },
        templateUrl: 'directives/settings_frame.html',
        link: function (scope, element, attrs, model) {
        }
    };
}]);
