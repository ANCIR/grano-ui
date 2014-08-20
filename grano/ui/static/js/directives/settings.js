grano.directive('gnSettings', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'project': '=',
            'section': '@'
        },
        templateUrl: 'directives/settings.html',
        link: function (scope, element, attrs, model) {
        }
    };
}]);




