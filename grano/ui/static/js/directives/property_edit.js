grano.directive('gnPropertyEdit', ['core', '$http', '$sce', function (core, $http, $sce) {
    return {
        restrict: 'E',
        scope: {
            'property': '=',
            'attribute': '=',
            'fieldClass': '@'
        },
        templateUrl: 'directives/property_edit.html',
        link: function (scope, element, attrs, model) {
            scope.dateOpened = false;

            scope.dateOpen = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                scope.dateOpened = true;
            };
        }
    };
}]);
