grano.directive('gnPropEdit', ['core', '$http', '$sce', 'schemata', function (core, $http, $sce, schemata) {
    return {
        restrict: 'E',
        scope: {
            'property': '=',
            'attribute': '='
        },
        templateUrl: 'directives/propedit.html',
        link: function (scope, element, attrs, model) {
            var update = function() {
                if(scope.attribute && scope.property && scope.attribute.datatype == 'datetime') {
                    scope.property.value = new Date(scope.property.value);
                }
            }
            scope.$watch('attribute', update);
            scope.$watch('property', update);
        }
    };
}]);
